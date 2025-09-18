
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongo';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: Request) {
  try {
    await connectDB();
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
  } catch (err) {
    console.error('Error en el endpoint de auth:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
