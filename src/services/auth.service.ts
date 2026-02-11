import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    GoogleAuthProvider,
    linkWithCredential,
    linkWithPopup,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    browserLocalPersistence,
    browserSessionPersistence,
    getAdditionalUserInfo,
    type User as FirebaseUser
} from 'firebase/auth';
import {doc, setDoc, updateDoc, serverTimestamp} from 'firebase/firestore';
import {auth, db} from '../firebase';
import type {User} from '../types';
import {walletService} from './wallet.service';

export const authService = {

    logout: async () => {
        return signOut(auth);
    },

    // --- Actualización de Perfil ---
    updateProfile: async (uid: string, data: Partial<User>) => {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, data);
    },

    // --- Vinculación y Login (Google) ---
    linkWithGoogle: async (currentUser: FirebaseUser) => {
        const provider = new GoogleAuthProvider();
        const result = await linkWithPopup(currentUser, provider);
        return result.user;
    },

    loginWithGoogle: async (rememberMe: boolean) => {
        const provider = new GoogleAuthProvider();
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const result = await signInWithPopup(auth, provider);
        let rewardGiven = false;

        // Verificar si es un usuario nuevo para dar el bono
        const details = getAdditionalUserInfo(result);
        if (details?.isNewUser) {
            const user = result.user;
            // Aseguramos que el documento exista antes de la transacción
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                nickname: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                isAnonymous: false
            }, {merge: true});

            await walletService.processTransaction(user.uid, 5, 'credit', 'reward_signup', 'Bono de Bienvenida');
            rewardGiven = true;
        }

        return { result, rewardGiven };
    },

    // --- Vinculación y Login (Email) ---
    linkWithEmail: async (currentUser: FirebaseUser, email: string, pass: string) => {
        const credential = EmailAuthProvider.credential(email, pass);
        const result = await linkWithCredential(currentUser, credential);
        return result.user;
    },

    loginWithEmail: async (email: string, pass: string, rememberMe: boolean) => {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        return signInWithEmailAndPassword(auth, email, pass);
    },

    registerWithEmail: async (email: string, pass: string, phone: string, nickname: string, rememberMe: boolean) => {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            phone: phone,
            nickname: nickname,
            createdAt: serverTimestamp(),
            isAnonymous: false
        });

        // Abonar recompensa de bienvenida
        await walletService.processTransaction(user.uid, 5, 'credit', 'reward_signup', 'Bono de Bienvenida');
        return user;
    },

    // --- Utilidad para actualizar documento post-vinculación ---
    syncUserAfterLink: async (user: FirebaseUser, currentProfile: User | null) => {
        const userRef = doc(db, 'users', user.uid);
        const updates: any = {
            isAnonymous: false,
            email: user.email,
        };

        if (!currentProfile?.nickname && user.displayName) {
            updates.nickname = user.displayName;
        }
        if (!currentProfile?.photoURL && user.photoURL) {
            updates.photoURL = user.photoURL;
        }

        await updateDoc(userRef, updates);
    }
};