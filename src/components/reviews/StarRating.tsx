import {Star} from 'lucide-react';

interface StarRatingProps {
    rating: number;
    max?: number;
    size?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
}

export function StarRating({rating, max = 5, size = 16, interactive = false, onRate}: StarRatingProps) {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(max)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= rating;

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onRate && onRate(starValue)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    >
                        <Star
                            size={size}
                            className={`${isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`}
                        />
                    </button>
                );
            })}
        </div>
    );
}