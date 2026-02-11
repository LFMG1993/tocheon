import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from 'react-leaflet';
import {useAppStore} from '../store/useAppStore';
import {Plus, Calendar, User as UserIcon, Users, ChevronDown, MapPin, Check, X, Navigation, Loader} from 'lucide-react';
import {useEffect, useState, useRef} from 'react';
import L, {type LatLngExpression, Map as LeafletMap} from 'leaflet';
import LocateButton from "../components/maps/LocateButton.tsx";
import {CreateEventModal} from "../components/maps/CreateEventModal.tsx";
import toast from 'react-hot-toast';
import {SPORT_CONFIG} from '../types';
import {motion, AnimatePresence} from 'framer-motion';
import {PinIcon} from "../components/icons/PinIcon.tsx";
import {renderToStaticMarkup} from "react-dom/server";
import {useCommunityEvents, useJoinEvent} from "../hooks/useCommunityEvents";

// Componente auxiliar para centrar el mapa en las coordenadas del usuario
function UserLocationTracker({coords, isFollowing}: { coords: LatLngExpression, isFollowing: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (isFollowing) {
            map.flyTo(coords, map.getZoom());
        }
    }, [coords, map, isFollowing]);
    return null;
}

// Componente para detectar interacciones manuales y detener el seguimiento
function MapInteractions({onUserInteraction}: { onUserInteraction: () => void }) {
    useMapEvents({
        dragstart: () => onUserInteraction(),
        click: () => onUserInteraction(),
    });
    return null;
}

