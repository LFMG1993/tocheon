import {useEffect, useState} from 'react';
import {Loader, ShoppingBag} from 'lucide-react';
import {PromotionCard} from '../components/promotions/PromotionCard';
import {getPromotions} from '../services/promotion.service';
import type {Promotion} from '../types';

export function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const data = await getPromotions();
                setPromotions(data);

                 // if (data.length === 0) await seedPromotions();
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromos();
    }, []);

    return (
        <div className="min-h-screen bg-background p-4 pt-8 pb-24">
            <div className="max-w-md mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Promociones</h1>
                        <p className="text-sm text-muted-foreground">Ahorra con los mejores combos saludables de la ciudad.</p>
                    </div>
                </div>

                {/* Contenido */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : promotions.length > 0 ? (
                    <div className="grid gap-6">
                        {promotions.map((promo) => (
                            <PromotionCard key={promo.id} promo={promo} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-card rounded-xl border border-border">
                        <p className="text-muted-foreground">No hay promociones activas en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}