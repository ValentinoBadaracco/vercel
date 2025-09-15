import { NextRequest, NextResponse } from 'next/server';
import Review from '@/models/Review';
import { connectDB } from '@/lib/mongo';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;
    const reviewsRaw = await Review.find({ user: userId }).sort({ createdAt: -1 }).populate('votes');
    const reviews = reviewsRaw.map(r => {
      let totalVotes = 0;
      if (Array.isArray(r.votes)) {
        totalVotes = r.votes.reduce((acc: number, v: any) => acc + (v.value || 0), 0);
      }
      return {
        _id: r._id,
        bookId: r.bookId,
        rating: r.rating,
        text: r.text,
        createdAt: r.createdAt,
        votes: totalVotes
      };
    });
    return NextResponse.json({ reviews });
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
