import { NextRequest, NextResponse } from 'next/server';
import Vote from '@/models/Vote';
import User from '@/models/User';
import { connectDB } from '@/lib/mongo';
import jwt from 'jsonwebtoken';


export async function POST(req: NextRequest) {
  await connectDB();
  const {reviewId, value} = await req.json();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = await User.findById(decoded.userId);
      if (!userId) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

       // Verifica si el usuario ya votó esta reseña
    let vote = await Vote.findOne({ user: userId, review: reviewId });

    if (vote) {
      // Si ya votó, actualiza el valor
      vote.value = value;
      await vote.save();
    } else {
      // Si no votó, crea el voto
      vote = await Vote.create({ user: userId, review: reviewId, value });
      // Agrega el voto al array de votos de la reseña
      await Review.findByIdAndUpdate(reviewId, { $push: { votes: vote._id } });
    }
  
      const votes = await Vote.create({
        user: user._id,
        votes: [vote]
      });

      user.votes.push(votes._id);
      await user.save();

      return NextResponse.json({ votes });
    } catch (err) {
      console.error('JWT error:', err);
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
  }

}