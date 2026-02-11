import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {Dock} from './Dock';
import {TopBar} from "./TopBar.tsx";
import {ProfileModal} from "./ProfileModal.tsx";
import {UpdatePWA} from "./UpdatePWA.tsx";

export function MainLayout() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="font-sans flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
            <TopBar onOpenProfile={() => setIsProfileOpen(true)}/>
            <main
                className="flex-grow overflow-y-auto pb-20 pt-16">
                <Outlet/>
            </main>
            {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)}/>}
            <Dock/>
            <UpdatePWA/>
        </div>
    );
}