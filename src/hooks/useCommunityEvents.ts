import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    arrayUnion,
    addDoc,
    Timestamp,
    where
} from 'firebase/firestore';
import {db} from '../firebase';
import type {CommunityEvent, User} from '../types';
import {useAppStore} from '../store/useAppStore';
import {walletService} from '../services/wallet.service';

// Hook para leer eventos
export const useCommunityEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CommunityEvent));
        },
        staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
    });
};

// Hook para unirse a eventos
export const useJoinEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({eventId, userId}: { eventId: string, userId: string }) => {
            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, {
                attendees: arrayUnion(userId)
            });
        },
        onSuccess: () => {
            // Al terminar, recargamos automáticamente la lista de eventos
            queryClient.invalidateQueries({queryKey: ['events']});
        }
    });

};

// Hook para crear eventos
export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    const {showReward} = useAppStore();

    return useMutation({
        mutationFn: async ({eventData, user}: { eventData: any, user: User }) => {
            // 1. Validación: Verificar si el usuario ya tiene un evento activo (fecha futura)
            const now = new Date().toISOString();
            const q = query(
                collection(db, 'events'),
                where('creatorId', '==', user.uid),
                where('date', '>', now) // Solo buscamos eventos que aún no han pasado
            );

            const activeEventsSnapshot = await getDocs(q);

            if (!activeEventsSnapshot.empty) {
                throw new Error("Ya tienes un evento activo. Debes esperar a que finalice para crear otro y ganar más TCN.");
            }

            // 2. Crear el evento
            const newEvent = {
                ...eventData,
                creatorId: user.uid,
                creatorName: user.nickname || 'Usuario Toche',
                createdAt: Timestamp.now(),
                attendees: [user.uid], // El creador asiste automáticamente
            };
            await addDoc(collection(db, 'events'), newEvent);

            // 3. Abonar recompensa (2 TCN)
            await walletService.processTransaction(user.uid, 2, 'credit', 'reward_event_creation', 'Creación de Evento');
        },
        onSuccess: () => {
            // Esto fuerza a que useCommunityEvents se ejecute de nuevo inmediatamente
            queryClient.invalidateQueries({queryKey: ['events']});

            // 4. Mostrar alerta de recompensa
            showReward(2, '¡Evento Creado!', 'Has ganado 2 TCN por contribuir a la comunidad.');
        }
    });
};