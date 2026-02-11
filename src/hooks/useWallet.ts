import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {walletService} from '../services/wallet.service';
import {useAppStore} from '../store/useAppStore';
import type {TransactionSource, TransactionType} from '../types';

export const useWallet = () => {
    const {user} = useAppStore();

    return useQuery({
        queryKey: ['wallet', user?.uid],
        queryFn: () => {
            if (!user) throw new Error("No user");
            return walletService.getWallet(user.uid);
        },
        enabled: !!user,
    });
};

export const useWalletTransactions = () => {
    const {user} = useAppStore();

    return useQuery({
        queryKey: ['wallet-transactions', user?.uid],
        queryFn: () => {
            if (!user) throw new Error("No user");
            return walletService.getTransactions(user.uid);
        },
        enabled: !!user,
    });
};

// Hook para procesar transacciones (Ganar o Gastar)
export const useProcessTransaction = () => {
    const queryClient = useQueryClient();
    const {user, showReward} = useAppStore();

    return useMutation({
        mutationFn: async (data: {
            amount: number;
            type: TransactionType;
            source: TransactionSource;
            description: string;
        }) => {
            if (!user) throw new Error("No hay usuario autenticado");
            return walletService.processTransaction(
                user.uid,
                data.amount,
                data.type,
                data.source,
                data.description
            );
        },
        onSuccess: (_, variables) => {
            // Refrescamos el saldo y el historial automáticamente al terminar
            queryClient.invalidateQueries({queryKey: ['wallet']});
            queryClient.invalidateQueries({queryKey: ['wallet-transactions']});

            // Si es una ganancia, mostramos la alerta
            if (variables.type === 'credit') {
                showReward(variables.amount, '¡Felicidades!', variables.description);
            }
        },
    });
};