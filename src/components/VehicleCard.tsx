import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { formatCLP, formatKm, calculateMonthlyFee, buildWhatsAppLink } from '../utils/formatters';
import { Fuel, Gauge, Calendar, ShieldCheck, ChevronLeft, ChevronRight, Eye, MessageCircle, Sparkles } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  viewMode?: 'grid' | 'list';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect, viewMode = 'grid' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
  ];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const monthlyFee = calculateMonthlyFee(vehicle.price, 20, 36);

  const discount = vehicle.originalPrice && vehicle.originalPrice > vehicle.price
    ? vehicle.originalPrice - vehicle.price
    : null;

  const whatsappMessage = `Hola Autoval! Me interesa consultar por el ${vehicle.brand} ${vehicle.model} ${vehicle.year} (${formatCLP(vehicle.price)}). ¿Sigue disponible para ver en Valparaíso?`;

  if (viewMode === 'list') {
    return (
      <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-black/40 flex flex-col md:flex-row">
        {/* Image Area */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 bg-slate-950 overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {vehicle.featured && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Destacado
              </span>
            )}
            {vehicle.status === 'Reservado' ? (
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                Reservado
              </span>
            ) : vehicle.status === 'Vendido' ? (
              <span className="bg-slate-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                Vendido
              </span>
            ) : (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                Disponible
              </span>
            )}
          </div>

          {/* Image Navigation */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={prevImage}
                className="pointer-events-auto p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="pointer-events-auto p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">{vehicle.brand}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                  {vehicle.model} <span className="text-sm font-normal text-slate-400">{vehicle.version}</span>
                </h3>
              </div>

              <div className="text-right">
                <div className="text-xl font-extrabold text-white">
                  {formatCLP(vehicle.price)}
                </div>
                {discount && (
                  <div className="text-xs text-slate-400 line-through">
                    {formatCLP(vehicle.originalPrice!)}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-red-400" />
                <span>Año {vehicle.year}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <Gauge className="w-3.5 h-3.5 text-red-400" />
                <span>{formatKm(vehicle.mileage)}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <Fuel className="w-3.5 h-3.5 text-red-400" />
                <span>{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Garantía {vehicle.warrantyMonths}m</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2">
              {vehicle.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-emerald-400 font-medium">
              Cuota desde <span className="font-bold text-sm text-emerald-300">{formatCLP(monthlyFee)}</span>/mes (pie 20%)
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <a
                href={buildWhatsAppLink('5698253776', whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => onSelect(vehicle)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-600/20 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Ficha</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Mode
  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-2xl hover:shadow-black/50 flex flex-col justify-between">
      <div>
        {/* Image Container with Slider */}
        <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onSelect(vehicle)}>
          <img
            src={images[currentImageIndex]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {vehicle.featured && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Destacado
              </span>
            )}
            {discount && (
              <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Bono {formatCLP(discount)}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10">
            {vehicle.status === 'Reservado' ? (
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                Reservado
              </span>
            ) : vehicle.status === 'Vendido' ? (
              <span className="bg-slate-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                Vendido
              </span>
            ) : (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                Disponible
              </span>
            )}
          </div>

          {/* Image Dots and Arrows */}
          {images.length > 1 && (
            <>
              <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={prevImage}
                  className="pointer-events-auto p-1 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-colors"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="pointer-events-auto p-1 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-colors"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentImageIndex ? 'w-4 bg-red-500' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-red-400 tracking-wider uppercase">{vehicle.brand}</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">{vehicle.category}</span>
          </div>

          <h3
            onClick={() => onSelect(vehicle)}
            className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {vehicle.model} <span className="text-xs font-normal text-slate-400">{vehicle.version}</span>
          </h3>

          {/* 4 Quick Spec Badges */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              <span>Año {vehicle.year}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <Gauge className="w-3.5 h-3.5 text-red-400" />
              <span>{formatKm(vehicle.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <Fuel className="w-3.5 h-3.5 text-red-400" />
              <span>{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{vehicle.transmission}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="pt-2 pb-1 border-t border-slate-800">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Precio Contado</span>
                <span className="text-xl sm:text-2xl font-black text-white">{formatCLP(vehicle.price)}</span>
              </div>
              {discount && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 line-through block">Antes</span>
                  <span className="text-xs text-slate-400 line-through">{formatCLP(vehicle.originalPrice!)}</span>
                </div>
              )}
            </div>

            {/* Monthly financing fee */}
            <div className="mt-2 py-1.5 px-2.5 rounded-lg bg-emerald-950/50 border border-emerald-900/60 flex items-center justify-between text-xs">
              <span className="text-emerald-400 text-[11px]">Cuota desde:</span>
              <span className="font-bold text-emerald-300">{formatCLP(monthlyFee)} / mes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
        <a
          href={buildWhatsAppLink('5698253776', whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center shrink-0"
          title="Consultar por WhatsApp a un ejecutivo"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        <button
          onClick={() => onSelect(vehicle)}
          className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Ver Ficha Completa</span>
        </button>
      </div>
    </div>
  );
};
