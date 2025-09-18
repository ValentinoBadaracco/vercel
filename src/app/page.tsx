// src/app/page.tsx
'use client';
import { useState } from 'react';
import BookSearch, { Book } from './components/bookSearch';
import BookDetails from './components/bookDetails';

import AuthForm from './components/AuthForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MainPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  function handleAuthSuccess() {
    router.push('/home');
  }

  return (
    <main>
      <h1>Login / Registro</h1>
      <AuthForm onAuthSuccess={handleAuthSuccess} />
    </main>
  );
}