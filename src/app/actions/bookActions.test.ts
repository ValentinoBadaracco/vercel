// This file has been removed to avoid duplicates and build errors.
// Original content was related to testing the bookActions.

import { describe, it, expect, vi, beforeEach, MockInstance } from 'vitest';
import { searchBooks } from './bookActions';

describe('searchBooks', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        items: [
          { id: '1', volumeInfo: { title: 'Libro 1' } },
          { id: '2', volumeInfo: { title: 'Libro 2' } },
        ],
      }),
    }) as unknown as typeof fetch;
  });

  it('devuelve resultados de la API', async () => {
    const results = await searchBooks('test');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(2);
    expect(results[0].volumeInfo.title).toBe('Libro 1');
  });

  it('devuelve array vacío si no hay items', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as unknown as MockInstance).mockResolvedValueOnce({
      json: async () => ({}),
    });
    const results = await searchBooks('nada');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });
});