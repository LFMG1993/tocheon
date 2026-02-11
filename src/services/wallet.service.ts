import {doc, getDoc, collection, query, orderBy, getDocs, runTransaction, setDoc, serverTimestamp, limit} from 'firebase/firestore';
import {db} from '../firebase';
import type {Wallet, WalletTransaction, TransactionType, TransactionSource} from '../types/wallet.type';

export const walletService = {
    // Obtener la billetera (o crearla si no existe)
    getWallet: async (userId: string): Promise<Wallet> => {
        const walletRef = doc(db, 'wallets', userId);
        const snapshot = await getDoc(walletRef);

        if (snapshot.exists()) {
            return snapshot.data() as Wallet;
        } else {
            // Inicializar billetera vacía
            const newWallet: Wallet = {
                userId,
                balance: 0,
                updatedAt: serverTimestamp() as any
            };
            await setDoc(walletRef, newWallet);
            return newWallet;
        }
    },

    // Obtener historial de transacciones
    getTransactions: async (userId: string): Promise<WalletTransaction[]> => {
        const transactionsRef = collection(db, 'wallets', userId, 'transactions');
        const q = query(transactionsRef, orderBy('createdAt', 'desc'), limit(20));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as WalletTransaction));
    },

    // Procesar una transacción (Atomicidad garantizada)
    processTransaction: async (userId: string, amount: number, type: TransactionType, source: TransactionSource, description: string) => {
        const walletRef = doc(db, 'wallets', userId);
        const transactionRef = doc(collection(db, 'wallets', userId, 'transactions'));

        try {
            await runTransaction(db, async (transaction) => {
                const walletDoc = await transaction.get(walletRef);

                let currentBalance = 0;
                if (walletDoc.exists()) {
                    currentBalance = walletDoc.data().balance;
                }

                // Validar fondos si es un débito
                if (type === 'debit' && currentBalance < amount) {
                    throw new Error("Fondos insuficientes en TochCoin");
                }

                const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount;

                // 1. Actualizar saldo
                transaction.set(walletRef, {
                    userId,
                    balance: newBalance,
                    updatedAt: serverTimestamp()
                }, {merge: true});

                // 2. Registrar historial
                transaction.set(transactionRef, {
                    amount,
                    type,
                    source,
                    description,
                    createdAt: serverTimestamp()
                });
            });
        } catch (error) {
            console.error("Error en transacción TochCoin:", error);
            throw error;
        }
    }
};