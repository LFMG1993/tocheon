import type {StateCreator} from 'zustand';
import {collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc, arrayUnion} from 'firebase/firestore';
import {db} from '../firebase';
import type {CommunityEvent, CommunitySlice} from '../types';

export const createCommunitySlice: StateCreator<CommunitySlice> = (set, get) => ({
    events: [],
    isLoadingEvents: false,

    fetchEvents: async () => {
        set({isLoadingEvents: true});
        try {
            // Traemos eventos futuros (o de hoy en adelante)
            // Nota: Para simplificar, traemos los últimos creados.
            // En producción, filtrarías por fecha del evento >= hoy.
            const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const events = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CommunityEvent));

            set({events, isLoadingEvents: false});
        } catch (error) {
            console.error("Error fetching events:", error);
            set({isLoadingEvents: false});
        }
    },

    createEvent: async (eventData, user) => {
        try {
            const newEvent = {
                ...eventData,
                creatorId: user.uid,
                creatorName: user.nickname || 'Usuario Toche',
                createdAt: Timestamp.now(),
                attendees: [user.uid], // El creador asiste automáticamente
            };

            await addDoc(collection(db, 'events'), newEvent);

            // Recargamos los eventos
            await get().fetchEvents();
        } catch (error) {
            console.error("Error creating event:", error);
            throw error;

        }
    },

    joinEvent: async (eventId, userId) => {
        try {
            const eventRef = doc(db, 'events', eventId);
            // arrayUnion añade el elemento solo si no existe ya en el array
            await updateDoc(eventRef, {
                attendees: arrayUnion(userId)
            });
            await get().fetchEvents();
        } catch (error) {
            console.error("Error joining event:", error);
            throw error;
        }
    }
});