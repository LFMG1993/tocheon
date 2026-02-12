import * as React from "react";
import {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import {HomePage} from './pages/HomePage';
import {PromotionsPage} from "./pages/PromotionsPage.tsx";
import {MapPage} from './pages/MapPage.tsx';
import {ReviewsPage} from "./pages/ReviewsPage.tsx";
import {Toaster} from 'react-hot-toast';
import {AboutPage} from "./pages/AboutPage.tsx";
import {WalletPage} from "./pages/WalletPage.tsx";
import {MainLayout} from "./components/general/MainLayout.tsx";
import {useAppStore} from './store/useAppStore';
import {InstallPWA} from "./components/general/InstallPWA.tsx";
import {UpdatePWA} from "./components/general/UpdatePWA.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {WelcomeModal} from "./components/general/WelcomeModal.tsx";
import {RewardModal} from "./components/general/RewardModal.tsx";
import {Loader} from "lucide-react";
import {useCheckGoogleRedirect} from "./hooks/useAuth.ts";
import 'leaflet/dist/leaflet.css';
import './index.css';
import './mobile-fixes.css';

// Componente wrapper para el tema público
const PublicThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <ThemeProvider storageKey="theme-public" defaultTheme="light">
        <>
            {children}
        </>
    </ThemeProvider>
);

function App() {
    const {user, isAuthReady, listenToAuthState, getGeolocation, showReward} = useAppStore();
    const {data: redirectData, isLoading: isCheckingRedirect} = useCheckGoogleRedirect();

    useEffect(() => {
        const unsubscribe = listenToAuthState();
        return () => unsubscribe();
    }, [listenToAuthState]);

    useEffect(() => {
        if (user) {
            getGeolocation();
        }
    }, [getGeolocation, user]);

    // Efecto para mostrar la recompensa si el hook detectó un registro exitoso
    useEffect(() => {
        console.log('[GOOGLE_AUTH] App.tsx Effect - RedirectData:', redirectData);
        if (redirectData && redirectData.rewardGiven) {
            setTimeout(() => {
                showReward(5, '¡Bienvenido!', 'Has ganado tus primeros TochCoins por registrarte.');
            }, 2000);
        }
    }, [redirectData, showReward]);

    if (isCheckingRedirect) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><Loader
            className="w-10 h-10 animate-spin text-primary"/></div>;
    }

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}/>
            <InstallPWA/>
            <UpdatePWA/>
            <RewardModal/>
            {/* Si ya cargó la autenticación y NO hay usuario, mostramos el modal de bienvenida */}
            {isAuthReady && !user && <WelcomeModal/>}
            <Routes>
                <Route path="/" element={<PublicThemeProvider><MainLayout/></PublicThemeProvider>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="promotions" element={<PromotionsPage/>}/>
                    <Route path="map" element={<MapPage/>}/>
                    <Route path="reviews" element={<ReviewsPage/>}/>
                    <Route path="about" element={<AboutPage/>}/>
                    <Route path="wallet" element={<WalletPage/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App
