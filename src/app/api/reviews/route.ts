
import { NextRequest, NextResponse } from 'next/server';
import Review from '@/models/Review';
import Vote from '@/models/Vote';
import User from '@/models/User';
import { connectDB } from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import { createReviewSchema, editReviewSchema } from './validation';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parse = createReviewSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parse.error.issues }, { status: 400 });
  }
  const { bookId, rating, text } = body;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    const review = await Review.create({
      user: user._id,
      bookId,
      rating,
      text,
      votes: []
    });

    user.reviews.push(review._id);
    await user.save();

    return NextResponse.json({ review });
  } catch (err) {
    console.error('JWT error:', err);
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');
    if (!bookId) return NextResponse.json({ reviews: [] });

    const reviewsRaw = await Review.find({ bookId }).populate('votes');
    // Para cada reseña, calcula el total de votos
    const reviews = reviewsRaw.map(r => {
      let totalVotes = 0;
      if (Array.isArray(r.votes)) {
        totalVotes = r.votes.reduce((acc: number, v: any) => acc + (v.value || 0), 0);
      }
      return {
        _id: r._id,
        user: r.user.toString(), 
        rating: r.rating,
        text: r.text,
        createdAt: r.createdAt,
        votes: totalVotes
      };
    });
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error('Error en GET /api/reviews:', err);
    return NextResponse.json({ reviews: [], error: 'Error interno del servidor' }, { status: 500 });
  }
}


// Editar reseña
export async function PATCH(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parse = editReviewSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parse.error.issues }, { status: 400 });
  }
  const { reviewId, text, rating } = body;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const review = await Review.findById(reviewId);
    if (!review) return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    if (review.user.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'No tienes permiso para editar esta reseña' }, { status: 403 });
    }
    if (text) review.text = text;
    if (rating) review.rating = rating;
    await review.save();
    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error('Error en PATCH /api/reviews:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Eliminar reseña
export async function DELETE(req: NextRequest) {
  await connectDB();
  const { reviewId } = await req.json();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const review = await Review.findById(reviewId);
    if (!review) return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    if (review.user.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'No tienes permiso para eliminar esta reseña' }, { status: 403 });
    }
    await review.deleteOne();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error en DELETE /api/reviews:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}