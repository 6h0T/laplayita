'use client';

import { Mail, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { useInView } from '../hooks/useInView';

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });
  
  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-[90vw] mx-auto">
        <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 p-8 sm:p-10 md:p-12 lg:p-16 text-white shadow-2xl animate-on-scroll ${isInView ? 'animate-scale-in' : ''}`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 text-center">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <Sparkles size={14} className="sm:w-4 sm:h-4" />
                  Prueba gratis por 7 días
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                ¿Listo para transformar tu estacionamiento?
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Contáctanos y prueba el sistema completo durante 7 días sin compromiso
              </p>

              <div className="flex justify-center">
                <a
                  href="mailto:laplayitaestacionamiento@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <Mail size={18} className="sm:w-5 sm:h-5" />
                  Contáctanos por Email
                </a>
              </div>

            <div className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-white/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                ✓ 7 días de prueba gratis
              </div>
              <div className="flex items-center gap-2">
                ✓ Sin compromiso
              </div>
              <div className="flex items-center gap-2">
                ✓ Soporte en español
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
