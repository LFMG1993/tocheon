/**
 * Calcula la distancia en kilómetros entre dos puntos geográficos usando la fórmula de Haversine.
 * @param lat1 - Latitud del primer punto.
 * @param lon1 - Longitud del primer punto.
 * @param lat2 - Latitud del segundo punto.
 * @param lon2 - Longitud del segundo punto.
 * @returns La distancia en kilómetros.
 */
export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}