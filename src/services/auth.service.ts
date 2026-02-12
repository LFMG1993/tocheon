import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    GoogleAuthProvider,
    linkWithCredential,
    linkWithPopup,
    setPersistence,
    signInWithRedirect,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    browserLocalPersistence,
    browserSessionPersistence,
    getAdditionalUserInfo,
    signInWithCustomToken,
    type User as FirebaseUser
} from 'firebase/auth';
import {doc, setDoc, updateDoc, serverTimestamp, getDoc} from 'firebase/firestore';
import {auth, db} from '../firebase';
import type {User} from '../types';
import {walletService} from './wallet.service';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Helper para asegurar que el teléfono siempre tenga el formato correcto
const normalizePhone = (phone: string) => {
    const clean = phone.replace(/\D/g, '');
    // Si tiene 10 dígitos y empieza por 3 (celular Colombia), agregamos 57
    if (clean.length === 10 && clean.startsWith('3')) {
        return `57${clean}`;
    }
    return clean;
};

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
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            await signInWithRedirect(auth, provider);
            return null;
        } else {
            const result = await signInWithPopup(auth, provider);
            return authService.processGoogleResult(result);
        }
    },

    // Función para procesar el resultado.
    processGoogleResult: async (result: any) => {
        let rewardGiven = false;

        // Verificar si es un usuario nuevo para dar el bono
        const details = getAdditionalUserInfo(result);
        if (details?.isNewUser) {
            const user = result.user;
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

        return {user: result.user, rewardGiven};
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
    },

    // WhatsApp Auth
    sendWhatsAppCode: async (phone: string) => {
        const finalPhone = normalizePhone(phone);
        // Llamamos al Worker
        const response = await fetch(`${API_URL}/api/auth/whatsapp/send`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({telefono: finalPhone})
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || "Error al enviar el código");
        }
        return data;
    },

    loginWithWhatsApp: async (phone: string, code: string, rememberMe: boolean) => {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const finalPhone = normalizePhone(phone);

        // Llamamos al Worker para verificar
        const response = await fetch(`${API_URL}/api/auth/whatsapp/verify`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({telefono: finalPhone, code: code})
        });

        const data = await response.json();

        if (!data.success || !data.token) {
            throw new Error(data.message || "Código inválido");
        }

        // Iniciar sesión en Firebase con el token que generó el Worker
        const userCredential = await signInWithCustomToken(auth, data.token);
        const user = userCredential.user;
        let rewardGiven = false;

        // Verificamos si el documento del usuario ya existe en Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // CASO 1: Usuario Nuevo
            await setDoc(userRef, {
                uid: user.uid,
                phone: user.phoneNumber || finalPhone,
                createdAt: serverTimestamp(),
                isAnonymous: false
            });

            // Damos la recompensa solo porque no existía
            await walletService.processTransaction(user.uid, 5, 'credit', 'reward_signup', 'Bono de Bienvenida (WhatsApp)');
            rewardGiven = true;

        } else {
            // CASO 2: Usuario Existente (Login)
            await setDoc(userRef, {
                phone: user.phoneNumber || finalPhone,
                isAnonymous: false
            }, {merge: true});
        }

        // Retornamos el objeto con la bandera para que el Hook muestre el confeti
        return {user, rewardGiven};
    }
};