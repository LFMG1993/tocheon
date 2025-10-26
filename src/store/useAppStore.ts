import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {type AuthSlice, createAuthSlice} from './authSlice';
import {type LocationSlice, createLocationSlice} from './locationSlice';
import {type UiSlice, createUiSlice} from './uiSlice';
import {type SuggestionsSlice, createSuggestionsSlice} from './suggestionsSlice';

// Combinamos los slices en un único estado de la aplicación
type AppState = AuthSlice & LocationSlice & UiSlice & SuggestionsSlice;

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (...a) => ({
                ...createAuthSlice(...a),
                ...createLocationSlice(...a),
                ...createUiSlice(...a),
                ...createSuggestionsSlice(...a),
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
