import * as React from "react";
import {useState, useEffect, useRef} from 'react';
import {useAppStore} from '../../store/useAppStore';
import {Loader, X, Save, LogOut, Camera} from 'lucide-react';
import type {User} from '../../types';
import {motion} from 'framer-motion';
import {ConfirmationModal} from "./ConfirmationModal";
import {useLogout, useUpdateProfile, useUpdateProfileImage} from "../../hooks/useAuth.ts";

interface ProfileModalProps {
    onClose: () => void;
}

export function ProfileModal({onClose}: ProfileModalProps) {
    const {user: initialUser, isAuthReady} = useAppStore();

    // Hooks de React Query
    const {mutateAsync: updateProfile, isPending: isSavingProfile} = useUpdateProfile();
    const {mutateAsync: updateImage, isPending: isUploadingImage} = useUpdateProfileImage();
    const {mutate: logoutUser} = useLogout();

    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<Partial<User>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
        try {
            await updateProfile(userData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
        }
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = async () => {
        logoutUser();
        setShowLogoutConfirm(false);
        onClose();
    };

    const handleImageClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !initialUser) return;

        try {
            // El hook se encarga de subir a Cloudinary y actualizar Firestore
            const newUrl = await updateImage(file);
            const cacheBustedUrl = `${newUrl}?t=${new Date().getTime()}`;
            setUserData(prev => ({...prev, photoURL: cacheBustedUrl}));
        } catch (error) {
            console.error(error);
        }
    };

    if (!isAuthReady || !initialUser) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
                        <div className="relative group">
                            <img
                                src={userData.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${userData.nickname || 'A'}`}
                                alt="Avatar"
                                onClick={handleImageClick}
                                className={`w-20 h-20 rounded-full bg-muted border-4 border-card shadow-md object-cover ${isEditing ? 'cursor-pointer group-hover:opacity-70 transition-opacity' : ''}`}
                            />
                            {isEditing && (
                                <>
                                    <div
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                        {isUploadingImage ? (
                                            <Loader className="w-6 h-6 text-white animate-spin"/>
                                        ) : (
                                            <Camera
                                                className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"/>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </>
                            )}

                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input type="text" name="nickname" value={userData.nickname || ''}
                                       onChange={handleInputChange}
                                       className="w-full text-xl font-bold p-1 border-b-2 border-primary bg-transparent focus:outline-none text-foreground"
                                       placeholder="Tu apodo"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-card-foreground">{userData.nickname || 'Usuario'}</h3>
                            )}
                            <p className="text-xs text-muted-foreground">UID: {initialUser.uid.slice(0, 8)}...</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <DetailField label="Nombres" name="firstName" value={userData.firstName} isEditing={isEditing}
                                     onChange={handleInputChange}/>
                        <DetailField label="Apellidos" name="lastName" value={userData.lastName} isEditing={isEditing}
                                     onChange={handleInputChange}/>
                        <DetailField label="Correo" name="email" value={userData.email} isEditing={isEditing}
                                     onChange={handleInputChange} type="email"/>
                        <DetailField label="Teléfono" name="phone" value={userData.phone} isEditing={isEditing}
                                     onChange={handleInputChange}/>
                        <DetailField label="Barrio" name="neighborhood" value={userData.neighborhood}
                                     isEditing={isEditing} onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="p-4 border-t border-border bg-muted/30 flex flex-col gap-3">
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)}
                                        className="flex-1 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={handleSave} disabled={isSavingProfile}
                                        className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                                    {isSavingProfile ? <Loader className="animate-spin w-4 h-4"/> :
                                        <Save className="w-4 h-4"/>}
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
                    {/* Botón de Cerrar Sesión */}
                    {!isEditing && (
                        <button
                            onClick={handleLogoutClick}
                            className="w-full py-2 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-3 h-3"/>
                            Cerrar Sesión
                        </button>
                    )}
                </div>
                {/* Modal de Confirmación de Logout */
                }
                <ConfirmationModal
                    isOpen={showLogoutConfirm}
                    onClose={() => setShowLogoutConfirm(false)}
                    onConfirm={confirmLogout}
                    title="¿Cerrar sesión?"
                    description="Tendrás que volver a ingresar tus credenciales para acceder a tu cuenta."
                    confirmText="Sí, cerrar sesión"
                    variant="danger"
                />
            </motion.div>
        </div>
    );
}

const DetailField = ({label, value, isEditing, name, onChange, type = 'text'}: any) => (
    <div className="bg-muted/30 p-3 rounded-lg border border-border">
        <label
            className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">{label}</label>
        {isEditing ?
            <input type={type} name={name} value={value || ''} onChange={onChange}
                   className="w-full bg-card p-2 rounded border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-foreground"/>
            :
            <p className="text-sm font-medium text-foreground break-words">{value || 'No especificado'}</p>
        }
    </div>
);
