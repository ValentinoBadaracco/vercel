import { createReviewSchema, editReviewSchema } from '../reviews/validation';
import { describe, it, expect } from 'vitest';

describe('Reviews validation', () => {
  it('should validate correct review data', () => {
    const result = createReviewSchema.safeParse({
      bookId: 'abc123',
      text: 'Excelente libro, muy recomendado!',
      rating: 5,
    });
    expect(result.success).toBe(true);
  });

  it('should fail with short text', () => {
    const result = createReviewSchema.safeParse({
      bookId: 'abc123',
      text: 'ok',
      rating: 5,
    });
    expect(result.success).toBe(false);
  });

  it('should fail with rating out of range', () => {
    const result = createReviewSchema.safeParse({
      bookId: 'abc123',
      text: 'Muy bueno',
      rating: 10,
    });
    expect(result.success).toBe(false);
  });
});

describe('Edit review validation', () => {
  it('should validate correct edit data', () => {
    const result = editReviewSchema.safeParse({
      reviewId: 'id1',
      text: 'Actualización de reseña',
      rating: 4,
    });
    expect(result.success).toBe(true);
  });

  it('should fail with missing reviewId', () => {
    const result = editReviewSchema.safeParse({
      text: 'Actualización de reseña',
      rating: 4,
    });
    expect(result.success).toBe(false);
  });
});
