import bcrypt from 'bcryptjs';
import User from '../../../../models/User';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongo';
import { registerSchema } from '../validation';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { username, email, password } = body;
    const parse = registerSchema.safeParse({ username, email, password });
    if (!parse.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: parse.error.issues }, { status: 400 });
    }
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return NextResponse.json({ error: 'Usuario o email ya existe' }, { status: 400 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    return NextResponse.json({ message: 'Usuario creado', user: { username: user.username, email: user.email, _id: user._id } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
