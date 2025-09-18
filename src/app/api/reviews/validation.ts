import { z } from 'zod';

export const createReviewSchema = z.object({
  bookId: z.string().min(1, 'bookId requerido'),
  text: z.string().min(5, 'La reseña debe tener al menos 5 caracteres'),
  rating: z.number().min(1).max(5),
});

export const editReviewSchema = z.object({
  reviewId: z.string().min(1, 'reviewId requerido'),
  text: z.string().min(5, 'La reseña debe tener al menos 5 caracteres'),
  rating: z.number().min(1).max(5),
});
