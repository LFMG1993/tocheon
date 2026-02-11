import {useState} from 'react';
import {X, MapPin, Activity, Loader, Search, Crosshair} from 'lucide-react';
import {useAppStore} from '../../store/useAppStore';
import {motion} from 'framer-motion';
import toast from 'react-hot-toast';
import {SPORT_CONFIG, type EventType} from '../../types';
import {searchLocations} from '../../services/location.service';
import {useCreateEvent} from '../../hooks/useCommunityEvents';

interface CreateEventModalProps {
    onClose: () => void;
    initialLocation: { lat: number; lon: number };
    initialData?: any; // Para restaurar datos si volvemos de seleccionar mapa
    onPickLocation: (currentData: any) => void; // Callback para iniciar selección
}

export function CreateEventModal({onClose, initialLocation, initialData, onPickLocation}: CreateEventModalProps) {
    const {user} = useAppStore();
    const {mutateAsync: createEventMutation} = useCreateEvent();
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(
        initialData ? `Punto seleccionado (${initialLocation.lat.toFixed(4)}, ${initialLocation.lon.toFixed(4)})` : ''
    );
    const [isSearching, setIsSearching] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);

    const [formData, setFormData] = useState(initialData || {
        title: '',
        description: '',
        date: '',
        sport: 'running' as EventType
    });

    // Función para buscar lugares usando OpenStreetMap (Nominatim)
    const handleSearchLocation = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const results = await searchLocations(searchQuery + ' Cúcuta');

            if (results && results.length > 0) {
                const place = results[0];
                setSelectedLocation({lat: place.lat, lon: place.lon});
                toast.success(`Ubicación actualizada: ${place.displayName.split(',')[0]}`);
            } else {
                toast.error("No se encontraron lugares");
            }
        } catch (e: any) {
            toast.error(e.message || "Error al buscar ubicación");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return toast.error("Debes iniciar sesión");

        setIsLoading(true);
        try {
            await createEventMutation({
                eventData: {...formData, date: new Date(formData.date).toISOString(), location: selectedLocation},
                user
            });
            toast.success("¡Evento creado! La comunidad lo verá en el mapa.");
            onClose();
        } catch (error: any) {
            console.error("Error creando evento:", error);
            toast.error(error.message || "Error al crear el evento");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{y: 100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                    <h3 className="font-bold text-card-foreground flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary"/>
                        Crear Encuentro
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground"/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Buscador de Ubicación */}
                    <div className="bg-muted/30 p-3 rounded-lg border border-border">
                        <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Ubicación del
                            Evento</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Buscar lugar (ej: Parque Santander)"
                                className="flex-1 bg-background border border-border rounded-lg p-2 text-sm outline-none focus:border-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                            />
                            <button
                                type="button"
                                onClick={handleSearchLocation}
                                className="bg-secondary text-secondary-foreground p-2 rounded-lg hover:opacity-90">
                                {isSearching ? <Loader className="w-4 h-4 animate-spin"/> :
                                    <Search className="w-4 h-4"/>}
                            </button>
                        </div>

                        {/* Botón para seleccionar manualmente */}
                        <button
                            type="button"
                            onClick={() => onPickLocation(formData)}
                            className="w-full mt-2 flex items-center justify-center gap-2 text-xs font-bold text-primary bg-primary/10 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                            <Crosshair className="w-3 h-3"/>
                            Seleccionar punto en el mapa
                        </button>

                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3"/>
                            Lat: {selectedLocation.lat.toFixed(4)}, Lon: {selectedLocation.lon.toFixed(4)}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase">Título</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: Trotar 5K en el Malecón"
                            className="w-full bg-background border border-border rounded-lg p-3 mt-1 text-foreground focus:border-primary outline-none"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase">Deporte</label>
                            <select
                                className="w-full bg-background border border-border rounded-lg p-3 mt-1 text-foreground outline-none"
                                value={formData.sport}
                                onChange={e => setFormData({...formData, sport: e.target.value as EventType})}
                            >
                                {Object.entries(SPORT_CONFIG).map(([key, config]) => (
                                    <option key={key} value={key}>{config.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase">Fecha y Hora</label>
                            <input
                                required
                                type="datetime-local"
                                className="w-full bg-background border border-border rounded-lg p-3 mt-1 text-foreground outline-none text-sm"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase">Detalles</label>
                        <textarea
                            rows={3}
                            placeholder="Punto de encuentro exacto, nivel de dificultad, recomendaciones..."
                            className="w-full bg-background border border-border rounded-lg p-3 mt-1 text-foreground focus:border-primary outline-none resize-none"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <button disabled={isLoading} type="submit"
                            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg flex justify-center items-center gap-2">
                        {isLoading ? <Loader className="animate-spin"/> : <MapPin className="w-5 h-5"/>}
                        Publicar en el Mapa
                    </button>
                </form>
            </motion.div>
        </div>
    );
}