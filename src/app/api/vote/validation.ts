import { z } from 'zod';

export const voteSchema = z.object({
  reviewId: z.string().min(1, 'reviewId requerido'),
  value: z.number().refine(v => v === 1 || v === -1, {
    message: 'El voto debe ser 1 o -1',
  }),
});
