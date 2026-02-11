import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {createAuthSlice} from './authSlice';
import {createLocationSlice} from './locationSlice';
import {createSuggestionsSlice} from './suggestionsSlice';
import {createCommunitySlice} from "./eventSlice.ts";
import {createRewardSlice, type RewardSlice} from "./rewardSlice.ts";
import type {SuggestionsSlice, AuthSlice, LocationSlice, CommunitySlice} from '../types';


// Combinamos los slices en un único estado de la aplicación
type AppState = AuthSlice & LocationSlice & SuggestionsSlice & CommunitySlice & RewardSlice;

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (...a) => ({
                ...createAuthSlice(...a),
                ...createLocationSlice(...a),
                ...createSuggestionsSlice(...a),
                ...createCommunitySlice(...a),
                ...createRewardSlice(...a),
            }),
            {
                name: 'toche-app-storage', // Un solo nombre para todo el almacenamiento persistente
                partialize: (state) => ({
                    // Aquí elegimos qué propiedades de todo el estado global queremos persistir
                    coordinates: state.coordinates,
                    suggestions: state.suggestions,
                    lastFetchCoordinates: state.lastFetchCoordinates,
                }),
            }
        )
    )
);
