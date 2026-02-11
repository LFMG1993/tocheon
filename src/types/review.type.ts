import {Timestamp} from 'firebase/firestore';

export interface Review {
    id: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    rating: number; // 1 a 5
    comment: string;
    createdAt: Timestamp;
}