import {NavLink} from 'react-router-dom';
import {Home, Gift, Map, Menu} from 'lucide-react';
import {useAppStore} from '../../store/useAppStore';

export function Dock() {
    const toggleMoreMenu = useAppStore((state) => state.toggleMoreMenu);

    const getLinkClassName = ({isActive}: { isActive: boolean }) => {
        const baseClasses = 'flex flex-col items-center justify-center h-full w-full transition-colors duration-200';
        const activeClasses = 'text-primary border-t-2 border-primary';
        const inactiveClasses = 'text-muted-foreground hover:text-foreground';
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    return (
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
    );
}