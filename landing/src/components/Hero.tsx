'use client';

import { Car, ArrowRight, Clock, Play, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';

type DemoState = 'idle' | 'form' | 'registered' | 'completed';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });
  
  const [demoState, setDemoState] = useState<DemoState>('idle');
  const [entryTime, setEntryTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [simulatedMinutes, setSimulatedMinutes] = useState(0);
  const [placa, setPlaca] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('auto');

  // Tarifa de ejemplo
  const TARIFA_POR_HORA = 1000;

  // Actualizar tiempo actual cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calcular minutos transcurridos
  const getMinutosTranscurridos = () => {
    if (!entryTime) return 0;
    const diff = currentTime.getTime() - entryTime.getTime();
    return Math.floor(diff / 60000) + simulatedMinutes;
  };

  // Calcular total a pagar
  const calcularTotal = () => {
    const minutos = getMinutosTranscurridos();
    const horas = Math.ceil(minutos / 60);
    return horas * TARIFA_POR_HORA;
  };

  // Formatear tiempo
  const formatearTiempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}min`;
    }
    return `${mins}min`;
  };

  // Formatear hora
  const formatearHora = (date: Date) => {
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  // Ir al formulario
  const handleIniciarDemo = () => {
    setDemoState('form');
  };

  // Registrar ingreso
  const handleRegistrarIngreso = () => {
    if (!placa.trim()) return;
    setEntryTime(new Date());
    setSimulatedMinutes(60); // Ya viene con 1 hora simulada
    setDemoState('registered');
  };

  // Registrar salida
  const handleRegistrarSalida = () => {
    setDemoState('completed');
  };

  // Reiniciar demo
  const handleReiniciar = () => {
    setDemoState('idle');
    setEntryTime(null);
    setSimulatedMinutes(0);
    setPlaca('');
    setTipoVehiculo('auto');
  };

  const minutosTranscurridos = getMinutosTranscurridos();
  const totalAPagar = calcularTotal();

  return (
    <section ref={sectionRef} id="inicio" className="pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-[90vw] mx-auto">
        <div className={`relative overflow-hidden bg-gradient-to-b from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12 animate-on-scroll ${isInView ? 'animate-fade-in-up' : ''}`}>
          {/* Decorative Circles with Blur - Hidden on mobile */}
          <div className="hidden md:block absolute -top-20 -left-20 w-72 h-72 bg-primary-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="hidden md:block absolute top-1/4 -right-32 w-96 h-96 bg-purple-400 rounded-full opacity-15 blur-3xl"></div>
          <div className="hidden md:block absolute -bottom-24 left-1/3 w-80 h-80 bg-pastel-blue rounded-full opacity-20 blur-3xl"></div>
          <div className="hidden md:block absolute bottom-1/3 right-1/4 w-64 h-64 bg-pastel-pink rounded-full opacity-15 blur-3xl"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 text-center md:text-left">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-pastel-blue to-pastel-purple text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                🚀 Sistema Moderno de Gestión
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                La Playita
              </span>
              <br />
              <span className="text-gray-800">
                Tu Estacionamiento Inteligente
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              Sistema completo para la gestión de playas de estacionamiento. 
              Control de vehículos, tarifas flexibles, reportes en tiempo real y mucho más.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="http://localhost:3000/registro.html" className="btn-primary inline-flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-3">
                Prueba el Sistema por 7 Días
                <ArrowRight size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#caracteristicas" className="btn-secondary inline-flex items-center justify-center gap-2 text-sm sm:text-base px-6 py-3">
                Ver Características
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
              <div className="text-center md:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">100%</div>
                <div className="text-xs sm:text-sm text-gray-600">Seguro</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Disponible</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">∞</div>
                <div className="text-xs sm:text-sm text-gray-600">Vehículos</div>
              </div>
            </div>
          </div>

          {/* Right Content - Demo Interactivo */}
          <div className="relative mt-8 md:mt-0">
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Estado: Sin registrar */}
                  {demoState === 'idle' && (
                    <>
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-full flex items-center justify-center mx-auto mb-4">
                          <Car className="text-white" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Demo Interactivo</h3>
                        <p className="text-gray-600 text-sm mb-6">
                          Prueba cómo funciona el registro de vehículos
                        </p>
                        <button 
                          onClick={handleIniciarDemo}
                          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Play size={20} />
                          Iniciar Demo
                        </button>
                      </div>
                    </>
                  )}

                  {/* Estado: Formulario de registro */}
                  {demoState === 'form' && (
                    <>
                      <div className="py-4">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-full flex items-center justify-center">
                            <Car className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">Registrar Vehículo</h3>
                            <p className="text-xs text-gray-500">Ingresa los datos del vehículo</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Patente <span className="text-gray-500 font-normal">(Cualquier patente del Mercosur)</span>
                            </label>
                            <input
                              type="text"
                              value={placa}
                              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                              placeholder="ABC-1234"
                              maxLength={8}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-center font-semibold text-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tipo de Vehículo
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => setTipoVehiculo('auto')}
                                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                                  tipoVehiculo === 'auto'
                                    ? 'bg-primary-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                🚗 Auto
                              </button>
                              <button
                                onClick={() => setTipoVehiculo('camioneta')}
                                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                                  tipoVehiculo === 'camioneta'
                                    ? 'bg-primary-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                🚙 Camioneta
                              </button>
                              <button
                                onClick={() => setTipoVehiculo('moto')}
                                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                                  tipoVehiculo === 'moto'
                                    ? 'bg-primary-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                🏍️ Moto
                              </button>
                            </div>
                          </div>

                          <button 
                            onClick={handleRegistrarIngreso}
                            disabled={!placa.trim()}
                            className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                              placa.trim()
                                ? 'bg-gradient-to-r from-pastel-green to-green-400 text-white hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            ✓ Registrar Ingreso
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Estado: Registrado */}
                  {demoState === 'registered' && entryTime && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-pastel-orange to-pastel-pink rounded-full flex items-center justify-center">
                            <Car className="text-white" size={24} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{placa}</div>
                            <div className="text-sm text-gray-500 capitalize">{tipoVehiculo}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">
                            ${totalAPagar.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {formatearTiempo(minutosTranscurridos)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Ingreso:</span>
                          <span className="font-semibold">{formatearHora(entryTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tiempo:</span>
                          <span className="font-semibold text-primary-600">
                            {formatearTiempo(minutosTranscurridos)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tarifa:</span>
                          <span className="font-semibold">${TARIFA_POR_HORA.toLocaleString()}/hora</span>
                        </div>
                      </div>

                      <button 
                        onClick={handleRegistrarSalida}
                        className="w-full bg-gradient-to-r from-pastel-green to-green-400 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        ✓ Registrar Salida
                      </button>
                    </>
                  )}

                  {/* Estado: Completado */}
                  {demoState === 'completed' && entryTime && (
                    <>
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-pastel-green to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-3xl">✓</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Ticket Cerrado</h3>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Vehículo:</span>
                          <span className="font-semibold">{placa}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tipo:</span>
                          <span className="font-semibold capitalize">{tipoVehiculo}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Ingreso:</span>
                          <span className="font-semibold">{formatearHora(entryTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Salida:</span>
                          <span className="font-semibold">{formatearHora(currentTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tiempo total:</span>
                          <span className="font-semibold text-primary-600">
                            {formatearTiempo(minutosTranscurridos)}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between">
                          <span className="font-bold text-gray-800">Total:</span>
                          <span className="font-bold text-2xl text-primary-600">
                            ${totalAPagar.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={handleReiniciar}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={20} />
                        Probar Nuevamente
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-pastel-yellow rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pastel-pink rounded-full opacity-50 blur-2xl"></div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
