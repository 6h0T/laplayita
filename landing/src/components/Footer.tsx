import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-12 px-4 sm:px-6 lg:px-8 pb-0 bg-gray-50">
      <div className="w-[90vw] mx-auto bg-gray-900 text-gray-300 rounded-t-3xl px-8 md:px-12 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md">
                <img src="/playita.png" alt="La Playita Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-white">
                La Playita
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Sistema moderno de gestión para playas de estacionamiento. Simplifica tu operación.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#caracteristicas" className="hover:text-white transition-colors">
                  Características
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-white transition-colors">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#planes" className="hover:text-white transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Acceder al Sistema
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:laplayitaestacionamiento@gmail.com" className="hover:text-white transition-colors">
                  laplayitaestacionamiento@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Mendoza, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} La Playita. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a href="/terminos.html" className="hover:text-white transition-colors">
                Términos de Servicio
              </a>
              <a href="/privacidad.html" className="hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="/cookies.html" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
