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