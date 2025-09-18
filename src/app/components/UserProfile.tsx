'use client'
import React, { useEffect, useState } from 'react';

interface Review {
  _id: string;
  bookId: string;
  rating: number;
  text: string;
  createdAt: string;
  votes?: number;
  bookTitle?: string;
  bookCover?: string;
}

const UserProfile: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<{ bookId: string; bookTitle?: string; bookCover?: string }[]>([]);
  const [loadingFav, setLoadingFav] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(async data => {
        // Para cada reseña, busca los datos del libro en Google Books API
        const reviewsWithBook = await Promise.all((data.reviews || []).map(async (r: Review) => {
          try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${r.bookId}`);
            const book = await res.json();
            return {
              ...r,
              bookTitle: book.volumeInfo?.title || r.bookId,
              bookCover: book.volumeInfo?.imageLinks?.thumbnail || ''
            };
          } catch {
            return { ...r, bookTitle: r.bookId, bookCover: '' };
          }
        }));
        setReviews(reviewsWithBook);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/favorites', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(async data => {
        const favsWithBook = await Promise.all((data.favorites || []).map(async (fav: { bookId: string }) => {
          try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${fav.bookId}`);
            const book = await res.json();
            return {
              bookId: fav.bookId,
              bookTitle: book.volumeInfo?.title || fav.bookId,
              bookCover: book.volumeInfo?.imageLinks?.thumbnail || ''
            };
          } catch {
            return { bookId: fav.bookId };
          }
        }));
        setFavorites(favsWithBook);
        setLoadingFav(false);
      });
  }, []);

  const handleEdit = async (reviewId: string) => {
    const newText = prompt('Nuevo texto de la reseña:');
    const newRating = Number(prompt('Nuevo rating (1-5):'));
    if (!newText || !newRating) return;
    const token = localStorage.getItem('token');
    const res = await fetch('/api/reviews', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reviewId, text: newText, rating: newRating })
    });
    const data = await res.json();
    if (data.success) {
      setReviews(reviews => reviews.map(r => r._id === reviewId ? { ...r, text: newText, rating: newRating } : r));
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta reseña?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch('/api/reviews', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reviewId })
    });
    const data = await res.json();
    if (data.success) {
      setReviews(reviews => reviews.filter(r => r._id !== reviewId));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8" style={{ color: '#111', background: '#fff', minHeight: '100vh' }}>
      <h2 className="text-2xl font-bold mb-4">Libros Favoritos</h2>
      {loadingFav ? (
        <div>Cargando favoritos...</div>
      ) : favorites.length === 0 ? (
        <div>No tienes libros favoritos.</div>
      ) : (
        <ul className="space-y-4 mb-8">
          {favorites.map(fav => (
            <li key={fav.bookId} className="bg-gray-50 rounded p-3 shadow-lg flex gap-4 items-center">
              {fav.bookCover && <img src={fav.bookCover} alt={fav.bookTitle} style={{ width: 60, height: 90, objectFit: 'cover', borderRadius: 8 }} />}
              <div>
                <div className="font-semibold">{fav.bookTitle}</div>
                <button
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700"
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    await fetch('/api/favorites', {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ bookId: fav.bookId })
                    });
                    setFavorites(favorites => favorites.filter(f => f.bookId !== fav.bookId));
                  }}
                >Quitar de favoritos</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-2xl font-bold mb-4">Historial de Reseñas</h2>
      {loading ? (
        <div>Cargando...</div>
      ) : reviews.length === 0 ? (
        <div>No has escrito ninguna reseña.</div>
      ) : (
        <ul className="space-y-4">
          {reviews.map(r => (
            <li key={r._id} className="bg-gray-50 rounded p-3 shadow-lg flex gap-4 items-center">
              {r.bookCover && <img src={r.bookCover} alt={r.bookTitle} style={{ width: 60, height: 90, objectFit: 'cover', borderRadius: 8 }} />}
              <div>
                <div className="font-semibold">Libro: {r.bookTitle}</div>
                <div>Rating: {r.rating} ★</div>
                <div>Votos: {r.votes ?? 0}</div>
                <div>{r.text}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(r._id)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Editar</button>
                  <button onClick={() => handleDelete(r._id)} className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Eliminar</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProfile;
