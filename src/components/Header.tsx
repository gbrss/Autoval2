import React, { useState } from 'react';
import { Phone, Clock, Mail, MapPin, Menu, X, Database, ShieldCheck, MessageCircle, Download } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/formatters';

interface HeaderProps {
  onOpenAdmin: () => void;
  stockCount: number;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  stockCount,
  activeSection,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'stock', label: 'Vehículos en Stock', count: stockCount },
    { id: 'financiamiento', label: 'Financiamiento' },
    { id: 'tasacion', label: 'Tasación Online' },
    { id: 'consignacion', label: 'Vende tu Auto' },
    { id: 'servicio', label: 'Autoval Service' },
    { id: 'contacto', label: 'Contacto' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950 text-white shadow-xl border-b border-slate-800">
      {/* Top Bar with Chilean contact info */}
      <div className="bg-slate-900 border-b border-slate-800/80 text-xs text-slate-300 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Valparaíso y Viña del Mar, V Región</span>
            </div>
            <div className="flex items-center gap-1.5 hidden md:flex">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>Lun a Vie: 10:00 a 17:00 hrs</span>
            </div>
            <div className="flex items-center gap-1.5 hidden lg:flex">
              <Mail className="w-3.5 h-3.5 text-red-500" />
              <a href="mailto:ventas@autoval.cl" className="hover:text-red-400 transition-colors">
                ventas@autoval.cl
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <a
              href="tel:+5698253776"
              className="flex items-center gap-1 font-medium text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>(+56) 9 8253 776</span>
            </a>

            <a
              href={buildWhatsAppLink('5698253776', 'Hola Autoval, me gustaría consultar por un vehículo en stock.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Ventas</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('inicio')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white font-black text-xl shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <span>AV</span>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" title="En línea" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-wider text-white">AUTO<span className="text-red-500">VAL</span></span>
              <span className="text-[10px] font-semibold bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded">12+ Años</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight">
              Automotora · Valparaíso y Viña del Mar
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`text-xs px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white text-red-700 font-bold' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/api/download-zip"
            download="autoval-clon-astro.zip"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs sm:text-sm font-medium transition-all shadow-sm hover:border-slate-500 cursor-pointer"
            title="Descargar código completo del proyecto en ZIP para subir a GitHub"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">Descargar ZIP</span>
            <span className="bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 rounded border border-blue-500/30">
              GitHub
            </span>
          </a>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs sm:text-sm font-medium transition-all shadow-sm hover:border-slate-500 cursor-pointer"
            title="Gestionar vehículos en stock y base de datos PostgreSQL"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Admin Stock</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30">
              PostgreSQL
            </span>
          </button>

          <button
            onClick={() => handleNavClick('tasacion')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-red-600/20 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tasar mi Auto</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                activeSection === item.id
                  ? 'bg-red-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded-full border border-slate-700">
                  {item.count} autos
                </span>
              )}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="/api/download-zip"
              download="autoval-clon-astro.zip"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 text-blue-400 rounded-lg text-sm font-medium border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>Descargar ZIP para GitHub</span>
            </a>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 text-emerald-400 rounded-lg text-sm font-medium border border-slate-700"
            >
              <Database className="w-4 h-4" />
              <span>Gestionar Stock & PostgreSQL</span>
            </button>
            <button
              onClick={() => handleNavClick('tasacion')}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Tasar mi Auto Gratis</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
