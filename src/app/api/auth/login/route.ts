import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongo';
import { loginSchema } from '../validation';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;
    const parse = loginSchema.safeParse({ email, password });
    if (!parse.success) {
      return NextResponse.json({ error: 'Datos invalidos', details: parse.error.issues }, { status: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 400 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    return NextResponse.json({ token }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
