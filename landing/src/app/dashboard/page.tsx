'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay token
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      // No hay sesión, redirigir al login
      router.push('/login');
      return;
    }

    // Hay sesión válida, redirigir al dashboard en Railway
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://laplayita-production.up.railway.app';
    
    // Guardar token en sessionStorage para que el backend lo use
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userData', user);
    
    // Redirigir al dashboard del backend
    window.location.href = `${backendUrl}/admin/dashboard.html`;
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
}
