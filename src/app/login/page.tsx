"use client";
import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  function handleAuthSuccess() {
    router.push('/'); // Redirige a la página principal
  }

  return (
    <main>
      <h1>Inicio</h1>
      <AuthForm onAuthSuccess={handleAuthSuccess} />
    </main>
  );
}
