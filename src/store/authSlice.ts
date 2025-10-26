import type {StateCreator} from 'zustand';
import type {User} from '../types';
import {auth, db} from '../firebase';
import {onAuthStateChanged, signInAnonymously} from 'firebase/auth';
import {doc, onSnapshot, serverTimestamp, setDoc, updateDoc} from 'firebase/firestore';

export interface AuthSlice {
    user: User | null;
    isAuthReady: boolean;
    signInAnonymouslyAndCreateUser: () => Promise<void>;
    listenToAuthState: () => () => void;
    updateUserProfile: (data: Partial<User>) => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
    user: null,
    isAuthReady: false,
    signInAnonymouslyAndCreateUser: async () => {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);
        // Creamos el documento del usuario en Firestore solo si es la primera vez
        await setDoc(userRef, {uid: user.uid, createdAt: serverTimestamp()}, {merge: true});
    },
    listenToAuthState: () => {
        // Esta variable mantendrá la función para desuscribirse del listener de Firestore.
        let unsubscribeFromSnapshot: (() => void) | null = null;

        const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {

            // 1. Antes de hacer nada, si ya existe un listener de snapshot, lo limpiamos.
            if (unsubscribeFromSnapshot) {
                unsubscribeFromSnapshot();
            }

            set({isAuthReady: true});
            if (user) { // Si el usuario se autentica...
                const userRef = doc(db, 'users', user.uid);

                // 2. Guardamos la nueva función de desuscripción.
                unsubscribeFromSnapshot = onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        // Actualizamos solo el usuario, isAuthReady ya es true.
                        set({user: snapshot.data() as User});
                    }
                });
            } else {
                // Si no hay usuario, simplemente lo establecemos a null.
                set({user: null});
            }
        });

        // 3. Devolvemos la función de desuscripción de onAuthStateChanged.
        return unsubscribeFromAuth;
    },

    updateUserProfile: async (data) => {
        const user = get().user;
        if (!user) throw new Error("No hay un usuario autenticado para actualizar.");

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, data);
        // El listener onSnapshot se encargará de actualizar el estado de la UI automáticamente.
    },
});