import type {StateCreator} from "zustand";
import {getDistanceInKm} from '../utils/geolocation';

export interface PlaceSuggestion {
    name: string;
    category: string;
    description: string;
}

export interface Coords {
    lat: number;
    lon: number
}

export interface SuggestionsSlice {
    suggestions: PlaceSuggestion[];
    isLoadingSuggestions: boolean;
    suggestionsError: string | null;
    lastFetchCoordinates: Coords | null;
    fetchSuggestions: (coords?: Coords) => Promise<void>;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const workerUrl = `${baseUrl}/api/suggest`;

export const createSuggestionsSlice: StateCreator<SuggestionsSlice> = (set, get) => ({
    suggestions: [],
    isLoadingSuggestions: false,
    suggestionsError: null,
    lastFetchCoordinates: null,
    fetchSuggestions: async (coords?: Coords) => {
        const {lastFetchCoordinates, suggestions} = get();

        // Si tenemos coordenadas nuevas, verificamos la distancia
        if (coords && lastFetchCoordinates) {
            const distance = getDistanceInKm(
                coords.lat,
                coords.lon,
                lastFetchCoordinates.lat,
                lastFetchCoordinates.lon
            );
            // Si la distancia es menor a 1km, no hacemos nada. Las sugerencias actuales son válidas.
            // Si no hay sugerencias, debemos hacer la consulta sin importar la distancia.
            if (distance < 1 && suggestions.length > 0) {
                return;
            }
        }

        // Iniciamos la carga, pero No limpiamos las sugerencias anteriores.
        set({isLoadingSuggestions: true, suggestionsError: null});
        try {
            const response = await fetch(workerUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(coords || {}),
            });
            if (!response.ok) throw new Error('La respuesta del servidor no fue exitosa.');
            const data = await response.json();
            set({
                suggestions: data as PlaceSuggestion[],
                isLoadingSuggestions: false,
                lastFetchCoordinates: coords || null
            });
        } catch (error) {
            console.error(error);
            set({suggestionsError: 'No se pudieron cargar las sugerencias.', isLoadingSuggestions: false});
        }
    }
});