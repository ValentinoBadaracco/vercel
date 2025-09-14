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
      setMessage('Registro exitoso');
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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f6fa"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem 2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
          minWidth: "320px",
          maxWidth: "90vw"
        }}
      >
        {action === 'register' && (
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d8e0",
              fontSize: "1rem"
            }}
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: "0.8rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d8e0",
            fontSize: "1rem"
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: "0.8rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d8e0",
            fontSize: "1rem"
          }}
        />
        <button
          type="submit"
          style={{
            background: "#2986cc",
            color: "#fff",
            padding: "0.8rem 1rem",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(41,134,204,0.12)",
            transition: "background 0.2s"
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#1769aa")}
          onMouseOut={e => (e.currentTarget.style.background = "#2986cc")}
        >
          {action === 'login' ? 'Iniciar sesión' : 'Registrarse'}
        </button>
        <button
          type="button"
          onClick={() => setAction(action === 'login' ? 'register' : 'login')}
          style={{marginTop: '0.5rem', background: 'none', border: 'none', color: '#2986cc', cursor: 'pointer', fontWeight: 'bold'}}
        >
          {action === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </form>
      <div style={{marginTop: '1rem', color: '#1769aa', fontWeight: 'bold'}}>{message}</div>
    </div>
  );
}
