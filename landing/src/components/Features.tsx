'use client';

import { Car, DollarSign, BarChart3, Shield, Clock, FileText, Users, Zap, CheckCircle2, FileCheck } from 'lucide-react';
import { useRef } from 'react';
import { useInView } from '../hooks/useInView';

const features = [
  {
    icon: Car,
    title: 'Gestión de Vehículos',
    description: 'Control completo de ingresos y salidas con registro detallado de cada vehículo.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: DollarSign,
    title: 'Tarifas Flexibles',
    description: 'Sistema de tarifas por minuto, hora, día completo o modo mixto según tu necesidad.',
    color: 'from-green-400 to-green-600',
  },
  {
    icon: BarChart3,
    title: 'Reportes en Tiempo Real',
    description: 'Dashboard interactivo con estadísticas, KPIs y exportación a Excel.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    icon: Shield,
    title: 'Seguridad Avanzada',
    description: 'Autenticación JWT con control de intentos fallidos y auditoría completa.',
    color: 'from-red-400 to-red-600',
  },
  {
    icon: Clock,
    title: 'Control de Turnos',
    description: 'Apertura y cierre de caja con resumen detallado de movimientos.',
    color: 'from-orange-400 to-orange-600',
  },
  {
    icon: FileText,
    title: 'Tickets Automáticos',
    description: 'Comprobantes de salida con logo personalizado y detalle completo.',
    color: 'from-pink-400 to-pink-600',
  },
  {
    icon: Users,
    title: 'Multi-Empresa',
    description: 'Soporte para múltiples playas de estacionamiento con gestión independiente.',
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    icon: Zap,
    title: 'Rápido y Eficiente',
    description: 'Interfaz moderna y responsive con tiempos de respuesta instantáneos.',
    color: 'from-yellow-400 to-yellow-600',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });
  
  return (
    <section ref={sectionRef} id="caracteristicas" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-[90vw] mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12">
          <div className={`text-center mb-10 sm:mb-12 md:mb-16 animate-on-scroll ${isInView ? 'animate-fade-in-down' : ''}`}>
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
              Características <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Principales</span>
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto text-sm sm:text-base md:text-lg mt-4">
              Sistema optimizado para todo tipo de usuario, desde jóvenes hasta adultos mayores. 
              Diseñado con interfaz intuitiva y probado exitosamente con más de 600 usuarios reales.
            </p>
            <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <span className="font-semibold text-primary-600">✓</span>
                <span className="whitespace-nowrap">Accesible para todas las edades</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <span className="font-semibold text-primary-600">✓</span>
                <span className="whitespace-nowrap">+600 usuarios en pruebas</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <span className="font-semibold text-primary-600">✓</span>
                <span className="whitespace-nowrap">Interfaz intuitiva y simple</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const delays = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500', 'delay-600'];
              return (
                <div
                  key={index}
                  className={`group p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 animate-on-scroll ${isInView ? `animate-fade-in-up ${delays[index % delays.length]}` : ''}`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Sección ARCA/AFIP */}
          <div className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border-2 border-green-200">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileCheck className="text-white" size={48} />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  Integración con ARCA (AFIP)
                </h3>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  Sistema preparado para cumplir con las normativas fiscales argentinas. 
                  Integración lista para conectar con ARCA/AFIP para la emisión de comprobantes electrónicos y cumplimiento tributario.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                    <CheckCircle2 className="text-green-600" size={20} />
                    <span className="font-semibold text-gray-700">Facturación Electrónica</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                    <CheckCircle2 className="text-green-600" size={20} />
                    <span className="font-semibold text-gray-700">Cumplimiento Fiscal</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                    <CheckCircle2 className="text-green-600" size={20} />
                    <span className="font-semibold text-gray-700">Comprobantes Válidos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
