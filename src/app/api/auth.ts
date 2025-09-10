
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

// Configura tu secret en .env
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
			const { action, username, email, password } = req.body;
			if (action === 'register') {
				// Registro
				const exists = await User.findOne({ $or: [{ email }, { username }] });
				if (exists) return res.status(400).json({ error: 'Usuario o email ya existe' });
				const hash = await bcrypt.hash(password, 10);
				const user = await User.create({ username, email, password: hash });
				return res.status(201).json({ message: 'Usuario creado', user: { username: user.username, email: user.email, _id: user._id } });
		}
		if (action === 'login') {
			// Login
			const user = await User.findOne({ email });
			if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });
			const valid = await bcrypt.compare(password, user.password);
			if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
			const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
			return res.status(200).json({ token });
		}
		return res.status(400).json({ error: 'Acción inválida' });
	}
	res.status(405).json({ error: 'Método no permitido' });
}
