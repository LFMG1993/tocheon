import {useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Coins, X} from 'lucide-react';
import confetti from 'canvas-confetti';
import {useAppStore} from '../../store/useAppStore';

export function RewardModal() {
    const {reward, hideReward} = useAppStore();

    useEffect(() => {
        if (reward) {
            // Disparar confeti cuando aparece la recompensa
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [reward]);

    return (
        <AnimatePresence>
            {reward && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{scale: 0.5, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.5, opacity: 0}}
                        className="bg-card w-full max-w-sm rounded-3xl shadow-2xl border-2 border-yellow-400/50 overflow-hidden relative"
                    >
                        {/* Fondo radiante */}
                        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-transparent pointer-events-none"/>

                        <button
                            onClick={hideReward}
                            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 text-center relative z-10">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-200 dark:shadow-none">
                                <Coins className="w-10 h-10 text-yellow-600" />
                            </div>

                            <h2 className="text-2xl font-black text-foreground mb-2">{reward.title}</h2>
                            <p className="text-muted-foreground mb-6">{reward.message}</p>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6">
                                <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">Has recibido</p>
                                <p className="text-4xl font-black text-yellow-600 dark:text-yellow-400">+{reward.amount} TCN</p>
                            </div>

                            <button
                                onClick={hideReward}
                                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:scale-105 transition-transform active:scale-95"
                            >
                                ¡Genial!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}