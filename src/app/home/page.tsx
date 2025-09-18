"use client";
import { useState } from 'react';
import BookSearch, { Book } from '../components/bookSearch';
import BookDetails from '../components/bookDetails';

export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBook, setSelectedBook] = useState<any>(null);

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '10px' }}>
        <a href="/profile">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Perfil</button>
        </a>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500"
          onClick={handleLogout}
        >Logout</button>
      </div>
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
