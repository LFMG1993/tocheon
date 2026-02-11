import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {Home, Gift, Map, Menu, Star, Info, Wallet} from 'lucide-react';
import {AnimatePresence, motion} from 'framer-motion';

export function Dock() {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const toggleMoreMenu = () => setIsMoreMenuOpen(!isMoreMenuOpen);

    const getLinkClassName = ({isActive}: { isActive: boolean }) => {
        const baseClasses = 'flex flex-col items-center justify-center h-full w-full transition-colors duration-200';
        const activeClasses = 'text-primary border-t-2 border-primary';
        const inactiveClasses = 'text-muted-foreground hover:text-foreground';
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    return (
        <>
            {/* Menú Desplegable Integrado en el Dock */}
            <AnimatePresence>
                {isMoreMenuOpen && (
                    <>
                        {/* Backdrop invisible para cerrar al hacer click fuera */}
                        <div
                            className="fixed inset-0 z-[450] bg-black/20 backdrop-blur-[1px]"
                            onClick={toggleMoreMenu}
                        />

                        <div
                            className="fixed bottom-20 left-0 right-0 mx-auto max-w-md z-[500] px-4 flex justify-end pointer-events-none">
                            <motion.div
                                initial={{opacity: 0, y: 20, scale: 0.95}}
                                animate={{opacity: 1, y: 0, scale: 1}}
                                exit={{opacity: 0, y: 20, scale: 0.95}}
                                transition={{duration: 0.2}}
                                className="w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden pointer-events-auto"
                            >
                                <div className="p-2 space-y-1">
                                    <NavLink
                                        to="/about"
                                        onClick={toggleMoreMenu}
                                        className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                                    >
                                        <Info className="w-5 h-5"/>
                                        <span className="text-sm font-medium">Acerca de</span>
                                    </NavLink>
                                    <NavLink
                                        to="/reviews"
                                        onClick={toggleMoreMenu}
                                        className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                                    >
                                        <Star className="w-5 h-5"/>
                                        <span className="text-sm font-medium">Reseñas</span>
                                    </NavLink>
                                    <NavLink
                                        to="/wallet"
                                        onClick={toggleMoreMenu}
                                        className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                                    >
                                        <Wallet className="w-5 h-5"/>
                                        <span className="text-sm font-medium">Billetera</span>
                                    </NavLink>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            <nav
                className="fixed bottom-0 left-0 right-0 mx-auto max-w-md h-16 bg-card border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex items-center justify-around transition-colors duration-300"
            >
                <NavLink to="/" className={getLinkClassName}><Home className="h-6 w-6"/><span
                    className="text-xs">Inicio</span></NavLink>
                <NavLink to="/promotions" className={getLinkClassName}><Gift className="h-6 w-6"/><span
                    className="text-xs">Promos</span></NavLink>
                <NavLink to="/map" className={getLinkClassName}><Map className="h-6 w-6"/><span
                    className="text-xs">Mapa</span></NavLink>
                <button onClick={toggleMoreMenu}
                        className="flex flex-col items-center justify-center h-full w-full text-muted-foreground hover:text-foreground transition-colors">
                    <Menu className="h-6 w-6"/>
                    <span className="text-xs">Más</span>
                </button>
            </nav>
        </>
    );
}