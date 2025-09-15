import { addFavoriteSchema, removeFavoriteSchema } from '../favorites/validation';
import { describe, it, expect } from 'vitest';

describe('Favorites validation', () => {
  it('should validate correct add favorite', () => {
    const result = addFavoriteSchema.safeParse({ bookId: 'id1' });
    expect(result.success).toBe(true);
  });

  it('should fail with missing bookId', () => {
    const result = addFavoriteSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('Remove favorite validation', () => {
  it('should validate correct remove favorite', () => {
    const result = removeFavoriteSchema.safeParse({ bookId: 'id1' });
    expect(result.success).toBe(true);
  });

  it('should fail with missing bookId', () => {
    const result = removeFavoriteSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
