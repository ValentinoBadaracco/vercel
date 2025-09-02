// This file has been removed to avoid duplicates and build errors.
// Original content was related to testing the bookSearch component.

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookSearch from '../bookSearch';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global fetch
const mockBooks = [
  {
    id: 'book1',
    volumeInfo: {
      title: 'Libro de Prueba',
      authors: ['Autor Uno'],
      publishedDate: '2020',
      categories: ['Ficción'],
      description: 'Descripción de prueba',
      imageLinks: { thumbnail: 'img.jpg' },
    },
  },
];

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    json: async () => ({ items: mockBooks }),
  }) as any;
});

describe('BookSearch', () => {
  it('renderiza input y botón', () => {
    render(<BookSearch onSelectBook={() => {}} />);
    expect(screen.getByPlaceholderText('Buscar por título, autor o ISBN')).toBeTruthy();
    expect(screen.getByText('Buscar')).toBeTruthy();
  });

  it('permite escribir en el input', () => {
    render(<BookSearch onSelectBook={() => {}} />);
    const input = screen.getByPlaceholderText('Buscar por título, autor o ISBN');
    fireEvent.change(input, { target: { value: 'Harry Potter' } });
    expect((input as HTMLInputElement).value).toBe('Harry Potter');
  });

  it('muestra resultados tras buscar', async () => {
    render(<BookSearch onSelectBook={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar por título, autor o ISBN'), { target: { value: 'libro' } });
    fireEvent.click(screen.getByText('Buscar'));
    await waitFor(() => {
      expect(screen.getByText('Libro de Prueba')).toBeTruthy();
      expect(screen.getByText('Autor Uno')).toBeTruthy();
    });
  });

  it('permite ver y ocultar detalles', async () => {
    render(<BookSearch onSelectBook={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar por título, autor o ISBN'), { target: { value: 'libro' } });
    fireEvent.click(screen.getByText('Buscar'));
    await waitFor(() => {
      expect(screen.getByText('Ver detalles')).toBeTruthy();
    });
    fireEvent.click(screen.getByText('Ver detalles'));
    await waitFor(() => {
      expect(screen.getByText(/Publicado:/)).toBeTruthy();
      expect(screen.getByText('Ocultar detalles')).toBeTruthy();
    });
    fireEvent.click(screen.getByText('Ocultar detalles'));
    await waitFor(() => {
      expect(screen.queryByText(/Publicado:/)).toBeFalsy();
    });
  });

  it('llama a onSelectBook al seleccionar', async () => {
    const onSelectBook = vi.fn();
    render(<BookSearch onSelectBook={onSelectBook} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar por título, autor o ISBN'), { target: { value: 'libro' } });
    fireEvent.click(screen.getByText('Buscar'));
    await waitFor(() => {
      expect(screen.getByText('Ver detalles')).toBeTruthy();
    });
    fireEvent.click(screen.getByText('Ver detalles'));
    await waitFor(() => {
      expect(screen.getByText('Seleccionar libro')).toBeTruthy();
    });
    fireEvent.click(screen.getByText('Seleccionar libro'));
    expect(onSelectBook).toHaveBeenCalledWith(mockBooks[0]);
  });
});