import { NextRequest, NextResponse } from 'next/server';
import Review from '@/models/Review';
import User from '@/models/User';
import { connectDB } from '@/lib/mongo';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await connectDB();
  const { bookId, rating, text } = await req.json();
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
  await connectDB();
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get('bookId');
  if (!bookId) return NextResponse.json({ reviews: [] });

  const reviews = await Review.find({ bookId }).populate('user', 'username');
  return NextResponse.json({ reviews });
}