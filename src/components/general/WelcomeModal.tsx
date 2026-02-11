import {motion} from 'framer-motion';
import {AuthForm} from '../auth/AuthForm';
import {MapPin, Users, Heart, Coins} from 'lucide-react';

export function WelcomeModal() {

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header Visual */}
                <div className="bg-primary/10 p-8 text-center space-y-4">
                    <div className="flex justify-center space-x-4 mb-4">
                        <div className="p-3 bg-white rounded-full shadow-sm"><MapPin className="w-6 h-6 text-primary"/>
                        </div>
                        <div className="p-3 bg-white rounded-full shadow-sm"><Users
                            className="w-6 h-6 text-indigo-500"/></div>
                        <div className="p-3 bg-white rounded-full shadow-sm"><Heart className="w-6 h-6 text-rose-500"/>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Bienvenido a</h1>
                    <img
                        src="/logoTocheon.png"
                        alt="TocheOn"
                        className="h-12 mx-auto object-contain mb-2"
                    />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Conectamos a la comunidad con lugares y hábitos saludables.
                        Descubre rutas alternativas, únete a grupos y vive la ciudad de una forma diferente.
                    </p>
                </div>

                {/* Formulario */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="text-center">
                        <h2 className="text-lg font-bold text-card-foreground flex items-center justify-center gap-2">
                            Únete a la comunidad
                        </h2>
                        <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full mt-2 border border-yellow-200">
                            <Coins className="w-3 h-3" />
                            <p className="text-xs font-bold">Recibe 5 TochCoins de regalo</p>
                        </div>
                    </div>

                    <AuthForm onSuccess={() => {
                    }}/>
                </div>
            </motion.div>
        </div>
    );
}