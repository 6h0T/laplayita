'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    nombre_contacto: '',
    email: '',
    telefono: '',
    usuario: '',
    password: '',
    password_confirm: '',
    terminos: false
  });
  const [registroData, setRegistroData] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.password_confirm) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!formData.terminos) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_empresa: formData.nombre_empresa,
          nombre_contacto: formData.nombre_contacto,
          email: formData.email,
          telefono: formData.telefono,
          usuario: formData.usuario,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar');
      }

      setRegistroData(data.data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al procesar el registro');
    } finally {
      setLoading(false);
    }
  };

  if (success && registroData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Registro Exitoso!</h2>
            <p className="text-gray-600">Tu cuenta ha sido creada correctamente</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Número de Cliente:</span>
              <span className="font-semibold text-primary-600">{registroData.numero_cliente}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Usuario:</span>
              <span className="font-semibold text-primary-600">{registroData.usuario}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-semibold text-gray-700">{registroData.email}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-600">💡 Para iniciar sesión usa:</strong><br />
              <strong>Usuario:</strong> {registroData.usuario}<br />
              <strong>Contraseña:</strong> La que acabas de crear<br />
              <strong>Días de prueba:</strong> 7 días gratis
            </p>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Panel Izquierdo */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 lg:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                </div>
                
                <h2 className="text-3xl font-bold mb-4">¡Bienvenido a La Playita!</h2>
                <p className="text-lg mb-8 opacity-95">Gestiona tu estacionamiento de forma profesional</p>
                
                <div className="space-y-4">
                  {[
                    '7 días de prueba gratis',
                    'Sin tarjeta de crédito',
                    'Configuración en 5 minutos',
                    'Todas las funciones incluidas'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/15 backdrop-blur-sm p-3 rounded-xl hover:bg-white/25 transition-all">
                      <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-sm">✓</div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Derecho - Formulario */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="max-w-xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Crear Cuenta</h3>
                  <p className="text-gray-600">Completa el formulario para comenzar tu prueba gratuita</p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Empresa
                      </label>
                      <input
                        type="text"
                        name="nombre_empresa"
                        value={formData.nombre_empresa}
                        onChange={handleChange}
                        placeholder="Ej: Estacionamiento Central"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tu Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="nombre_contacto"
                        value={formData.nombre_contacto}
                        onChange={handleChange}
                        placeholder="Ej: Juan Pérez"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="+54 261 123-4567"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usuario
                      </label>
                      <input
                        type="text"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleChange}
                        placeholder="usuario123"
                        required
                        pattern="[a-zA-Z0-9._-]+"
                        minLength={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">Solo letras, números, puntos y guiones</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      name="password_confirm"
                      value={formData.password_confirm}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      name="terminos"
                      checked={formData.terminos}
                      onChange={handleChange}
                      required
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-600">
                      Acepto los <a href="/terminos" target="_blank" className="text-blue-600 hover:underline">términos y condiciones</a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Procesando...
                      </span>
                    ) : (
                      'Crear Cuenta Gratis'
                    )}
                  </button>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <span className="text-gray-600">¿Ya tienes cuenta?</span>{' '}
                    <a href="/login" className="text-blue-600 font-semibold hover:underline">
                      Inicia sesión aquí
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
