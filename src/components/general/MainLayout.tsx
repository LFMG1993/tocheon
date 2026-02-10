import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {AnimatePresence} from 'framer-motion';
import {Dock} from './Dock';
import {MoreOptionsMenu} from './MoreOptionsMenu';
import {useAppStore} from '../../store/useAppStore';
import {TopBar} from "./TopBar.tsx";
import {ProfileModal} from "./ProfileModal.tsx";

export function MainLayout() {
    const isMoreMenuOpen = useAppStore((state) => state.isMoreMenuOpen);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    return (
        <div className="font-sans flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
            <TopBar onOpenProfile={() => setIsProfileOpen(true)} />
            <main
                className="flex-grow overflow-y-auto pb-20 pt-16">
                <Outlet/>
            </main>
            <AnimatePresence>{isMoreMenuOpen && <MoreOptionsMenu/>}</AnimatePresence>
            {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
            <Dock />
        </div>
    );
}