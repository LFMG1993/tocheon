import {useState, useEffect} from 'react';
import {useAppStore} from '../../store/useAppStore';
import {Loader, X, Save} from 'lucide-react';
import type {User} from '../../types';
import {motion} from 'framer-motion';

interface ProfileModalProps {
    onClose: () => void;
}

export function ProfileModal({onClose}: ProfileModalProps) {
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
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthReady || !initialUser) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.95}}
                className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-border"
            >
                {/* Header del Modal */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                    <h2 className="text-lg font-bold text-card-foreground">Mi Perfil</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5 text-muted-foreground"/>
                    </button>
                </div>

                {/* Contenido Scrollable */}
                <div className="overflow-y-auto p-6 space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <img
                                src={userData.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${userData.nickname || 'A'}`}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full bg-muted border-4 border-card shadow-md"/>
                        </div>
                        <div className="flex-1">
                            {isEditing ?
                                <input type="text" name="nickname" value={userData.nickname || ''}
                                       onChange={handleInputChange}
                                       className="w-full text-xl font-bold p-1 border-b-2 border-primary bg-transparent focus:outline-none text-foreground"
                                       placeholder="Tu apodo"/> :
                                <h3 className="text-xl font-bold text-card-foreground">{userData.nickname || 'Usuario Anónimo'}</h3>}
                            <p className="text-xs text-muted-foreground">UID: {initialUser.uid.slice(0, 8)}...</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <DetailField label="Nombres" name="firstName" value={userData.firstName} isEditing={isEditing} onChange={handleInputChange}/>
                        <DetailField label="Apellidos" name="lastName" value={userData.lastName} isEditing={isEditing} onChange={handleInputChange}/>
                        <DetailField label="Correo" name="email" value={userData.email} isEditing={isEditing} onChange={handleInputChange} type="email"/>
                        <DetailField label="Teléfono" name="phone" value={userData.phone} isEditing={isEditing} onChange={handleInputChange}/>
                        <DetailField label="Barrio" name="neighborhood" value={userData.neighborhood} isEditing={isEditing} onChange={handleInputChange}/>
                    </div>
                </div>

                {/* Footer de Acciones */}
                <div className="p-4 border-t border-border bg-muted/30 flex gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={isLoading}
                                    className="flex-1 py-2.5 bg-[var(--toche-primary)] text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                                {isLoading ? <Loader className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4"/>}
                                Guardar
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)}
                                className="w-full py-2.5 bg-foreground text-background rounded-xl font-bold shadow-lg hover:opacity-90 transition-colors">
                            Editar Perfil
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

const DetailField = ({label, value, isEditing, name, onChange, type = 'text'}: any) => (
    <div className="bg-muted/30 p-3 rounded-lg border border-border">
        <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">{label}</label>
        {isEditing ?
            <input type={type} name={name} value={value || ''} onChange={onChange}
                   className="w-full bg-card p-2 rounded border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-foreground"/>
            :
            <p className="text-sm font-medium text-foreground break-words">{value || 'No especificado'}</p>
        }
    </div>
);