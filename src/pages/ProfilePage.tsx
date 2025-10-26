import {useState, useEffect} from 'react';
import {useAppStore} from '../store/useAppStore';
import {Loader} from 'lucide-react';
import type {User} from '../types';

export function ProfilePage() {
    const {user: initialUser, isAuthReady, updateUserProfile} = useAppStore();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<Partial<User>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialUser) {
            setUserData(initialUser);
        }
    }, [initialUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUserData(prev => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateUserProfile(userData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
            // Aquí podríamos mostrar una notificación de error al usuario
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthReady || !initialUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin h-10 w-10 text-[var(--toche-primary)]"/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--toche-light)] p-4 flex justify-center">
            <div className="w-full max-w-md space-y-6">
                {/* --- Componente ProfileHeader --- */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src={userData.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${userData.nickname || 'A'}`}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md"/>
                        {isEditing && <button
                            className="absolute bottom-0 right-0 bg-[var(--toche-primary)] text-white p-1.5 rounded-full shadow-md">✏️</button>}
                    </div>
                    <div className="flex-1">
                        {isEditing ? <input type="text" name="nickname" value={userData.nickname || ''}
                                            onChange={handleInputChange}
                                            className="w-full text-2xl font-bold p-2 border-b-2 border-[var(--toche-secondary)] bg-transparent focus:outline-none"
                                            placeholder="Tu apodo"/> :
                            <h1 className="text-2xl font-bold text-[var(--toche-dark)]">{userData.nickname || 'Usuario Anónimo'}</h1>}
                    </div>
                </div>
                {/* --- Componente ProfileDetails --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                    <DetailField label="UID" value={initialUser.uid} isProtected/>
                    <DetailField label="Miembro desde"
                                 value={initialUser.createdAt?.toDate().toLocaleDateString('es-CO', {
                                     year: 'numeric',
                                     month: 'long',
                                     day: 'numeric'
                                 }) || 'N/A'} isProtected/>
                    <DetailField label="Nombres" name="firstName" value={userData.firstName} isEditing={isEditing}
                                 onChange={handleInputChange}/>
                    <DetailField label="Apellidos" name="lastName" value={userData.lastName} isEditing={isEditing}
                                 onChange={handleInputChange}/>
                    <DetailField label="Correo" name="email" value={userData.email} isEditing={isEditing}
                                 onChange={handleInputChange} type="email"/>
                    <DetailField label="Teléfono" name="phone" value={userData.phone} isEditing={isEditing}
                                 onChange={handleInputChange}/>
                    <DetailField label="Barrio" name="neighborhood" value={userData.neighborhood} isEditing={isEditing}
                                 onChange={handleInputChange}/>
                </div>

                {/* --- Componente ProfileActions --- */}
                <div className="flex space-x-4">
                    {isEditing ? (<>
                        <button onClick={handleSave} disabled={isLoading}
                                className="flex-1 bg-[var(--toche-primary)] text-white font-bold py-3 rounded-lg shadow-md disabled:bg-gray-400">{isLoading ? 'Guardando...' : 'Guardar Cambios'}</button>
                        <button onClick={() => setIsEditing(false)}
                                className="flex-1 bg-gray-300 text-[var(--toche-dark)] font-bold py-3 rounded-lg shadow-md">Cancelar
                        </button>
                    </>) : (<button onClick={() => setIsEditing(true)}
                                    className="w-full bg-[var(--toche-dark)] text-white font-bold py-3 rounded-lg shadow-md">Editar
                        Perfil</button>)}
                </div>

                <p className="text-center font-bold text-lg text-[var(--toche-secondary)] tracking-widest">100%
                    CUCUTOCHE</p>
            </div>
        </div>
    );
}

// Componente interno para los campos de detalle
const DetailField = ({label, value, isEditing, name, onChange, isProtected = false, type = 'text'}: any) => (
    <div>
        <label className="text-xs font-bold text-gray-500">{label}</label>
        {isEditing && !isProtected ? <input type={type} name={name} value={value || ''} onChange={onChange}
                                            className="w-full p-2 border-b bg-gray-50 focus:outline-none focus:border-[var(--toche-primary)]"/> :
            <p className="text-md text-[var(--toche-dark)] break-words">{value || 'No especificado'}</p>}
    </div>
);