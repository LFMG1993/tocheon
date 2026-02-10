import {useMap} from "react-leaflet";
import {useAppStore} from "../../store/useAppStore.ts";
import {Crosshair} from "lucide-react";

export default function LocateButton() {
    const map = useMap();
    const {coordinates} = useAppStore();

    const handleLocate = () => {
        if (coordinates) {
            // Usamos flyTo para una animación suave.
            map.flyTo([coordinates.lat, coordinates.lon], 15);
        }
    };

    // Solo mostramos el botón si tenemos las coordenadas del usuario.
    if (!coordinates) return null;

    return (
        <div className="absolute bottom-4 right-4 z-[401] flex items-center space-x-2">
            <div
                className="relative bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                ¡Usted está aquí, Toche!
                <div
                    className="absolute top-1/2 -translate-y-1/2 right-[-4px] w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-primary"
                ></div>
            </div>
            <button onClick={handleLocate} title="Ir a mi ubicación"
                    className="bg-card p-2.5 rounded-md shadow-lg border-2 border-border hover:bg-muted transition-colors">
                <Crosshair className="h-5 w-5 text-foreground"/>
            </button>
        </div>
    );
}