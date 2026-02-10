import {collection, getDocs} from 'firebase/firestore';
import {db} from '../firebase';
import type {Promotion} from "../types";

const COLLECTION_NAME = 'promotions';

export const getPromotions = async (): Promise<Promotion[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Promotion));
    } catch (error) {
        console.error("Error obteniendo promociones:", error);
        return [];
    }
};
