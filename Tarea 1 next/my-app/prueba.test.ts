import { describe, it, expect } from 'vitest';

describe('jsdom', () => {
  it('tiene document', () => {
    expect(typeof document).toBe('object');
  });
});
