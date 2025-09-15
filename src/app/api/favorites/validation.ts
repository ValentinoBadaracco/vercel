import { z } from 'zod';

export const addFavoriteSchema = z.object({
  bookId: z.string().min(1, 'bookId requerido'),
  title: z.string().optional(),
  authors: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
});

export const removeFavoriteSchema = z.object({
  bookId: z.string().min(1, 'bookId requerido'),
});
