import {initializeApp} from "firebase/app";
import {getAuth, setPersistence, browserSessionPersistence} from "firebase/auth";
import {initializeFirestore, persistentLocalCache} from "firebase/firestore";
import {getFunctions} from "firebase/functions";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {localCache: persistentLocalCache()});
const functions = getFunctions(app, 'us-central1');

// Establecemos la persistencia de la sesión para que el usuario anónimo no se pierda al cerrar la pestaña.
setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error('Error al establecer la persistencia de Auth:', error);
});

export {app, auth, db, functions};

