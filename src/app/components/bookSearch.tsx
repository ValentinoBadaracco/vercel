import React from "react";
'use client';


// Tipos globales
export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}
// src/app/components/BookSearch.tsx
import { useState } from 'react';

export default function BookSearch({ onSelectBook }: { onSelectBook: (book: Book) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [showDetails, setShowDetails] = useState<{ [id: string]: boolean }>({});

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.items || []);
    setShowDetails({});
  };

  const handleShowDetails = (id: string) => {
    setShowDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <form onSubmit={searchBooks} className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por título, autor o ISBN"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Buscar</button>
      </form>
      <ul className="space-y-4">
        {results.map(book => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <li key={(book as any).id} className="flex items-center gap-4 bg-white shadow rounded p-4">
            <img
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              src={(book as any).volumeInfo.imageLinks?.thumbnail || ''}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              alt={(book as any).volumeInfo.title}
              className="w-16 h-24 object-cover rounded border"
            />
            <div className="flex-1">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <div className="font-semibold text-lg text-black">{(book as any).volumeInfo.title}</div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <div className="text-gray-900 text-sm mb-2">{(book as any).volumeInfo.authors?.join(', ')}</div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <button
                className="text-blue-600 underline text-sm mb-2"
                onClick={() => handleShowDetails((book as any).id)}
              >
                {showDetails[(book as any).id] ? 'Ocultar detalles' : 'Ver detalles'}
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log('DEBUG: onSelectBook called with', book);
                  onSelectBook(book);
                }}
              >
                Seleccionar libro
              </button>
              {showDetails[(book as any).id] && (
                <div>
                  <div><b>Categorías:</b> {(book as any).volumeInfo.categories?.join(', ')}</div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <div><b>Descripción:</b> {(book as any).volumeInfo.description?.slice(0, 300) || 'Sin descripción'}...</div>
                  <button
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => onSelectBook(book)}
                  >
                    Seleccionar libro
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}