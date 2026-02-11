import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {reviewsService} from '../services/reviews.service';
import {useAppStore} from '../store/useAppStore';
import toast from 'react-hot-toast';

export const useReviews = () => {
    return useQuery({
        queryKey: ['reviews'],
        queryFn: reviewsService.getReviews,
        staleTime: 1000 * 60 * 5, // 5 minutos de frescura
    });
};

export const useAddReview = () => {
    const queryClient = useQueryClient();
    const {user} = useAppStore();

    return useMutation({
        mutationFn: async ({rating, comment}: { rating: number; comment: string }) => {
            if (!user) throw new Error("Debes iniciar sesión");
            return reviewsService.addReview(rating, comment, user);
        },
        onSuccess: () => {
            toast.success("¡Gracias por tu opinión!");
            queryClient.invalidateQueries({queryKey: ['reviews']});
        },
        onError: () => {
            toast.error("Error al publicar la reseña");
        }
    });
};