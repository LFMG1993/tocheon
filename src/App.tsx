import {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import {HomePage} from './pages/HomePage';
import {PromotionsPage} from "./pages/PromotionsPage.tsx";
import {MapPage} from './pages/MapPage.tsx';
import {MainLayout} from "./components/general/MainLayout.tsx";
import {useAppStore} from './store/useAppStore';
import {UpdatePWA} from "./components/general/UpdatePWA.tsx";
import {InstallPWA} from "./components/general/InstallPWA.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import 'leaflet/dist/leaflet.css';
import './index.css';

// Componente wrapper para el tema público
const PublicThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <ThemeProvider storageKey="theme-public" defaultTheme="light">
        <>
            {children}
        </>
    </ThemeProvider>
);

function App() {
    const {user, isAuthReady, listenToAuthState, signInAnonymouslyAndCreateUser, getGeolocation} = useAppStore();

    useEffect(() => {
        // Empezamos a escuchar cambios en la autenticación
        const unsubscribe = listenToAuthState();
        // Limpiamos el listener cuando el componente se desmonte
        return () => unsubscribe();
    }, [listenToAuthState]);

    useEffect(() => {
        // Cuando Firebase esté listo y no haya un usuario, iniciamos sesión anónimamente
        if (isAuthReady && !user) {
            signInAnonymouslyAndCreateUser();
        }
    }, [isAuthReady, user, signInAnonymouslyAndCreateUser]);

    // Pedimos la geolocalización una sola vez al cargar la aplicación.
    useEffect(() => {
        getGeolocation();
    }, [getGeolocation]);

    return (
        <>
            <UpdatePWA/>
            <InstallPWA/>
            <Routes>
                <Route path="/" element={<PublicThemeProvider><MainLayout/></PublicThemeProvider>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="promotions" element={<PromotionsPage/>}/>
                    <Route path="map" element={<MapPage/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App
