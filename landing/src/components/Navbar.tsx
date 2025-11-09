'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <nav className={`fixed w-full bg-white/90 backdrop-blur-md shadow-md z-50 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md">
              <img src="/playita.png" alt="La Playita Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              La Playita
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-primary-600 transition-colors">
              Inicio
            </a>
            <a href="#caracteristicas" className="text-gray-700 hover:text-primary-600 transition-colors">
              Características
            </a>
            <a href="#beneficios" className="text-gray-700 hover:text-primary-600 transition-colors">
              Beneficios
            </a>
            <a href="#planes" className="text-gray-700 hover:text-primary-600 transition-colors">
              Planes
            </a>
            <a 
              href="/index.html" 
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
            >
              Acceder al Sistema
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#inicio"
              className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </a>
            <a
              href="#caracteristicas"
              className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Características
            </a>
            <a
              href="#beneficios"
              className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Beneficios
            </a>
            <a
              href="#planes"
              className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Planes
            </a>
            <a
              href="/index.html"
              className="block px-3 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-md text-center"
            >
              Acceder al Sistema
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
