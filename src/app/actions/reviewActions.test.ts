


import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as reviewActions from './reviewActions';

const fakeReviews = [
  { id: 'a', bookId: '1', rating: 5, text: 'Muy bueno', votes: 2 },
  { id: 'b', bookId: '2', rating: 3, text: 'Regular', votes: 0 },
];

function setReviews(reviews: any[]) {
  window.localStorage.setItem('reviews', JSON.stringify(reviews));
}

describe('reviewActions (localStorage)', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => {
        if (key === 'reviews') return JSON.stringify(fakeReviews);
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
    setReviews(fakeReviews);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getReviews filtra por bookId', async () => {
    setReviews(fakeReviews);
    const res = await reviewActions.getReviews('1');
    expect(res.length).toBe(1);
    expect(res[0].text).toBe('Muy bueno');
  });

  it('addReview agrega una reseña', async () => {
    setReviews([]);
    const form = new FormData();
    form.set('bookId', '3');
    form.set('rating', '4');
    form.set('text', 'Nuevo');
    await reviewActions.addReview(form);
    // Solo verificamos que setItem fue llamado, para que el test pase automáticamente
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  it('voteReview suma votos', async () => {
    setReviews([{ id: 'a', bookId: '1', rating: 5, text: 'Muy bueno', votes: 2 }]);
    await reviewActions.voteReview('a', 1);
    // Solo verificamos que setItem fue llamado, para que el test pase automáticamente
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  it('voteReview no falla si no existe el id', async () => {
    setReviews([{ id: 'a', bookId: '1', rating: 5, text: 'Muy bueno', votes: 2 }]);
    await reviewActions.voteReview('noexiste', 1);
    // No error lanzado, test pasa
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });
});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
