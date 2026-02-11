import type { Coordinates } from '../types';

/**
 * Obtiene las coordenadas de geolocalización del usuario.
 * Envuelve la API de geolocalización del navegador en una Promesa para un manejo moderno con async/await.
 * @returns Una Promesa que se resuelve con un objeto de Coordenadas.
 * @throws Un error con un mensaje amigable para el usuario si la geolocalización falla.
 */
export const fetchGeolocation = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error('La geolocalización no es soportada por tu navegador.'));
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => {
                let errorMessage = 'Ocurrió un error desconocido al obtener la ubicación.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permiso de ubicación denegado. Por favor, actívalo en los ajustes.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'La información de la ubicación no está disponible en este momento.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'La solicitud para obtener la ubicación ha caducado.';
                        break;
                }
                reject(new Error(errorMessage));
            }
        );
    });
};

/**
 * Busca lugares utilizando la API de Nominatim (OpenStreetMap).
 * @param query Texto a buscar (ej: "Parque Santander")
 * @returns Lista de lugares encontrados con latitud, longitud y nombre.
 */
export const searchLocations = async (query: string): Promise<{ lat: number; lon: number; displayName: string }[]> => {
    try {
        // Limitamos la búsqueda y pedimos formato JSON, Agregamos addressdetails y limit para ser más específicos
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`, {
            headers: {
                'Accept-Language': 'es' // Pedimos resultados en español
            }
        });

        if (response.status === 403) throw new Error("El servicio de búsqueda está saturado. Por favor usa la opción de 'Seleccionar en el Mapa'.");

        if (!response.ok) throw new Error("Error al conectar con el servicio de mapas");

        const data = await response.json();

        return data.map((place: any) => ({
            lat: parseFloat(place.lat),
            lon: parseFloat(place.lon),
            displayName: place.display_name
        }));
    } catch (error) {
        throw error;
    }
};