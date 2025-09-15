import { NextRequest, NextResponse } from 'next/server';
import Favorite from '@/models/Favorite';
import { connectDB } from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import { addFavoriteSchema, removeFavoriteSchema } from './validation';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parse = addFavoriteSchema.safeParse({
    ...body,
    userId: 'dummy', 
  });
  if (!parse.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parse.error.issues }, { status: 400 });
  }
  const { bookId } = body;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;
    // Evita duplicados
    const exists = await Favorite.findOne({ user: userId, bookId });
    if (exists) return NextResponse.json({ error: 'Ya está en favoritos' }, { status: 400 });
    await Favorite.create({ user: userId, bookId });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;
    const favorites = await Favorite.find({ user: userId });
    return NextResponse.json({ favorites });
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parse = removeFavoriteSchema.safeParse({
    ...body,
    userId: 'dummy', // userId lo ponemos dummy, se sobreescribe luego
  });
  if (!parse.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parse.error.issues }, { status: 400 });
  }
  const { bookId } = body;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;
    await Favorite.deleteOne({ user: userId, bookId });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
