export interface PlaceSuggestion {
    name: string;
    category: string;
    description: string;
    provider?: string;
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

export interface SuggestionResponse {
    suggestions: PlaceSuggestion[];
    provider: string;
}