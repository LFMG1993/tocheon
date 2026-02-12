import type {StateCreator} from 'zustand';
import type {User} from '../types';
import {auth, db} from '../firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {doc, onSnapshot} from 'firebase/firestore';
import type {AuthSlice} from '../types';
import {authService} from "../services/auth.service.ts";


export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
    user: null,
    isAuthReady: false,

    listenToAuthState: () => {
        // Esta variable mantendrá la función para desuscribirse del listener de Firestore.
        let unsubscribeFromSnapshot: (() => void) | null = null;

        const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {

            // 1. Antes de hacer nada, si ya existe un listener de snapshot, lo limpiamos.
            if (unsubscribeFromSnapshot) {
                unsubscribeFromSnapshot();
            }

            if (user) { // Si el usuario se autentica...
                const userRef = doc(db, 'users', user.uid);

                // 2. Guardamos la nueva función de desuscripción.
                unsubscribeFromSnapshot = onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        // Actualizamos solo el usuario, isAuthReady ya es true.
                        set({user: snapshot.data() as User, isAuthReady: true});
                    } else {
                        // Si el documento no existe (caso raro o borrado manual),
                        // marcamos listo pero sin usuario, lo que mostrará el WelcomeModal correctamente.
                        set({user: null, isAuthReady: true});
                    }
                });
            } else {
                // Si no hay usuario, simplemente lo establecemos a null.
                set({user: null, isAuthReady: true});
            }
        });

        // 3. Devolvemos la función de desuscripción de onAuthStateChanged.
        return unsubscribeFromAuth;
    },

    updateUserProfile: async (data) => {
        const user = get().user;
        if (!user) throw new Error("No hay un usuario autenticado para actualizar.");

        await authService.updateProfile(user.uid, data);
    },

    linkWithGoogle: async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const linkedUser = await authService.linkWithGoogle(currentUser);
        await authService.syncUserAfterLink(linkedUser, get().user);
    },

    linkWithEmail: async (email, password) => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const linkedUser = await authService.linkWithEmail(currentUser, email, password);
        await authService.syncUserAfterLink(linkedUser, get().user);
    },

    loginWithGoogle: async (rememberMe = false) => {
        await authService.loginWithGoogle(rememberMe);
    },

    loginWithEmail: async (email, password, rememberMe = false) => {
        await authService.loginWithEmail(email, password, rememberMe);
    },

    registerWithEmail: async (email, password, phone, nickname, rememberMe = false) => {
        await authService.registerWithEmail(email, password, phone, nickname, rememberMe);
    },

    logout: async () => {
        await authService.logout();
        set({user: null});
    },
});