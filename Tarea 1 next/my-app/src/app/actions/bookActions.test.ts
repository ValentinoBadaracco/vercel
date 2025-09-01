import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchBooks } from './bookActions';

describe('searchBooks', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        items: [
          { id: '1', volumeInfo: { title: 'Libro 1' } },
          { id: '2', volumeInfo: { title: 'Libro 2' } },
        ],
      }),
    }) as any;
  });

  it('devuelve resultados de la API', async () => {
    const results = await searchBooks('test');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(2);
    expect(results[0].volumeInfo.title).toBe('Libro 1');
  });

  it('devuelve array vacío si no hay items', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({}),
    });
    const results = await searchBooks('nada');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });
});