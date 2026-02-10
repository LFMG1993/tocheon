import {MapPin, Store, Tag} from 'lucide-react';
import type {Promotion} from '../../types';

interface PromotionCardProps {
    promo: Promotion;
}

export function PromotionCard({promo}: PromotionCardProps) {
    // Formateador de moneda para COP
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Calcular porcentaje de descuento
    const discountPercentage = Math.round(((promo.originalPrice - promo.discountPrice) / promo.originalPrice) * 100);

    return (
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
            {/* Imagen (Opcional) */}
            {promo.imageUrl && (
                <div className="h-32 w-full overflow-hidden relative">
                    <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                        <Tag className="w-3 h-3 mr-1" />
                        -{discountPercentage}%
                    </div>
                </div>
            )}

            <div className="p-4">
                {/* Encabezado del Negocio */}
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <Store className="w-3 h-3 mr-1" />
                    <span className="uppercase tracking-wide font-semibold">{promo.businessName}</span>
                </div>

                <h3 className="text-lg font-bold text-card-foreground leading-tight mb-2">{promo.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{promo.description}</p>

                {/* Sección de Precios y Acción */}
                <div className="flex items-end justify-between mt-auto">
                    <div>
                        <p className="text-xs text-muted-foreground line-through decoration-rose-400 decoration-2">
                            {formatCurrency(promo.originalPrice)}
                        </p>
                        <p className="text-xl font-extrabold text-primary">
                            {formatCurrency(promo.discountPrice)}
                        </p>
                    </div>

                    <a
                        href={promo.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(promo.businessName + " Cúcuta")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                        aria-label="Ver ubicación"
                    >
                        <MapPin className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
}