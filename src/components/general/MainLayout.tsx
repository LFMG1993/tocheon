import {Outlet} from 'react-router-dom';
import {AnimatePresence} from 'framer-motion';
import {Dock} from './Dock';
import {MoreOptionsMenu} from './MoreOptionsMenu';
import {useAppStore} from '../../store/useAppStore';

export function MainLayout() {
    const isMoreMenuOpen = useAppStore((state) => state.isMoreMenuOpen);
    return (
        <div className="font-sans flex flex-col h-screen bg-[var(--toche-light)]">
            <main
                className="flex-grow overflow-y-auto pb-20"> {/* Aumentamos el padding para el Dock */}
                <Outlet/> {/* Aquí se renderizará la página actual (HomePage, ProfilePage, etc.) */}
            </main>
            <AnimatePresence>{isMoreMenuOpen && <MoreOptionsMenu/>}</AnimatePresence>
            <Dock/>
        </div>
    );
}