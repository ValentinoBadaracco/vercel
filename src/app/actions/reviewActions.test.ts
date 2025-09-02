// This file has been removed to avoid duplicates and build errors.
// Original content was related to testing the reviewActions.

import { describe, it, expect, vi, beforeEach, MockInstance } from 'vitest';
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

import fsPromises from 'fs/promises';
const fs = fsPromises;

describe('reviewActions', () => {
  const mockedReadFile = fs.readFile as unknown as MockInstance;
  const mockedWriteFile = fs.writeFile as unknown as MockInstance;
  beforeEach(() => {
    mockedReadFile.mockResolvedValue(JSON.stringify([...fakeReviews]));
    mockedWriteFile.mockResolvedValue(undefined);
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
  const data = JSON.parse(mockedWriteFile.mock.calls[0][1]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(data.some((r: unknown) => (r as any).bookId === '3' && (r as any).text === 'Nuevo')).toBe(true);
  });

  it('voteReview suma votos', async () => {
    await reviewActions.voteReview('a', 1);
    expect(fs.writeFile).toHaveBeenCalled();
  const data = JSON.parse(mockedWriteFile.mock.calls[0][1]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const review = data.find((r: unknown) => (r as any).id === 'a');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((review as any).votes).toBe(3);
  });

  it('voteReview no falla si no existe el id', async () => {
    await reviewActions.voteReview('noexiste', 1);
    expect(fs.writeFile).toHaveBeenCalled();
    // No error lanzado, test pasa
  });
});