import {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import {HomePage} from './pages/HomePage';
import {ProfilePage} from './pages/ProfilePage';
import {MapPage} from './pages/MapPage.tsx';
import {MainLayout} from "./components/general/MainLayout.tsx";
import {useAppStore} from './store/useAppStore';
import 'leaflet/dist/leaflet.css';

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
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="map" element={<MapPage/>}/>
            </Route>
        </Routes>
    );
}

export default App
