import {User} from 'lucide-react';
import {PushNotificationToggler} from './PushNotificationToggler';
import {ThemeToggle} from "./ThemeToggle.tsx";

interface TopBarProps {
    onOpenProfile: () => void;
}

export const TopBar = ({onOpenProfile}: TopBarProps) => {
    return (
        <header
            className="fixed top-0 left-0 right-0 mx-auto max-w-md h-16 bg-card/90 backdrop-blur-md shadow-sm z-20 flex items-center justify-between px-4 border-b border-border transition-colors duration-300">

            {/* Gestión de Perfil */}
            <button
                onClick={onOpenProfile}
                className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
                aria-label="Ir al perfil"
            >
                <User className="w-6 h-6"/>
            </button>

            <h1 className="text-lg font-bold text-primary tracking-tight">
                <img
                    src="/logoTocheon.png"
                    alt="Logo Tocheon"
                    loading="lazy"
                    className="h-10 w-auto ml-4"
                />
            </h1>
            <div className="flex items-center gap-x-2">
                <ThemeToggle/>
                <PushNotificationToggler/>
            </div>
        </header>
    );
};