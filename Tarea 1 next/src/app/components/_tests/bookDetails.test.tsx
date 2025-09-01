// This file has been removed to avoid duplicates and build errors.
// Original content was related to testing the bookDetails component.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookDetails from '../bookDetails';
import * as reviewActions from '../../actions/reviewActions';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mockea el módulo completo de server actions
vi.mock('../../actions/reviewActions');

const mockBook = {
  id: 'test-book',
  volumeInfo: {
    title: 'Test Book',
    authors: ['Author'],
    publishedDate: '2020',
    description: 'Descripción de prueba',
    imageLinks: { thumbnail: '' },
  },
};

describe('BookDetails', () => {
  beforeEach(() => {
    (reviewActions.getReviews as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: '1', bookId: 'test-book', rating: 5, text: 'Excelente', votes: 2 },
    ]);
    (reviewActions.addReview as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    (reviewActions.voteReview as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  it('muestra los detalles del libro', async () => {
    render(<BookDetails book={mockBook} />);
    expect(screen.getByText('Test Book')).toBeTruthy();
    expect(screen.getByText('Author')).toBeTruthy();
    expect(screen.getByText('Descripción de prueba')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Excelente')).toBeTruthy();
    });
  });

  it('permite agregar una reseña', async () => {
    render(<BookDetails book={mockBook} />);
    fireEvent.change(screen.getByPlaceholderText('Escribe tu reseña...'), { target: { value: 'Nueva reseña' } });
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: 4 } });
    fireEvent.click(screen.getByText('Agregar'));
    await waitFor(() => {
      expect(reviewActions.addReview).toHaveBeenCalled();
    });
  expect((screen.getByPlaceholderText('Escribe tu reseña...') as HTMLTextAreaElement).value).toBe('');
  });

  it('permite votar una reseña', async () => {
    render(<BookDetails book={mockBook} />);
    await waitFor(() => {
      expect(screen.getByText('Excelente')).toBeTruthy();
    });
    fireEvent.click(screen.getByTitle('Votar positivo'));
    await waitFor(() => {
      expect(reviewActions.voteReview).toHaveBeenCalled();
    });
  });
});