'use client';

import { Check, Sparkles, Zap, Shield } from 'lucide-react';
import { useRef } from 'react';
import { useInView } from '../hooks/useInView';

const features = [
  'Vehículos ilimitados',
  'Usuarios ilimitados',
  'Gestión completa de ingresos y salidas',
  'Sistema de tarifas flexible (minuto/hora/día/mixto)',
  'Dashboard interactivo con estadísticas en tiempo real',
  'Reportes completos y exportación a Excel',
  'Control de turnos de caja',
  'Tickets de salida automáticos con logo personalizado',
  'Multi-empresa (gestión de múltiples playas)',
  'Autenticación segura con JWT',
  'Base de datos PostgreSQL incluida',
  'Interfaz moderna y responsive',
  'Actualizaciones gratuitas de por vida',
  'Soporte técnico incluido',
  'Sin costos mensuales ni ocultos',
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });
  
  return (
    <section ref={sectionRef} id="planes" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-[90vw] mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12">
          <div className={`text-center mb-8 sm:mb-10 md:mb-12 animate-on-scroll ${isInView ? 'animate-fade-in-down' : ''}`}>
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
              Inversión <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Única</span>
            </h2>
            <p className="section-subtitle text-sm sm:text-base md:text-lg mt-4">
              Paga una sola vez y úsalo para siempre. Sin mensualidades ni sorpresas.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Precio Principal - Ocupa 2 columnas */}
            <div className="md:col-span-2 relative rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 p-8 md:p-10 text-white shadow-lg">
              {/* Badge */}
              <div className="absolute -top-3 left-6">
                <span className="bg-gradient-to-r from-pastel-orange to-pastel-pink text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2">
                  <Sparkles size={14} />
                  Oferta de Lanzamiento
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Sistema Completo La Playita</h3>
                <p className="text-lg text-white/90 mb-6">
                  Todo lo que necesitas para gestionar tu estacionamiento de forma profesional
                </p>
                
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl text-white/70 line-through">$120.000</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      33% OFF
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold">$80.000</span>
                  </div>
                  <p className="text-lg text-white/90 mt-2">Pago único - Sin mensualidades</p>
                </div>

                <a
                  href="https://laplayita-production.up.railway.app/index.html"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold text-base md:text-lg py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <Zap size={20} />
                  Comprar Ahora
                </a>
              </div>
            </div>

            {/* Garantías - Columna derecha */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-3">
                  <Shield className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Garantía Total</h3>
                <p className="text-sm text-gray-600">
                  30 días de garantía o te devolvemos tu dinero.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Instalación Rápida</h3>
                <p className="text-sm text-gray-600">
                  Configuración en menos de 30 minutos.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Actualizaciones Gratis</h3>
                <p className="text-sm text-gray-600">
                  Todas las actualizaciones futuras incluidas.
                </p>
              </div>
            </div>

            {/* Características - Ocupa 3 columnas */}
            <div className="md:col-span-3 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Todo lo que incluye</h3>
              <div className="grid md:grid-cols-3 gap-x-6 gap-y-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="flex-shrink-0 mt-0.5 text-green-600" size={18} />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer - Ocupa 3 columnas */}
            <div className="md:col-span-3 text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                ¿Tienes dudas? <a href="#contacto" className="text-primary-600 font-semibold hover:underline">Contáctanos</a>
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span className="font-medium">Pago único</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span className="font-medium">Código fuente incluido</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span className="font-medium">Soporte técnico</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
