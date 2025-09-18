import { voteSchema } from '../vote/validation';
import { describe, it, expect } from 'vitest';

describe('Vote validation', () => {
  it('should validate correct vote', () => {
    const result = voteSchema.safeParse({ reviewId: 'id1', value: 1 });
    expect(result.success).toBe(true);
  });

  it('should fail with invalid value', () => {
    const result = voteSchema.safeParse({ reviewId: 'id1', value: 0 });
    expect(result.success).toBe(false);
  });

  it('should fail with missing reviewId', () => {
    const result = voteSchema.safeParse({ value: 1 });
    expect(result.success).toBe(false);
  });
});
