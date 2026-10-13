import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/formatters';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer id="contacto" className="bg-slate-950 text-white border-t border-slate-800">
      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white font-black text-xl shadow-lg shadow-red-600/30">
                AV
              </div>
              <div>
                <span className="text-2xl font-black tracking-wider text-white">AUTO<span className="text-red-500">VAL</span></span>
                <p className="text-[11px] text-slate-400 font-medium">Automotora · Valparaíso y Viña del Mar</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Empresa automotriz con más de 12 años de sólida trayectoria en la V Región de Chile. Especialistas en venta de vehículos nuevos, seminuevos seleccionados, compra inmediata, consignación y financiamiento multimarca.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantía mecánica y revisión técnica de 140 puntos</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navegación</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('stock')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Stock de Vehículos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('financiamiento')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Simulador de Crédito
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tasacion')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Tasa tu Auto Online
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('consignacion')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Vende en Consignación
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('servicio')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Autoval Service
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer">
                  Panel PostgreSQL
                </button>
              </li>
              <li>
                <a
                  href="/api/download-zip"
                  download="autoval-clon-astro.zip"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Descargar ZIP (GitHub)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Brands Available */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Marcas Destacadas</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <span className="hover:text-white transition-colors">Peugeot</span>
              <span className="hover:text-white transition-colors">Nissan</span>
              <span className="hover:text-white transition-colors">Kia</span>
              <span className="hover:text-white transition-colors">Mitsubishi</span>
              <span className="hover:text-white transition-colors">Chery</span>
              <span className="hover:text-white transition-colors">Toyota</span>
              <span className="hover:text-white transition-colors">Hyundai</span>
              <span className="hover:text-white transition-colors">Suzuki</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              Todas las marcas se comercializan con Autofact al día y revisión de prendas e inhibiciones.
            </p>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contacto & Sucursal</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Showroom Valparaíso & Viña del Mar, Región de Valparaíso, Chile</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span>Lunes a Viernes: 10:00 a 17:00 hrs</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href="tel:+5698253776" className="hover:text-white font-semibold">
                  (+56) 9 8253 776
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href="mailto:ventas@autoval.cl" className="hover:text-white">
                  ventas@autoval.cl
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={buildWhatsAppLink('5698253776', 'Hola Autoval, quisiera consultar por los vehículos en venta.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>Chatear con Ejecutivo (+56 9 8253 776)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Autoval Automotora (autoval2.cl). Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-2">
            <span>Versión moderna y ultra rápida en Astro JS & React con PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
