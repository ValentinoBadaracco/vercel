import React, { useEffect, useState } from 'react';

interface Review {
  _id: string;
  user: string;
  rating: number;
  text: string;
  createdAt: string;
  votes?: number;
}

interface ReviewsProps {
  bookId: string;
}

const Reviews: React.FC<ReviewsProps> = ({ bookId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [votedReviews, setVotedReviews] = useState<string[]>([]);
  const userId = getUserIdFromToken(); // Debes guardar esto al hacer login

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?bookId=${bookId}`);
    const data = await res.json();
    setReviews(data.reviews || []);
  };

  useEffect(() => {
    // Verificar si el usuario está logueado
    setIsLogged(!!localStorage.getItem('token'));
    fetchReviews();
  }, [bookId]);

  useEffect(() => {
    // Cargar ids de reseñas votadas por el usuario (simulado)
    const voted = JSON.parse(localStorage.getItem('votedReviews') || '[]');
    setVotedReviews(voted);
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookId, rating, text })
    });
    const data = await res.json();
    if (data.review) {
      setReviews([data.review, ...reviews]);
      setText('');
      setRating(5);
    }
    setLoading(false);
  };

  // Función para votar reseñas usando la API real
  const handleVote = async (reviewId: string, value: number) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reviewId, value })
    });
    const data = await res.json();
    if (data.success) {
      await fetchReviews(); // refresca las reseñas y votos
    }
    setLoading(false);
  };

  const handleVoteWrapper = async (reviewId: string, value: number) => {
    await handleVote(reviewId, value);
    // No actualices votedReviews aquí, así el usuario puede cambiar su voto
  };

  const handleEdit = async (reviewId: string) => {
    // Aquí podrías abrir un modal o formulario para editar la reseña
    // Ejemplo simple: prompt para el texto y rating
    const newText = prompt('Nuevo texto de la reseña:');
    const newRating = Number(prompt('Nuevo rating (1-5):'));
    if (!newText || !newRating) return;
    setLoading(true);
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
    setLoading(false);
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta reseña?')) return;
    setLoading(true);
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
    setLoading(false);
  };

  function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">Agregar Reseña</h3>
      {!isLogged && (
        <div className="text-red-500 mb-2">Debes iniciar sesión para agregar una reseña.</div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input type="number" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} required className="w-16 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={!isLogged} />
        <textarea value={text} onChange={e => setText(e.target.value)} required placeholder="Escribe tu reseña..." className="flex-1 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" rows={2} disabled={!isLogged} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading || !isLogged}>Agregar</button>
      </form>
     
      <h3 className="text-lg font-semibold mb-2">Reseñas</h3>
      <ul className="space-y-4">
        {reviews.length === 0 && (
          <li className="text-gray-500">Aún no hay reseñas para este libro.</li>
        )}
        {reviews.map((r, i) => (
          <li key={r._id} className="bg-gray-50 rounded p-3 shadow flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2 mb-1 sm:mb-0">
              <span className="font-bold text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <span className="text-gray-700 ml-2">{r.text}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => handleVoteWrapper(r._id, 1)}
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                title="Votar positivo"
                disabled={loading}
              >👍</button>
              <button
                onClick={() => handleVoteWrapper(r._id, -1)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                title="Votar negativo"
                disabled={loading}
              >👎</button>
              {isLogged && r.user === userId && (
                <>
                  <button onClick={() => handleEdit(r._id)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Editar</button>
                  <button onClick={() => handleDelete(r._id)} className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Eliminar</button>
                </>
              )}
              <span className="text-gray-700">Votos: {r.votes ?? 0}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
