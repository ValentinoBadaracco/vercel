import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as reviewActions from './reviewActions';

const fakeReviews = [
  { id: 'a', bookId: '1', rating: 5, text: 'Muy bueno', votes: 2 },
  { id: 'b', bookId: '2', rating: 3, text: 'Regular', votes: 0 },
];

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

vi.mock('crypto', () => ({
  randomUUID: () => 'uuid-mock',
}));

const fs = require('fs/promises').default;

describe('reviewActions', () => {
  beforeEach(() => {
    fs.readFile.mockResolvedValue(JSON.stringify([...fakeReviews]));
    fs.writeFile.mockResolvedValue(undefined);
  });

  it('getReviews filtra por bookId', async () => {
    const res = await reviewActions.getReviews('1');
    expect(res.length).toBe(1);
    expect(res[0].text).toBe('Muy bueno');
  });

  it('addReview agrega una reseña', async () => {
    const form = new FormData();
    form.set('bookId', '3');
    form.set('rating', '4');
    form.set('text', 'Nuevo');
    await reviewActions.addReview(form);
    expect(fs.writeFile).toHaveBeenCalled();
    const data = JSON.parse(fs.writeFile.mock.calls[0][1]);
    expect(data.some((r: any) => r.bookId === '3' && r.text === 'Nuevo')).toBe(true);
  });

  it('voteReview suma votos', async () => {
    await reviewActions.voteReview('a', 1);
    expect(fs.writeFile).toHaveBeenCalled();
    const data = JSON.parse(fs.writeFile.mock.calls[0][1]);
    const review = data.find((r: any) => r.id === 'a');
    expect(review.votes).toBe(3);
  });

  it('voteReview no falla si no existe el id', async () => {
    await reviewActions.voteReview('noexiste', 1);
    expect(fs.writeFile).toHaveBeenCalled();
    // No error lanzado, test pasa
  });
});