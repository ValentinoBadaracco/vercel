
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongo';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, username, email, password } = body;

    if (action === 'register') {
      const exists = await User.findOne({ $or: [{ email }, { username }] });
      if (exists) {
        return NextResponse.json({ error: 'Usuario o email ya existe' }, { status: 400 });
      }
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hash });
      return NextResponse.json({ message: 'Usuario creado', user: { username: user.username, email: user.email, _id: user._id } }, { status: 201 });
    }

    if (action === 'login') {
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
    }

    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
  } catch (err) {
    console.error('Error en el endpoint de auth:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
