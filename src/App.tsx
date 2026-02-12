import * as React from "react";
import {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import {HomePage} from './pages/HomePage';
import {PromotionsPage} from "./pages/PromotionsPage.tsx";
import {MapPage} from './pages/MapPage.tsx';
import {ReviewsPage} from "./pages/ReviewsPage.tsx";
import {getRedirectResult} from "firebase/auth";
import {auth} from "./firebase.ts";
import {authService} from "./services/auth.service.ts";
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

    useEffect(() => {
        const unsubscribe = listenToAuthState();
        return () => unsubscribe();
    }, [listenToAuthState]);

    useEffect(() => {
        if (user) {
            getGeolocation();
        }
    }, [getGeolocation, user]);

    // Manejar el retorno del Login con Google en móviles
    useEffect(() => {
        const checkRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    // Si volvemos de un redirect, procesamos la creación del usuario y recompensas
                    const {rewardGiven} = await authService.processGoogleResult(result);
                    if (rewardGiven) {
                        showReward(5, '¡Bienvenido!', 'Has ganado tus primeros TochCoins por registrarte.');
                    }
                }
            } catch (error) {
                console.error("Error en redirect login:", error);
            }
        };
        checkRedirect();
    }, [showReward]);

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
