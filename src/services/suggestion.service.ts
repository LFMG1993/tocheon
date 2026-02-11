import type {PlaceSuggestion} from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSuggestions = async (
    lat: number,
    lon: number,
    userPreferences?: string
): Promise<PlaceSuggestion[]> => {
    try {
        const response = await fetch(`${API_URL}/api/suggest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({lat, lon, preferences: userPreferences}),
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.statusText}`);
        }

        const jsonResponse = await response.json();

        let suggestions: PlaceSuggestion[] = [];
        let provider = '';

        // Normalizamos la fuente de datos
        const sourceData = jsonResponse.data || jsonResponse;

        if (sourceData && Array.isArray(sourceData.suggestions)) {
            suggestions = sourceData.suggestions;
            provider = sourceData.provider || jsonResponse.provider || '';
        } else if (Array.isArray(sourceData)) {
            suggestions = sourceData;
            provider = jsonResponse.provider || '';
        }

        return suggestions.map(s => ({...s, provider}));
    } catch (error) {
        console.error("Error en servicio Sugerencias:", error);
        throw error;
    }
};