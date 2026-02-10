import {useAppStore} from '../store/useAppStore';
import {MapPin, Loader, AlertTriangle, Sparkles} from 'lucide-react';
import {useEffect} from "react";
import {SuggestionCard} from "../components/homepage/SuggestionCard.tsx";

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
        <div className="min-h-screen bg-background p-4 pt-8">
            <div className="max-w-md mx-auto space-y-8">
                {/* --- Saludo Personalizado --- */}
                <header className="flex items-center justify-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground text-center">
                            ¡Hola, {user?.nickname || 'Toche'}!
                        </h1>
                        <p className="text-lg text-muted-foreground">¿Listo para descubrir Cúcuta?</p>
                    </div>
                </header>

                {/* --- Estado de la Ubicación y Contenido Principal --- */}
                <main>
                    {/* Caso 1: Cargando la ubicación */}
                    {loadingLocation && (
                        <div
                            className="flex flex-col items-center text-center p-8 bg-card rounded-xl shadow-lg border border-border">
                            <Loader className="animate-spin h-10 w-10 text-primary mb-4"/>
                            <p className="font-semibold text-foreground">Buscando tu ubicación...</p>
                            <p className="text-sm text-muted-foreground">Esto nos ayudará a encontrar lo mejor cerca de
                                ti.</p>
                        </div>
                    )}

                    {/* Caso 2: Hubo un error al obtener la ubicación */}
                    {locationError && !loadingLocation && (
                        <div
                            className="p-6 bg-red-500/10 border-2 border-red-500/20 rounded-xl shadow-lg space-y-4 text-center">
                            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto"/>
                            <h3 className="font-bold text-red-700 dark:text-red-400">Error de Ubicación</h3>
                            <p className="text-sm text-red-600 dark:text-red-300">{locationError}</p>
                            <button
                                onClick={() => getGeolocation()}
                                className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition-colors"
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    )}

                    {/* Caso 3: ¡Ubicación lista! Mostramos el contenido principal */}
                    {coordinates && !loadingLocation && (
                        <div className="space-y-6">
                            <div
                                className="p-4 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-xl shadow-lg flex items-center space-x-3">
                                <MapPin className="h-8 w-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0"/>
                                <div>
                                    <p className="font-bold text-emerald-800 dark:text-emerald-300">¡Ubicación
                                        encontrada!</p>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                        Lat: {coordinates.lat.toFixed(4)}, Lon: {coordinates.lon.toFixed(4)}
                                    </p>
                                </div>
                            </div>

                            {/* Sección de Lugares Cercanos (Placeholder) */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground flex items-center">
                                    <Sparkles className="h-6 w-6 mr-2 text-primary"/>
                                    Sugerencias para ti
                                </h2>
                                {/* Aquí iría un componente que liste lugares */}
                                {isLoadingSuggestions && (
                                    <div
                                        className="flex items-center justify-center p-8 bg-card rounded-xl shadow-lg text-muted-foreground border border-border">
                                        <Loader className="animate-spin h-8 w-8 mr-3"/>
                                        <span>Buscando ideas toches...</span>
                                    </div>
                                )}

                                {suggestionsError && !isLoadingSuggestions && (
                                    <div
                                        className="p-6 bg-yellow-500/10 border-2 border-yellow-500/20 rounded-xl text-center">
                                        <p className="text-sm text-yellow-700 dark:text-yellow-400">{suggestionsError}</p>
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
