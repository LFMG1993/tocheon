import {useState} from 'react';
import {Loader, Save, Phone, User} from 'lucide-react';
import {GoogleIcon} from "../icons/GoogleIcon.tsx";
import toast from 'react-hot-toast';
import {useLoginWithEmail, useLoginWithGoogle, useRegisterWithEmail} from "../../hooks/useAuth.ts";

interface AuthFormProps {
    onSuccess: () => void;
    mode?: 'login' | 'register';
}

export function AuthForm({onSuccess, mode = 'login'}: AuthFormProps) {
    const {mutateAsync: loginWithGoogle} = useLoginWithGoogle();
    const {mutateAsync: loginWithEmail} = useLoginWithEmail();
    const {mutateAsync: registerWithEmail} = useRegisterWithEmail();

    const [currentMode, setCurrentMode] = useState(mode);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    // Campos
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    const handleGoogle = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle(rememberMe);
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo conectar con Google");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        if (currentMode === 'register' && !phone) return toast.error("El teléfono es obligatorio");
        if (currentMode === 'register' && !nickname) return toast.error("El nombre de usuario es obligatorio");

        setIsLoading(true);
        try {
            if (currentMode === 'login') {
                await loginWithEmail({email, password, rememberMe});
                toast.success("¡Bienvenido de nuevo!");
            } else if (currentMode === 'register') {

                await registerWithEmail({email, password, phone, nickname, rememberMe});
                toast.success("¡Cuenta creada exitosamente!");
            }
            onSuccess();
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("El correo ya existe. Intenta iniciar sesión.");
                setCurrentMode('login');
            } else {
                toast.error("Error de autenticación. Verifica tus datos.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!showEmailForm ? (
                <div className="space-y-3">
                    <button
                        onClick={handleGoogle}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-bold border border-border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {isLoading ? <Loader className="animate-spin w-5 h-5"/> : <GoogleIcon className="w-5 h-5"/>}
                        <span>Continuar con Google</span>
                    </button>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={() => {
                                setCurrentMode('login');
                                setShowEmailForm(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-card border border-border text-foreground rounded-lg font-bold hover:bg-muted transition-colors text-sm">
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => {
                                setCurrentMode('register');
                                setShowEmailForm(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-foreground text-background rounded-lg font-bold hover:opacity-90 transition-colors text-sm">
                            Crear Cuenta
                            <span
                                className="bg-yellow-400 text-black text-[10px] px-1.5 py-0.5 rounded-full ml-1 flex items-center shadow-sm">+5 TCN</span>
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-card p-3 rounded-lg border border-border focus:border-primary outline-none text-foreground text-sm"
                        required
                    />

                    {currentMode === 'register' && (
                        <>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground"/>
                                <input
                                    type="text"
                                    placeholder="Nombre de Usuario (Único)"
                                    value={nickname}
                                    onChange={e => setNickname(e.target.value.trim())} // Sin espacios
                                    className="w-full bg-card p-3 pl-10 rounded-lg border border-border focus:border-primary outline-none text-foreground text-sm"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground"/>
                                <input
                                    type="tel"
                                    placeholder="Número de Celular"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full bg-card p-3 pl-10 rounded-lg border border-border focus:border-primary outline-none text-foreground text-sm"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <input
                        type="password"
                        placeholder="Contraseña (mín. 6 caracteres)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-card p-3 rounded-lg border border-border focus:border-primary outline-none text-foreground text-sm"
                        required
                        minLength={6}
                    />

                    {/* Checkbox de Mantener Sesión (Solo para Login y Registro) */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="rememberMe"
                               className="text-xs text-muted-foreground cursor-pointer select-none">
                            Mantener sesión iniciada
                        </label>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setShowEmailForm(false)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Volver
                        </button>
                        <button type="submit" disabled={isLoading}
                                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">
                            {isLoading ? <Loader className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4"/>}
                            {currentMode === 'login' ? 'Entrar' : 'Registrarme'}
                        </button>
                    </div>
                </form>
            )}

            {/* Toggle Login/Register */}
            <div className="text-center pt-2">
                <button
                    type="button"
                    onClick={() => {
                        setCurrentMode(currentMode === 'login' ? 'register' : 'login');
                        setShowEmailForm(true);
                    }}
                    className="text-xs text-primary hover:underline font-medium"
                >
                    {currentMode === 'login'
                        ? '¿No tienes cuenta? Regístrate aquí'
                        : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
            </div>
        </div>
    );
}