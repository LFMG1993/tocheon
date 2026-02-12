import {useMutation} from '@tanstack/react-query';
import {authService} from '../services/auth.service';
import {uploadImageToCloudinary} from '../services/cloudinary.service';
import {useAppStore} from '../store/useAppStore';
import {auth} from '../firebase';
import toast from 'react-hot-toast';

// Hook para actualizar datos de texto del perfil
export const useUpdateProfile = () => {
    const {user} = useAppStore();

    return useMutation({
        mutationFn: async (data: any) => {
            if (!user) throw new Error("No hay usuario");
            return authService.updateProfile(user.uid, data);
        },
        onSuccess: () => {
            toast.success("Perfil actualizado correctamente");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Error al actualizar perfil");
        }
    });
};

// Hook específico para la IMAGEN DE PERFIL
export const useUpdateProfileImage = () => {
    const {user} = useAppStore();

    return useMutation({
        mutationFn: async (file: File) => {
            if (!user) throw new Error("No hay usuario");

            // 1. Generamos un ID único (UID + Timestamp)
            const uniquePublicId = `${user.uid}_${Date.now()}`;

            // 2. Subir a Cloudinary con el nuevo ID único
            const secureUrl = await uploadImageToCloudinary(file, 'tocheon/profiles', uniquePublicId);

            // 3. Actualizar referencia en Firebase
            await authService.updateProfile(user.uid, {photoURL: secureUrl});

            return secureUrl;
        },
        onSuccess: () => {
            toast.success("Foto de perfil actualizada");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Error al subir la imagen");
        }
    });
};

// Hook para cerrar sesión
export const useLogout = () => {
    return useMutation({
        mutationFn: authService.logout,
        onError: (error) => {
            console.error(error);
            toast.error("Error al cerrar sesión");
        }
    });
};

// Hook para vincular con Google
export const useLinkWithGoogle = () => {
    const {user} = useAppStore();

    return useMutation({
        mutationFn: async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("No hay sesión activa");

            const linkedUser = await authService.linkWithGoogle(currentUser);
            await authService.syncUserAfterLink(linkedUser, user);
        }
    });
};

// Hook para Login con Google
export const useLoginWithGoogle = () => {
    const {showReward} = useAppStore();
    return useMutation({
        mutationFn: async (rememberMe: boolean) => {
            return authService.loginWithGoogle(rememberMe);
        },
        onSuccess: (data) => {
            if (data.rewardGiven) {
                showReward(5, '¡Bienvenido!', 'Has ganado tus primeros TochCoins por registrarte.');
            }
        }
    });
};

// Hook para Login con Email
export const useLoginWithEmail = () => {
    return useMutation({
        mutationFn: async ({email, password, rememberMe}: { email: string, password: string, rememberMe: boolean }) => {
            return authService.loginWithEmail(email, password, rememberMe);
        },
    });
};

// Hook para Registro con Email
export const useRegisterWithEmail = () => {
    const {showReward} = useAppStore();

    return useMutation({
        mutationFn: async ({email, password, phone, nickname, rememberMe}: {
            email: string,
            password: string,
            phone: string,
            nickname: string,
            rememberMe: boolean
        }) => {
            return authService.registerWithEmail(email, password, phone, nickname, rememberMe);
        },
        onSuccess: () => {
            showReward(5, '¡Bienvenido!', 'Has ganado tus primeros TochCoins por registrarte.');
        },
    });
};

// Hook para Vincular con Email
export const useLinkWithEmail = () => {
    const {user} = useAppStore();
    return useMutation({
        mutationFn: async ({email, password}: { email: string, password: string }) => {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("No hay sesión activa");

            const linkedUser = await authService.linkWithEmail(currentUser, email, password);
            await authService.syncUserAfterLink(linkedUser, user);
        },
        onError: (error: any) => {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Este correo ya está en uso en otra cuenta");
            } else {
                toast.error("Error al vincular el correo");
            }
        }
    });
};

// Hook para Enviar Código WhatsApp
export const useSendWhatsAppCode = () => {
    return useMutation({
        mutationFn: async (phone: string) => {
            return authService.sendWhatsAppCode(phone);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.message || "Error al enviar el código");
        }
    });
};

// Hook para Verificar y Login WhatsApp
export const useLoginWithWhatsApp = () => {
    return useMutation({
        mutationFn: async ({phone, code, rememberMe}: { phone: string, code: string, rememberMe: boolean }) => {
            return authService.loginWithWhatsApp(phone, code, rememberMe);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.message || "Código incorrecto");
        }
    });
};