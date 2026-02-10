import {useState, useEffect} from 'react';
import {Bell, BellOff, Loader2, BellRing, Inbox} from 'lucide-react';
import {getToken} from "firebase/messaging";
import {messaging} from "../../firebase";
import toast from 'react-hot-toast';
import {motion, AnimatePresence} from 'framer-motion';

export const PushNotificationToggler = () => {
    const [status, setStatus] = useState<NotificationPermission>('default');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setStatus(Notification.permission);
        }
    }, []);

    const handleSubscribe = async () => {
        // Si el usuario ya bloqueó las notificaciones, le avisamos
        if (status === 'denied') {
            toast.error("Las notificaciones están bloqueadas. Habilítalas en la configuración del navegador (candado en la barra de URL).");
            return;
        }

        setLoading(true);
        try {
            const permission = await Notification.requestPermission();
            setStatus(permission);

            if (permission === 'granted') {
                const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
                if (!vapidKey) {
                    throw new Error("Falta la VAPID Key en el archivo .env");
                }
                // Obtenemos el registro del Service Worker de Vite
                const registration = await Promise.race([
                    navigator.serviceWorker.ready,
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("El Service Worker no responde. ¿Estás en modo dev?")), 4000)
                    )
                ]) as ServiceWorkerRegistration;

                // Obtenemos el token usando Firebase
                const token = await getToken(messaging, {
                    vapidKey: vapidKey,
                    serviceWorkerRegistration: registration
                });

                if (token) {
                    console.log('FCM Token:', token);
                    // TODO: Aquí enviarías el token a tu backend para guardarlo en el perfil del usuario
                    toast.success("Notificaciones activadas");
                } else {
                    toast.error("No se pudo generar el token");
                }
            } else {
                toast.error("Permisos denegados");
            }
        } catch (error: any) {
            console.error("Error activando notificaciones:", error);
            toast.error("Error al activar notificaciones");
        } finally {
            setLoading(false);
        }
    };

    // Renderizado condicional del icono
    const renderIcon = () => {
        if (status === 'granted') return <BellRing className="w-6 h-6 text-emerald-500"/>;
        if (status === 'denied') return <BellOff className="w-6 h-6 text-rose-400"/>;
        return <Bell className="w-6 h-6 text-foreground"/>;
    };

    return (
        <div className="relative">
            {/* Botón Principal (Campana) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-muted transition-all active:scale-95 relative z-30"
                title="Notificaciones"
            >
                {renderIcon()}
                {status === 'default' && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--toche-secondary)] rounded-full animate-pulse"/>
                )}
            </button>

            {/* Backdrop invisible para cerrar al hacer click afuera */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsOpen(false)}
                />
            )}
            {/* Desplegable */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{opacity: 0, y: 10, scale: 0.95}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 10, scale: 0.95}}
                        transition={{duration: 0.2}}
                        className="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-2xl border border-border z-30 overflow-hidden origin-top-right"
                    >
                        {/* Header del Dropdown */}
                        <div className="p-4 border-b border-border bg-muted/50 flex justify-between items-center">
                            <h3 className="font-bold text-card-foreground">Notificaciones</h3>
                            <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                                status === 'granted' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                                 {status === 'granted' ? 'Activas' : 'Inactivas'}
                             </span>
                        </div>

                        {/* Sección de Acción (Si no están activas) */}
                        {status !== 'granted' && (
                            <div className="p-4 bg-primary/10 border-b border-primary/20">
                                <p className="text-xs text-primary mb-3">
                                    Activa las notificaciones para recibir alertas de promociones y lugares cercanos.
                                </p>
                                <button
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="w-full py-2 bg-[var(--toche-primary)] hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <BellRing className="w-3 h-3"/>}
                                    {loading ? 'Activando...' : 'Activar Notificaciones'}
                                </button>
                            </div>
                        )}

                        {/* Lista de Notificaciones */}
                        <div className="max-h-64 overflow-y-auto">
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-2">
                                <div className="p-3 bg-muted rounded-full">
                                    <Inbox className="w-6 h-6"/>
                                </div>
                                <p className="text-xs font-medium">No tienes notificaciones nuevas</p>
                            </div>
                        </div>

                        {/* Footer de las Notificaciones */}
                        {status === 'granted' && (
                            <div className="p-2 border-t border-border bg-muted/50 text-center">
                                <button className="text-[10px] text-muted-foreground hover:text-primary font-medium">
                                    Marcar todas como leídas
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};