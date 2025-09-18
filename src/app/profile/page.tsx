"use client";

import UserProfile from '../components/UserProfile';

export default function ProfilePage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '2rem 0 0 2rem' }}>
        <button onClick={() => window.location.href = '/home'} className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700">Atrás</button>
      </div>
      <UserProfile />
    </main>
  );
}
