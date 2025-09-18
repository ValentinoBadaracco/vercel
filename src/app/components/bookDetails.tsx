"use client";
import React from "react";
import type { Book } from "./bookSearch";
import Reviews from './Reviews';
export interface Review {
  id: string;
  bookId: string;
  rating: number;
  text: string;
  votes: number;
}
// src/app/components/BookDetails.tsx
import { useEffect, useState } from "react";
import { addReview, getReviews, voteReview } from "../actions/reviewActions";

export default function BookDetails({ book }: { book: Book }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchReviews() {
  const res = await getReviews(book.id);
  setReviews(res as Review[]);
  }

  useEffect(() => {
    fetchReviews();
  }, [book.id]);

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("bookId", book.id);
    formData.append("rating", rating.toString());
    formData.append("text", text);
  await addReview(formData);
  setText("");
  setRating(5);
  // Forzar un pequeño delay para asegurar el reseteo antes de refrescar
  await new Promise(res => setTimeout(res, 10));
  await fetchReviews();
  setLoading(false);
  }

  async function handleVote(reviewId: string, delta: number) {
    setLoading(true);
    await voteReview(reviewId, delta);
    await fetchReviews();
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
      <div className="flex gap-6 items-start mb-6">
        <img
          src={book.volumeInfo.imageLinks?.thumbnail}
          alt="cover"
          className="w-32 h-48 object-cover rounded border shadow"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2  text-gray-900">{book.volumeInfo.title}</h2>
          <p className="text-gray-700 mb-1"><b>Autor:</b> {book.volumeInfo.authors?.join(', ')}</p>
          <p className="text-gray-700 mb-1"><b>Publicado:</b> {book.volumeInfo.publishedDate}</p>
          <p className="text-gray-600 text-sm mt-2">{book.volumeInfo.description}</p>
          <button
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded shadow hover:bg-pink-700"
            onClick={async () => {
              const token = localStorage.getItem('token');
              const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bookId: book.id })
              });
              const data = await res.json();
              if (data.success) {
                alert('Libro agregado a favoritos');
              } else {
                alert(data.error || 'Error al agregar a favoritos');
              }
            }}
          >Agregar a favoritos</button>
        </div>
      </div>

  {/* El formulario de agregar reseña ahora está en el componente <Reviews /> */}
      
  <Reviews bookId={book.id} />
    </div>
  );
}