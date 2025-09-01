// src/app/page.tsx
'use client';
import { useState } from 'react';
import BookSearch from './components/bookSearch';
import BookDetails from './components/bookDetails';

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState<any>(null);

  return (
    <main>
      <h1>App de Reseñas de Libros</h1>
      {!selectedBook ? (
        <BookSearch onSelectBook={setSelectedBook} />
      ) : (
        <>
          <button onClick={() => setSelectedBook(null)}>Volver a buscar</button>
          <BookDetails book={selectedBook} />
        </>
      )}
    </main>
  );
}