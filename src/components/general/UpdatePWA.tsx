import {useRegisterSW} from 'virtual:pwa-register/react';
import {RefreshCw, AlertCircle} from 'lucide-react';
import {useEffect} from 'react';
import toast from 'react-hot-toast';

export const UpdatePWA = () => {
    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(_r: ServiceWorkerRegistration | undefined) {
        },
        onRegisterError(_error: Error) {
        },
    });

    useEffect(() => {
        if (needRefresh) {
            // Mostramos un toast persistente y personalizado
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-gray-800 shadow-2xl rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-emerald-500`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <AlertCircle className="h-10 w-10 text-emerald-400"/>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-white">
                                    Nueva versión disponible
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Hay una actualización de TocheOn lista.
                                </p>
                                <button
                                    onClick={() => updateServiceWorker(true)}
                                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-all"
                                >
                                    <RefreshCw size={14} className={needRefresh ? "animate-spin" : ""}/>
                                    Actualizar Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ), {duration: Infinity, id: 'pwa-update-toast'});
        }
    }, [needRefresh, updateServiceWorker]);

    return null;
};