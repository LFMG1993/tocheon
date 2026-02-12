import {useState} from 'react';
import {Loader, Save, Phone, User, ArrowRight} from 'lucide-react';
import {GoogleIcon} from "../icons/GoogleIcon.tsx";
import {WhatsAppIcon} from "../icons/WhatsAppIcon.tsx";
import toast from 'react-hot-toast';
import {
    useLoginWithEmail,
    useLoginWithGoogle,
    useRegisterWithEmail,
    useSendWhatsAppCode,
    useLoginWithWhatsApp
} from "../../hooks/useAuth.ts";

interface AuthFormProps {
    onSuccess: () => void;
    mode?: 'login' | 'register' | 'whatsapp';
}

export function AuthForm({onSuccess, mode = 'login'}: AuthFormProps) {
    const {mutateAsync: loginWithGoogle} = useLoginWithGoogle();
    const {mutateAsync: loginWithEmail} = useLoginWithEmail();
    const {mutateAsync: registerWithEmail} = useRegisterWithEmail();
    const {mutateAsync: sendWhatsApp} = useSendWhatsAppCode();
    const {mutateAsync: loginWhatsApp} = useLoginWithWhatsApp();

    const [currentMode, setCurrentMode] = useState(mode);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    // Campos
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    // Estado para WhatsApp
    const [whatsappStep, setWhatsappStep] = useState<'phone' | 'otp'>('phone');
    const [otpCode, setOtpCode] = useState<string[]>(Array(6).fill(''));

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

    const handleWhatsAppSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (whatsappStep === 'phone') {
            if (!phone) return toast.error("Ingresa tu celular");
            setIsLoading(true);
            try {
                await sendWhatsApp(phone);
                setWhatsappStep('otp');
                toast.success("Código enviado a tu WhatsApp");
            } catch (e) {
                // Error manejado por el hook
            } finally {
                setIsLoading(false);
            }
        } else {
            const code = otpCode.join('');
            if (code.length < 6) return toast.error("Código incompleto");
            setIsLoading(true);
            try {
                await loginWhatsApp({phone, code, rememberMe});
                toast.success("¡Bienvenido!");
                onSuccess();
            } catch (e) {
                // Error manejado por el hook
            } finally {
                setIsLoading(false);
            }
        }
    };

    // --- Manejo de los 6 dígitos del OTP ---
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // Solo números

        const newOtp = [...otpCode];
        newOtp[index] = value.slice(-1); // Tomamos el último caracter si escribe rápido
        setOtpCode(newOtp);

        // Saltar al siguiente input si se escribió algo
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Si borra y la casilla está vacía, saltar al anterior
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');

        if (pastedData.length > 0) {
            const newOtp = [...otpCode];
            pastedData.forEach((val, i) => {
                if (i < 6) newOtp[i] = val;
            });
            setOtpCode(newOtp);
            // Enfocar el último llenado o el siguiente vacío
            const nextFocus = Math.min(pastedData.length, 5);
            document.getElementById(`otp-${nextFocus}`)?.focus();
        }
    };

    return (
        <div className="space-y-4">
            {!showEmailForm && currentMode !== 'whatsapp' ? (
                <div className="space-y-3">
                    <button
                        onClick={handleGoogle}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-bold border border-border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {isLoading ? <Loader className="animate-spin w-5 h-5"/> : <GoogleIcon className="w-5 h-5"/>}
                        <span>Continuar con Google</span>
                    </button>

                    <button
                        onClick={() => setCurrentMode('whatsapp')}
                        className="w-full flex items-center justify-center gap-3 py-2.5 bg-[#25D366] text-white rounded-lg font-bold hover:bg-[#20bd5a] transition-colors shadow-sm"
                    >
                        <WhatsAppIcon className="w-5 h-5"/>
                        <span>Ingresar con WhatsApp</span>
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
                        </button>
                    </div>
                </div>
            ) : currentMode === 'whatsapp' ? (
                <form onSubmit={handleWhatsAppSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-center font-bold text-card-foreground">
                        {whatsappStep === 'phone' ? 'Ingresa tu número' : 'Verifica el código'}
                    </h3>

                    {whatsappStep === 'phone' ? (
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground"/>
                            <input
                                type="tel"
                                placeholder="Número de Celular"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full bg-card p-3 pl-10 rounded-lg border border-border focus:border-[#25D366] outline-none text-foreground text-lg tracking-wide"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-xs text-center text-muted-foreground">Enviado al {phone}</p>
                            <div className="flex justify-center gap-2">
                                {otpCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e, index)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                        onPaste={handleOtpPaste}
                                        className="w-10 h-12 text-center text-xl font-bold bg-card border border-border rounded-lg focus:border-[#25D366] outline-none transition-colors caret-primary text-foreground"
                                        autoFocus={index === 0}
                                        autoComplete="one-time-code"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => {
                            if (whatsappStep === 'otp') setWhatsappStep('phone');
                            else setCurrentMode('login');
                        }} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                            Volver
                        </button>
                        <button type="submit" disabled={isLoading}
                                className="flex-1 py-2 bg-[#25D366] text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-[#20bd5a]">
                            {isLoading ? <Loader className="animate-spin w-4 h-4"/> : <ArrowRight className="w-4 h-4"/>}
                            {whatsappStep === 'phone' ? 'Enviar Código' : 'Verificar'}
                        </button>
                    </div>
                </form>
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
            {currentMode !== 'whatsapp' && !showEmailForm && (
                <div className="text-center pt-2 text-xs text-muted-foreground">
                    O usa tu correo electrónico
                </div>
            )}

            {showEmailForm && (
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
            )}
        </div>
    );
}