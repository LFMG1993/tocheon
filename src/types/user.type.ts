import { Timestamp } from 'firebase/firestore';

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface User {
    uid: string;
    createdAt: Timestamp;
    isAnonymous?: boolean;
    nickname?: string;
    photoURL?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    neighborhood?: string;
}