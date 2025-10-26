import {useAppStore} from '../store/useAppStore';
import {MapPin, Loader, AlertTriangle, Sparkles, Map} from 'lucide-react';
import type {PlaceSuggestion} from "../store/suggestionsSlice.ts";
import {useEffect} from "react";

export function HomePage() {
    // Nos conectamos la store de Zustand
    const {
        user,
        coordinates,
        loadingLocation,
        locationError,
        getGeolocation,
        suggestions,
        isLoadingSuggestions,
        suggestionsError,
        fetchSuggestions,
    } = useAppStore();

    // Este efecto se encarga de buscar sugerencias ÚNICAMENTE cuando tenemos coordenadas.
    useEffect(() => {
        if (coordinates) {
            fetchSuggestions(coordinates);
        }
    }, [coordinates, fetchSuggestions]);

    return (
        <div className="min-h-screen bg-[var(--toche-light)] p-4 pt-8">
            <div className="max-w-md mx-auto space-y-8">
                {/* --- Saludo Personalizado --- */}
                <header>
                    <h1 className="text-3xl font-bold text-[var(--toche-dark)]">
                        ¡Hola, {user?.nickname || 'Toche'}!
                    </h1>
                    <p className="text-lg text-gray-600">¿Listo para descubrir Cúcuta?</p>
                </header>

                {/* --- Estado de la Ubicación y Contenido Principal --- */}
                <main>
                    {/* Caso 1: Cargando la ubicación */}
                    {loadingLocation && (
                        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg">
                            <Loader className="animate-spin h-10 w-10 text-[var(--toche-primary)] mb-4"/>
                            <p className="font-semibold text-[var(--toche-dark)]">Buscando tu ubicación...</p>
                            <p className="text-sm text-gray-500">Esto nos ayudará a encontrar lo mejor cerca de ti.</p>
                        </div>
                    )}

                    {/* Caso 2: Hubo un error al obtener la ubicación */}
                    {locationError && !loadingLocation && (
                        <div
                            className="p-6 bg-red-50 border-2 border-red-200 rounded-xl shadow-lg space-y-4 text-center">
                            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto"/>
                            <h3 className="font-bold text-red-800">Error de Ubicación</h3>
                            <p className="text-sm text-red-700">{locationError}</p>
                            <button
                                onClick={() => getGeolocation()}
                                className="w-full bg-[var(--toche-dark)] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition-colors"
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    )}

                    {/* Caso 3: ¡Ubicación lista! Mostramos el contenido principal */}
                    {coordinates && !loadingLocation && (
                        <div className="space-y-6">
                            <div
                                className="p-4 bg-green-50 border-2 border-green-200 rounded-xl shadow-lg flex items-center space-x-3">
                                <MapPin className="h-8 w-8 text-green-600 flex-shrink-0"/>
                                <div>
                                    <p className="font-bold text-green-800">¡Ubicación encontrada!</p>
                                    <p className="text-xs text-green-700">
                                        Lat: {coordinates.lat.toFixed(4)}, Lon: {coordinates.lon.toFixed(4)}
                                    </p>
                                </div>
                            </div>

                            {/* Sección de Lugares Cercanos (Placeholder) */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[var(--toche-dark)] flex items-center">
                                    <Sparkles className="h-6 w-6 mr-2 text-[var(--toche-secondary)]"/>
                                    Sugerencias para ti
                                </h2>
                                {/* Aquí iría un componente que liste lugares */}
                                {isLoadingSuggestions && (
                                    <div
                                        className="flex items-center justify-center p-8 bg-white rounded-xl shadow-lg text-gray-500">
                                        <Loader className="animate-spin h-8 w-8 mr-3"/>
                                        <span>Buscando ideas toches...</span>
                                    </div>
                                )}

                                {suggestionsError && !isLoadingSuggestions && (
                                    <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center">
                                        <p className="text-sm text-yellow-700">{suggestionsError}</p>
                                    </div>
                                )}

                                {!isLoadingSuggestions && suggestions && suggestions.length > 0 && (
                                    <div className="space-y-3">
                                        {suggestions.map((place) => (
                                            <SuggestionCard key={place.name} place={place}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// Componente para mostrar cada tarjeta de sugerencia
function SuggestionCard({place}: { place: PlaceSuggestion }) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ", Cúcuta")}`;

    return (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
           className="block bg-white p-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-[var(--toche-dark)]">{place.name}</p>
                    <p className="text-sm font-semibold text-[var(--toche-secondary)]">{place.category}</p>
                    <p className="text-sm text-gray-600 mt-2">{place.description}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full ml-4">
                    <Map className="h-5 w-5 text-blue-600"/>
                </div>
            </div>
        </a>
    );
}
