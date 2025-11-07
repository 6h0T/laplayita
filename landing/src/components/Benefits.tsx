'use client';

import { CheckCircle2, TrendingUp, Clock, Shield } from 'lucide-react';
import { useRef } from 'react';
import { useInView } from '../hooks/useInView';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Aumenta tus Ingresos',
    description: 'Control preciso de tarifas y tiempos para maximizar la rentabilidad de tu negocio.',
    stats: '+35%',
    statsLabel: 'Incremento promedio',
  },
  {
    icon: Clock,
    title: 'Ahorra Tiempo',
    description: 'Automatiza procesos y reduce el tiempo de gestión en un 70%.',
    stats: '-70%',
    statsLabel: 'Tiempo de gestión',
  },
  {
    icon: Shield,
    title: 'Reduce Errores',
    description: 'Sistema automático que elimina errores humanos en cálculos y registros.',
    stats: '99.9%',
    statsLabel: 'Precisión',
  },
  {
    icon: CheckCircle2,
    title: 'Mejora la Experiencia',
    description: 'Proceso rápido y eficiente que mejora la satisfacción de tus clientes.',
    stats: '4.8/5',
    statsLabel: 'Satisfacción',
  },
];

export default function Benefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });
  
  return (
    <section ref={sectionRef} id="beneficios" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-[90vw] mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12">
          <div className={`text-center mb-10 sm:mb-12 md:mb-16 animate-on-scroll ${isInView ? 'animate-fade-in-down' : ''}`}>
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
              ¿Por qué elegir <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">La Playita?</span>
            </h2>
            <p className="section-subtitle text-sm sm:text-base md:text-lg mt-4">
              Beneficios reales que transformarán tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const delays = ['', 'delay-200', 'delay-400', 'delay-600'];
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 animate-on-scroll ${isInView ? `animate-fade-in-up ${delays[index]}` : ''}`}
                >
                  <div className="flex items-start gap-4 sm:gap-5 md:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                        {benefit.description}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                          {benefit.stats}
                        </span>
                        <span className="text-sm text-gray-500">
                          {benefit.statsLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
