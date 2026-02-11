import {useWallet, useWalletTransactions} from '../hooks/useWallet';
import {useAppStore} from '../store/useAppStore';
import {WalletCard} from '../components/wallet/WalletCard';
import {ArrowDownLeft, ArrowUpRight, History} from 'lucide-react';
import {motion} from 'framer-motion';

export function WalletPage() {
    const {user} = useAppStore();
    const {data: wallet, isLoading: loadingWallet} = useWallet();
    const {data: transactions, isLoading: loadingTx} = useWalletTransactions();

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <p className="text-muted-foreground">Inicia sesión para ver tu billetera.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-4 pt-8 pb-24 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">Mi Billetera</h1>

            <div className="mb-8">
                <WalletCard
                    balance={wallet?.balance || 0}
                    userName={user.nickname || 'Usuario'}
                    isLoading={loadingWallet}
                />
            </div>

            {/* Acciones Rápidas (Placeholder para futuro) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button disabled
                        className="bg-card border border-border p-4 rounded-xl flex flex-col items-center gap-2 opacity-50 cursor-not-allowed"
                        title="Próximamente">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                        <ArrowDownLeft className="w-5 h-5"/>
                    </div>
                    <span className="text-xs font-bold text-foreground">Recibir</span>
                </button>
                <button disabled
                        className="bg-card border border-border p-4 rounded-xl flex flex-col items-center gap-2 opacity-50 cursor-not-allowed"
                        title="Próximamente">
                    <div className="p-2 bg-red-100 text-red-600 rounded-full">
                        <ArrowUpRight className="w-5 h-5"/>
                    </div>
                    <span className="text-xs font-bold text-foreground">Canjear</span>
                </button>
            </div>

            {/* Historial */}
            <div>
                <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-primary"/>
                    Movimientos Recientes
                </h3>

                <div className="space-y-3">
                    {loadingTx ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Cargando movimientos...</p>
                    ) : transactions?.length === 0 ? (
                        <div className="text-center py-8 bg-muted/20 rounded-xl border border-border">
                            <p className="text-sm text-muted-foreground">Aún no tienes movimientos.</p>
                            <p className="text-xs text-primary mt-1">¡Empieza a interactuar para ganar TCN!</p>
                        </div>
                    ) : (
                        transactions?.map((tx) => (
                            <motion.div
                                key={tx.id}
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                className="bg-card border border-border p-4 rounded-xl flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-bold text-sm text-foreground">{tx.description}</p>
                                    <p className="text-[10px] text-muted-foreground capitalize">{tx.source.replace('_', ' ')} • {tx.createdAt?.toDate().toLocaleDateString()}</p>
                                </div>
                                <span
                                    className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}{tx.amount} TCN
                                </span>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}