import { NextRequest, NextResponse } from 'next/server';
import Vote from '@/models/Vote';
import User from '@/models/User';
import { connectDB } from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import { voteSchema } from './validation';


export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parse = voteSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parse.error.issues }, { status: 400 });
  }
  const { reviewId, value } = body;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    // Verifica si el usuario ya votó esta reseña
    let vote = await Vote.findOne({ user: user._id, review: reviewId });

    if (vote) {
      // Si ya votó, actualiza el valor
      vote.value = value;
      await vote.save();
    } else {
      // Si no votó, crea el voto
      vote = await Vote.create({ user: user._id, review: reviewId, value });
      // Agrega el voto al array de votos de la reseña
      await (await import('@/models/Review')).default.findByIdAndUpdate(reviewId, { $push: { votes: vote._id } });
    }

    // Calcular el total de votos (suma de valores)
  const votesArr = await Vote.find({ review: reviewId });
  const totalVotes = votesArr.reduce((acc: number, v: { value: number }) => acc + v.value, 0);


    return NextResponse.json({ success: true, totalVotes });
  } catch (err) {
    console.error('JWT error:', err);
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}