import type {StateCreator} from "zustand";
import {getDistanceInKm} from '../utils/geolocation';
import type {Coords, SuggestionsSlice} from '../types';
import {fetchSuggestions} from '../services/suggestion.service';

export const createSuggestionsSlice: StateCreator<SuggestionsSlice> = (set, get) => ({
    suggestions: [],
    isLoadingSuggestions: false,
    suggestionsError: null,
    lastFetchCoordinates: null,
    fetchSuggestions: async (coords?: Coords) => {
        const {lastFetchCoordinates, suggestions} = get();

        // El servicio requiere latitud y longitud obligatoriamente
        if (!coords) return;

        // Si tenemos coordenadas nuevas, verificamos la distancia
        if (lastFetchCoordinates) {
            const distance = getDistanceInKm(
                coords.lat,
                coords.lon,
                lastFetchCoordinates.lat,
                lastFetchCoordinates.lon
            );
            // Si la distancia es menor a 1km, no hacemos nada. Las sugerencias actuales son válidas.
            if (distance < 1 && suggestions.length > 0) {
                return;
            }
        }

        // Iniciamos la carga, pero No limpiamos las sugerencias anteriores.
        set({isLoadingSuggestions: true, suggestionsError: null});
        try {
            const data = await fetchSuggestions(coords.lat, coords.lon);

            set({
                suggestions: data,
                isLoadingSuggestions: false,
                lastFetchCoordinates: coords
            });
        } catch (error) {
            console.error(error);
            set({suggestionsError: 'No se pudieron cargar las sugerencias.', isLoadingSuggestions: false});
        }
    }
});