import {motion} from 'framer-motion';
import {Coins, Wifi} from 'lucide-react';

interface WalletCardProps {
    balance: number;
    userName: string;
    isLoading: boolean;
}

export function WalletCard({balance, userName, isLoading}: WalletCardProps) {
    return (
        <motion.div
            initial={{scale: 0.95, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            className="relative w-full h-48 rounded-2xl overflow-hidden shadow-2xl text-white"
            style={{
                background: 'linear-gradient(135deg, #4a3084 0%, #2a1b54 100%)',
            }}
        >
            {/* Patrón de fondo decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Coins className="w-6 h-6 text-yellow-400" />
                        <span className="font-bold tracking-wider">TochCoin</span>
                    </div>
                    <Wifi className="w-6 h-6 rotate-90 opacity-70" />
                </div>

                <div className="text-center">
                    <p className="text-xs opacity-80 mb-1">Saldo Disponible</p>
                    {isLoading ? (
                        <div className="h-8 w-32 bg-white/20 animate-pulse rounded mx-auto"></div>
                    ) : (
                        <h2 className="text-4xl font-black tracking-tight">{balance.toLocaleString()} TCN</h2>
                    )}
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] opacity-60 uppercase">Titular</p>
                        <p className="font-medium tracking-wide">{userName.toUpperCase()}</p>
                    </div>
                    <p className="text-[10px] opacity-60">Red Privada</p>
                </div>
            </div>
        </motion.div>
    );
}