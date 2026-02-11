import type {StateCreator} from 'zustand';

export interface RewardSlice {
    reward: { amount: number; title: string; message: string } | null;
    showReward: (amount: number, title: string, message: string) => void;
    hideReward: () => void;
}

export const createRewardSlice: StateCreator<RewardSlice> = (set) => ({
    reward: null,
    showReward: (amount, title, message) => set({
        reward: { amount, title, message }
    }),
    hideReward: () => set({ reward: null }),
});