export function MapPage() {
    const {coordinates, user} = useAppStore();

    // React Query Hooks
    const {data: events = [], isLoading} = useCommunityEvents();
    const {mutateAsync: joinEventMutation} = useJoinEvent();

    const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEventLocation, setNewEventLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [showEventsList, setShowEventsList] = useState(false);
    const [joiningId, setJoiningId] = useState<string | null>(null);
    const [isPickingLocation, setIsPickingLocation] = useState(false);
    const [draftEventData, setDraftEventData] = useState<any>(null);

    const [isFollowingUser, setIsFollowingUser] = useState(true);

    const markerRefs = useRef<Record<string, L.Marker | null>>({});

    // Coordenadas por defecto para Cúcuta si no tenemos la ubicación del usuario
    const defaultPosition: LatLngExpression = [7.8939, -72.5078];
    const userPosition: LatLngExpression | null = coordinates ? [coordinates.lat, coordinates.lon] : null;
    const mapCenter = userPosition || defaultPosition;

    const handleCreateClick = () => {
        if (!user) {
            toast.error("Inicia sesión para crear eventos");
            return;
        }

        setDraftEventData(null); // Limpiamos datos anteriores para iniciar fresco

        // Usamos el centro actual del mapa como punto sugerido
        const center = mapInstance?.getCenter();
        if (center) {
            setNewEventLocation({lat: center.lat, lon: center.lng}); // Leaflet usa lng
            setShowCreateModal(true);
            setIsFollowingUser(false);
        }
    };

    const handleJoinEvent = async (eventId: string) => {
        if (!user) return toast.error("Inicia sesión para unirte");
        setJoiningId(eventId);
        try {
            await joinEventMutation({eventId, userId: user.uid});
            toast.success("¡Te has unido al evento!");
        } catch (error) {
            toast.error("Error al unirse");
        } finally {
            setJoiningId(null);
        }
    };

    // Inicia el modo de selección manual
    const handleStartPicking = (currentData: any) => {
        setDraftEventData(currentData);
        setShowCreateModal(false);
        setIsPickingLocation(true);
        setIsFollowingUser(false);
        toast("Mueve el mapa para ubicar el evento", {icon: '📍'});
    };

    // Confirma la selección manual
    const handleConfirmLocation = () => {
        if (mapInstance) {
            const center = mapInstance.getCenter();
            setNewEventLocation({lat: center.lat, lon: center.lng});
            setIsPickingLocation(false);
            setShowCreateModal(true); // Reabrimos el modal
        }
    };

    // Función para retomar el seguimiento del usuario
    const handleLocateMe = () => {
        setIsFollowingUser(true);
    };

    // Función para crear iconos personalizados según el deporte
    const createCustomIcon = (sport: keyof typeof SPORT_CONFIG) => {
        const config = SPORT_CONFIG[sport];
        const svgPin = renderToStaticMarkup(<PinIcon color={config.color}/>);
        return L.divIcon({
            className: 'custom-pin-marker',
            html: svgPin,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    };

    return (
        <div className="relative w-full h-full min-h-[400px] max-w-md mx-auto">

            {/* Contenedor del Mapa */}
            <MapContainer
                center={mapCenter}
                zoom={14}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                ref={setMapInstance}
            >
                {/* Detectar cuando el usuario mueve el mapa manualmente */}
                <MapInteractions onUserInteraction={() => setIsFollowingUser(false)}/>
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

                {/* --- Marcadores de Eventos de la Comunidad --- */}
                {events.map(event => (
                    <Marker
                        key={event.id}
                        ref={(el) => {
                            markerRefs.current[event.id] = el;
                        }}
                        position={[event.location.lat, event.location.lon]}
                        icon={createCustomIcon(event.sport)}
                    >
                        <Popup>
                            <div className="p-1 min-w-[200px]">
                                 <span
                                     className="text-[10px] uppercase font-bold text-white px-2 py-0.5 rounded-full"
                                     style={{backgroundColor: SPORT_CONFIG[event.sport].color}}>
                                      {event.sport}
                                 </span>
                                <h3 className="font-bold text-base mt-1">{event.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>

                                <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                                    <Calendar className="w-3 h-3"/>
                                    <span>{new Date(event.date).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                    <UserIcon className="w-3 h-3"/>
                                    <span>Por: {event.creatorName}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                    <Users className="w-3 h-3"/>
                                    <span>{event.attendees?.length || 0} Asistentes</span>
                                </div>

                                {user && event.attendees?.includes(user.uid) ? (
                                    <div
                                        className="w-full mt-3 bg-green-100 text-green-700 text-xs font-bold py-1.5 rounded text-center border border-green-200">
                                        ¡Ya estás inscrito!
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleJoinEvent(event.id)}
                                        disabled={joiningId === event.id}
                                        className="w-full mt-3 bg-primary text-primary-foreground text-xs font-bold py-1.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {joiningId === event.id ? 'Uniéndote...' : '¡Quiero Asistir!'}
                                    </button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Tracker inteligente: Solo centra si isFollowingUser es true */}
                {userPosition && (
                    <UserLocationTracker coords={userPosition} isFollowing={isFollowingUser && !isPickingLocation}/>
                )}
                {/* Envolvemos el botón de localizar para capturar el click y reactivar el seguimiento */}
                <div onClickCapture={handleLocateMe}>
                    <LocateButton/>
                </div>
            </MapContainer>

            {/* --- Widget Superior derecho (Contador y Lista) --- */}
            <div className="absolute top-4 right-4 z-[400]">
                <button
                    onClick={() => setShowEventsList(!showEventsList)}
                    className="bg-card/90 backdrop-blur-md border border-border shadow-lg rounded-xl p-3 flex items-center gap-3 hover:bg-card transition-colors"
                >
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                        {isLoading ? <Loader className="w-5 h-5 animate-spin"/> : <Users className="w-5 h-5"/>}
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Eventos Activos</p>
                        <p className="text-sm font-bold text-foreground flex items-center gap-1">
                            {isLoading ? 'Cargando...' : `${events.length} Disponibles`}
                            {!isLoading && <ChevronDown
                                className={`w-3 h-3 transition-transform ${showEventsList ? 'rotate-180' : ''}`}/>}
                        </p>
                    </div>
                </button>

                <AnimatePresence>
                    {showEventsList && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="mt-2 w-64 bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-xl overflow-hidden max-h-60 overflow-y-auto"
                        >
                            {isLoading ? (
                                <div className="p-4 flex justify-center">
                                    <Loader className="w-5 h-5 animate-spin text-muted-foreground"/>
                                </div>
                            ) : events.length === 0 ? (
                                <p className="p-4 text-xs text-center text-muted-foreground">No hay eventos aún.</p>
                            ) : (
                                events.map(event => (
                                    <button
                                        key={event.id}
                                        onClick={() => {
                                            setIsFollowingUser(false);
                                            mapInstance?.setView([event.location.lat, event.location.lon], 16);
                                            const marker = markerRefs.current[event.id];
                                            if (marker) {
                                                marker.openPopup();
                                            }
                                            setShowEventsList(false);
                                        }}
                                        className="w-full text-left p-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                                    >
                                        <p className="text-xs font-bold text-foreground truncate">{event.title}</p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3"/> {SPORT_CONFIG[event.sport].label}
                                        </p>
                                    </button>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- UI de Selección de Ubicación (Crosshair) --- */}
            {isPickingLocation && (
                <>
                    {/* Mira central fija */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] pointer-events-none">
                        <div className="relative">
                            <MapPin className="w-10 h-10 text-primary drop-shadow-xl -mt-5" strokeWidth={2.5}
                                    fill="white"/>
                            <div
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-black/50 rounded-full blur-[1px]"></div>
                        </div>
                    </div>

                    {/* Botones de Confirmación */}
                    <div className="absolute bottom-8 left-0 right-0 z-[400] flex justify-center gap-4 px-4">
                        <button
                            onClick={() => {
                                setIsPickingLocation(false);
                                setShowCreateModal(true);
                            }}
                            className="bg-white text-gray-700 px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2"
                        >
                            <X className="w-5 h-5"/> Cancelar
                        </button>
                        <button
                            onClick={handleConfirmLocation}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2"
                        >
                            <Check className="w-5 h-5"/> Confirmar Ubicación
                        </button>
                    </div>
                </>
            )}

            {/* --- Botón Flotante para Crear Evento (Solo si no estamos seleccionando) --- */}
            {!isPickingLocation && (
                <div className="absolute bottom-20 right-4 z-[400]">
                    <button
                        onClick={handleCreateClick}
                        className="bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        title="Crear Encuentro"
                    >
                        <Plus className="w-6 h-6" strokeWidth={3}/>
                        <span className="font-bold text-sm">Crea un evento</span>
                    </button>
                </div>
            )}

            {/* --- Modal de Creación --- */}
            {showCreateModal && newEventLocation && (
                <CreateEventModal
                    onClose={() => setShowCreateModal(false)}
                    initialLocation={{lat: newEventLocation.lat, lon: newEventLocation.lon}}
                    initialData={draftEventData}
                    onPickLocation={handleStartPicking}
                />
            )}

            {/* Botón para retomar seguimiento si se perdió */}
            {!isFollowingUser && userPosition && !isPickingLocation && (
                <div className="absolute bottom-36 right-4 z-[400]">
                    <button
                        onClick={handleLocateMe}
                        className="bg-white text-primary p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                        title="Centrar en mi ubicación"
                    >
                        <Navigation className="w-5 h-5"/>
                    </button>
                </div>
            )}
        </div>
    );
}