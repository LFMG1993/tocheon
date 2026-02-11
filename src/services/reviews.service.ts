import {collection, addDoc, getDocs, query, orderBy, Timestamp} from 'firebase/firestore';
import {db} from '../firebase';
import type {Review, User} from '../types';

const COLLECTION = 'reviews';

export const reviewsService = {
    getReviews: async (): Promise<Review[]> => {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Review));
    },

    addReview: async (rating: number, comment: string, user: User) => {
        const newReview = {
            userId: user.uid,
            userName: user.nickname || 'Usuario Toche',
            userPhoto: user.photoURL || null,
            rating,
            comment,
            createdAt: Timestamp.now()
        };

        await addDoc(collection(db, COLLECTION), newReview);
    }
};