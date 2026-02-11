import {Timestamp} from 'firebase/firestore';

export type TransactionType = 'credit' | 'debit'; // credit = ganancia, debit = gasto
export type TransactionSource =
    'reward_login' |
    'reward_review' |
    'reward_event' |
    'redeem_promo' |
    'admin_adjustment' |
    'reward_signup' |
    'reward_event_creation';

export interface Wallet {
    userId: string;
    balance: number;
    updatedAt: Timestamp;
}

export interface WalletTransaction {
    id: string;
    amount: number;
    type: TransactionType;
    source: TransactionSource;
    description: string;
    createdAt: Timestamp;
}