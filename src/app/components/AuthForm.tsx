import React, { useState } from 'react';

export default function AuthForm({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const [action, setAction] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const body: any = { action, email, password };
    if (action === 'register') body.username = username;
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (action === 'login' && data.token) {
      localStorage.setItem('token', data.token);
      setMessage('Login exitoso');
      if (onAuthSuccess) onAuthSuccess();
    } else if (action === 'register' && data.user) {
      // Si el backend no devuelve token, haz login automático tras registro
      setMessage('Registro exitoso');
      // Opcional: pedir login automático tras registro
      // Puedes pedir el token aquí si el backend lo devuelve
      if (onAuthSuccess) onAuthSuccess();
    } else {
      setMessage(data.error || 'Error');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setMessage('Logout exitoso');
  }

  return (
    <div>
      <h2>{action === 'login' ? 'Login' : 'Registro'}</h2>
      <form onSubmit={handleSubmit}>
        {action === 'register' && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{action === 'login' ? 'Login' : 'Registrarse'}</button>
      </form>
      <button onClick={() => setAction(action === 'login' ? 'register' : 'login')}>
        {action === 'login' ? '¿No tienes cuenta? Registrate' : '¿Ya tienes cuenta? Login'}
      </button>
      <button onClick={handleLogout}>Logout</button>
      <div>{message}</div>
    </div>
  );
}
