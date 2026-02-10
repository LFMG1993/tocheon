import { useEffect, useState } from 'react';
import { X, Share, PlusSquare, Download } from 'lucide-react';

export const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // 1. Detectar si ya está instalada (Standalone)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        if (isStandalone) {
            setIsInstalled(true);
            return; // No hacer nada si ya está instalada
        }

        // 2. Detectar si es iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // 3. Manejar evento de instalación (Android/Desktop)
        const handler = (e: any) => {
            e.preventDefault();
            setPromptInstall(e);
            setSupportsPWA(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Si es iOS y no está instalada, mostramos el componente (opcionalmente)
        if (isIosDevice && !isStandalone) {
            setSupportsPWA(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // Función para disparar la instalación en Android
    const onClickInstall = async () => {
        if (!promptInstall) {
            if (isIOS) setShowInstructions(true);
            return;
        }
        promptInstall.prompt();
    };

    if (!supportsPWA || isInstalled) return null;

    // --- RENDERIZADO ---

    // Modal de Instrucciones iOS
    if (showInstructions) {
        return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-gray-900 border border-gray-700 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
                    <button
                        onClick={() => setShowInstructions(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <h3 className="text-lg font-bold text-white mb-4">Instalar en iPhone</h3>
                    <ol className="space-y-4 text-sm text-gray-300">
                        <li className="flex items-center gap-3">
                            <span className="bg-gray-800 p-2 rounded-lg"><Share size={20} className="text-blue-500"/></span>
                            <span>1. Toca el botón <b>Compartir</b> abajo.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="bg-gray-800 p-2 rounded-lg"><PlusSquare size={20} className="text-gray-200"/></span>
                            <span>2. Busca y selecciona <b>"Agregar a Inicio"</b>.</span>
                        </li>
                    </ol>
                    <div className="mt-6 text-center text-xs text-gray-500">
                        Así podrás recibir notificaciones y usar la app en pantalla completa.
                    </div>
                </div>
            </div>
        );
    }

    // Banner Flotante Inferior (Discreto pero visible)
    return (
        <div className="fixed bottom-20 left-4 right-4 z-40 md:bottom-6 md:left-auto md:right-6 md:w-96 animate-in slide-in-from-bottom-10">
            <div className="bg-gray-800/90 backdrop-blur-md border border-emerald-500/30 p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4">
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-white mb-1">Instalar App</h4>
                    <p className="text-xs text-gray-400">Mejor rendimiento y pantalla completa.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSupportsPWA(false)}
                        className="p-2 text-gray-400 hover:text-white transition"
                    >
                        <X size={18} />
                    </button>
                    <button
                        onClick={onClickInstall}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-900/20"
                    >
                        <Download size={14} /> Instalar
                    </button>
                </div>
            </div>
        </div>
    );
};