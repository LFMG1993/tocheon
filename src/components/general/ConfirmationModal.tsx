import {motion} from 'framer-motion';
import {AlertTriangle} from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
                                      isOpen,
                                      onClose,
                                      onConfirm,
                                      title,
                                      description,
                                      confirmText = "Confirmar",
                                      cancelText = "Cancelar",
                                      variant = 'danger'
                                  }: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.95}}
                className="bg-card w-full max-w-sm rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
                <div className="p-6 text-center space-y-4">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                        variant === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-yellow-100 text-yellow-600'
                    }`}>
                        <AlertTriangle className="w-6 h-6"/>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-card-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors text-sm"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`py-2.5 rounded-xl font-bold text-white shadow-lg transition-colors text-sm flex items-center justify-center gap-2 ${
                                variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:opacity-90'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}