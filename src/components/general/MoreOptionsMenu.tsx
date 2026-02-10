import {motion} from 'framer-motion';
import {Info, Star} from 'lucide-react';
import {useAppStore} from '../../store/useAppStore';

export function MoreOptionsMenu() {
    const {toggleMoreMenu} = useAppStore();

    return (
        <>
            {/* Fondo oscuro semi-transparente */}
            <div
                className="fixed inset-0 bg-opacity-10 z-40 transition-opacity"
                onClick={toggleMoreMenu}
            />
            {/* Menú flotante animado */}
            <motion.div
                initial={{opacity: 0, y: 20, scale: 0.95}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, y: 20, scale: 0.95}}
                transition={{duration: 0.15, ease: 'easeOut'}}
                className="fixed bottom-20 right-4 w-56 bg-card rounded-lg shadow-2xl z-50 p-2 border border-border"
            >
                <ul className="space-y-1">
                    <li>
                        <a href="#"
                           className="flex items-center p-2 rounded-md text-foreground hover:bg-muted hover:text-primary transition-colors">
                            <Info className="h-5 w-5 mr-3"/>
                            <span className="font-medium">Acerca de</span>
                        </a>
                    </li>
                    <li>
                        <a href="#"
                           className="flex items-center p-2 rounded-md text-foreground hover:bg-muted hover:text-primary transition-colors">
                            <Star className="h-5 w-5 mr-3"/>
                            <span className="font-medium">Califícanos</span>
                        </a>
                    </li>
                </ul>
            </motion.div>
        </>
    );
}