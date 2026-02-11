import {useState} from 'react';
import {useReviews, useAddReview} from '../hooks/useReviews';
import {useAppStore} from '../store/useAppStore';
import {StarRating} from '../components/reviews/StarRating';
import {Loader, MessageSquarePlus, User as UserIcon} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';

export function ReviewsPage() {
    const {data: reviews = [], isLoading} = useReviews();
    const {mutateAsync: addReview, isPending: isSubmitting} = useAddReview();
    const {user} = useAppStore();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Calcular promedio
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        await addReview({rating, comment});
        setRating(0);
        setComment('');
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-background p-4 pt-8 pb-24 max-w-md mx-auto">
            {/* --- Cabecera de Resumen --- */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-card-foreground">Opiniones</h1>
                    <p className="text-sm text-muted-foreground">Lo que dice la comunidad</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black text-primary">{averageRating}</div>
                    <StarRating rating={parseFloat(averageRating)} size={14} />
                    <p className="text-[10px] text-muted-foreground mt-1">{reviews.length} calificaciones</p>
                </div>
            </div>

            {/* --- Botón / Formulario de Nueva Reseña --- */}
            {user ? (
                <div className="mb-8">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full py-3 bg-primary/10 text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                        >
                            <MessageSquarePlus className="w-5 h-5" />
                            Escribir una reseña
                        </button>
                    ) : (
                        <motion.form
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            onSubmit={handleSubmit}
                            className="bg-card border border-border rounded-xl p-4 shadow-lg"
                        >
                            <h3 className="font-bold text-card-foreground mb-2 text-center">Tu opinión cuenta</h3>
                            <div className="flex justify-center mb-4">
                                <StarRating rating={rating} size={32} interactive onRate={setRating} />
                            </div>
                            <textarea
                                placeholder="¿Qué te gusta de la app? ¿Qué podemos mejorar?"
                                className="w-full bg-muted/30 border border-border rounded-lg p-3 text-sm outline-none focus:border-primary resize-none mb-3"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm font-bold text-muted-foreground hover:bg-muted rounded-lg">Cancelar</button>
                                <button
                                    type="submit"
                                    disabled={rating === 0 || isSubmitting}
                                    className="flex-1 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg shadow-md disabled:opacity-50 flex justify-center"
                                >
                                    {isSubmitting ? <Loader className="w-5 h-5 animate-spin"/> : 'Publicar'}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </div>
            ) : (
                <div className="bg-muted/30 p-4 rounded-xl text-center mb-8 border border-border">
                    <p className="text-sm text-muted-foreground">Inicia sesión para dejar tu calificación.</p>
                </div>
            )}

            {/* --- Lista de Reseñas --- */}
            {isLoading ? (
                <div className="flex justify-center py-10"><Loader className="w-8 h-8 animate-spin text-primary"/></div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {reviews.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                className="bg-card border border-border p-4 rounded-xl shadow-sm"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        {review.userPhoto ? (
                                            <img src={review.userPhoto} alt={review.userName} className="w-10 h-10 rounded-full object-cover border border-border"/>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"><UserIcon className="w-5 h-5 text-muted-foreground"/></div>
                                        )}
                                        <div>
                                            <p className="font-bold text-sm text-card-foreground">{review.userName}</p>
                                            <div className="flex items-center gap-2">
                                                <StarRating rating={review.rating} size={12} />
                                                <span className="text-[10px] text-muted-foreground">{review.createdAt?.toDate().toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}