import {Timestamp} from 'firebase/firestore';
import type {User} from "./user.type.ts";

export type EventType = 'running' | 'cycling' | 'yoga' | 'walking' | 'other';

export interface CommunityEvent {
    id: string;
    creatorId: string;
    creatorName: string; // Para no hacer joins complejos
    title: string;
    description: string;
    sport: EventType;
    date: string; // ISO String para facilitar manejo en inputs
    location: { lat: number; lon: number };
    createdAt: Timestamp;
    attendees: string[];
}

// Configuración visual de los deportes
export const SPORT_CONFIG: Record<EventType, { label: string; color: string; bg: string }> = {
    running: { label: 'Running', color: '#f97316', bg: 'bg-orange-500' }, // Naranja
    cycling: { label: 'Ciclismo', color: '#3b82f6', bg: 'bg-blue-500' }, // Azul
    yoga: { label: 'Yoga', color: '#a855f7', bg: 'bg-purple-500' }, // Morado
    walking: { label: 'Caminata', color: '#22c55e', bg: 'bg-green-500' }, // Verde
    other: { label: 'Otro', color: '#64748b', bg: 'bg-slate-500' } // Gris
};

export interface CommunitySlice {
    events: CommunityEvent[];
    isLoadingEvents: boolean;
    fetchEvents: () => Promise<void>;
    createEvent: (eventData: Omit<CommunityEvent, 'id' | 'creatorId' | 'creatorName' | 'createdAt' | 'attendees'>, user: User) => Promise<void>;
    joinEvent: (eventId: string, userId: string) => Promise<void>;
}