import type {StateCreator} from 'zustand';

export interface UiSlice {
    isMoreMenuOpen: boolean;
    toggleMoreMenu: () => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
    isMoreMenuOpen: false,
    toggleMoreMenu: () => set((state) => ({isMoreMenuOpen: !state.isMoreMenuOpen})),
});