'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className={`max-w-2xl w-full text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo animado */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-white shadow-2xl border-4 border-white transform hover:scale-110 transition-transform duration-300">
              <img 
                src="/playita.png" 
                alt="La Playita Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Código 404 */}
        <div className="mb-6">
          <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-primary-500 via-purple-500 to-primary-700 bg-clip-text text-transparent mb-4 animate-pulse">
            404
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Search size={20} />
            <p className="text-lg sm:text-xl">Página no encontrada</p>
          </div>
        </div>

        {/* Mensaje */}
        <div className="mb-8 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            ¡Ups! Parece que te perdiste
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
            La página que buscas no existe o fue movida. No te preocupes, te ayudamos a volver al camino correcto.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
          >
            <Home size={20} />
            Volver al Inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 font-semibold py-3 px-8 rounded-full border-2 border-primary-500 hover:bg-primary-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 w-full sm:w-auto"
          >
            <ArrowLeft size={20} />
            Página Anterior
          </button>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Enlaces útiles:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/#caracteristicas" className="text-primary-600 hover:text-primary-700 hover:underline transition-colors">
              Características
            </Link>
            <Link href="/#beneficios" className="text-primary-600 hover:text-primary-700 hover:underline transition-colors">
              Beneficios
            </Link>
            <Link href="/#planes" className="text-primary-600 hover:text-primary-700 hover:underline transition-colors">
              Planes
            </Link>
            <a href="mailto:laplayitaestacionamiento@gmail.com" className="text-primary-600 hover:text-primary-700 hover:underline transition-colors">
              Contacto
            </a>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}
