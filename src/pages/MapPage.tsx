import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import {useAppStore} from '../store/useAppStore';
import {Route, HeartPulse} from 'lucide-react';
import {useEffect} from 'react';
import type {LatLngExpression} from 'leaflet';
import LocateButton from "../components/maps/LocateButton.tsx";

// Componente auxiliar para centrar el mapa en las coordenadas del usuario
function ChangeMapView({coords}: { coords: LatLngExpression }) {
    const map = useMap();
    useEffect(() => {
        map.setView(coords, map.getZoom());
    }, [coords, map]);
    return null;
}

export function MapPage() {
    const {coordinates} = useAppStore();

    // Coordenadas por defecto para Cúcuta si no tenemos la ubicación del usuario
    const defaultPosition: LatLngExpression = [7.8939, -72.5078];
    const userPosition: LatLngExpression | null = coordinates ? [coordinates.lat, coordinates.lon] : null;
    const mapCenter = userPosition || defaultPosition;

    return (
        <div className="relative w-full h-full min-h-[400px]">
            {/* Contenedor del Mapa */}
            <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={true} className="w-full h-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Si tenemos la ubicación del usuario, la mostramos con un marcador */}
                {userPosition && (
                    <Marker position={userPosition}>
                        <Popup>
                            ¡Estás aquí! <br/> Buscando rutas saludables cerca de ti.
                        </Popup>
                    </Marker>
                )}
                {/* Este componente se asegura de que el mapa se centre si las coordenadas cambian */}
                {userPosition && <ChangeMapView coords={userPosition}/>}
                <LocateButton/>
            </MapContainer>

            {/* Capa superpuesta con el mensaje "Próximamente" */}
            <div className="absolute inset-0 flex items-start justify-end p-4 z-10 pointer-events-none">
                <div
                    className="max-w-xs text-center bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 pointer-events-auto">
                    <div className="flex justify-center items-center mb-2">
                        <Route className="h-8 w-8 text-[var(--toche-primary)]" strokeWidth={1.5}/>
                        <HeartPulse className="h-5 w-5 text-[var(--toche-secondary)] -ml-3 mt-4" strokeWidth={2.5}/>
                    </div>
                    <h1 className="text-lg font-bold text-[var(--toche-dark)]">
                        Rutas Saludables
                    </h1>
                    <p className="text-base font-semibold text-[var(--toche-secondary)]">
                        ¡Próximamente!
                    </p>
                    <p className="text-gray-600 mt-2 text-xs max-w-sm mx-auto">
                        Pronto podrás ver y crear las mejores rutas para caminar, correr o montar en bicicleta.
                    </p>
                </div>
            </div>
        </div>
    );
}