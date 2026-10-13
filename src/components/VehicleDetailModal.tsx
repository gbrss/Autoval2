import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { formatCLP, formatKm, calculateMonthlyFee, buildWhatsAppLink } from '../utils/formatters';
import {
  X,
  Calendar,
  Gauge,
  Fuel,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Car
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onOpenFinancingForVehicle: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onOpenFinancingForVehicle
}) => {
  if (!vehicle) return null;

  const [activeTab, setActiveTab] = useState<'ficha' | 'equipamiento' | 'seguridad' | 'financiamiento'>('ficha');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Credit quick calculation
  const [downPercent, setDownPercent] = useState(20);
  const [installments, setInstallments] = useState(36);

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
  ];

  const currentMonthlyFee = calculateMonthlyFee(vehicle.price, downPercent, installments);
  const downPaymentAmount = Math.round((vehicle.price * downPercent) / 100);

  const whatsappMessage = `Hola Autoval! Estoy interesado en el ${vehicle.brand} ${vehicle.model} ${vehicle.year} (${formatCLP(vehicle.price)}). Me gustaría agendar una visita o consultar por financiamiento.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black text-white max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-red-950 text-red-400 border border-red-800">
              {vehicle.category}
            </span>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white">
                {vehicle.brand} {vehicle.model} <span className="font-normal text-slate-400 text-sm sm:text-base">({vehicle.year})</span>
              </h2>
              <p className="text-xs text-slate-400">{vehicle.version}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xl font-black text-white">{formatCLP(vehicle.price)}</div>
              <div className="text-[11px] text-emerald-400 font-medium">Cuota desde {formatCLP(currentMonthlyFee)}/mes</div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={images[activeImageIndex]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover object-center"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors cursor-pointer"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors cursor-pointer"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="bg-black/75 backdrop-blur-sm text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700">
                  Foto {activeImageIndex + 1} de {images.length}
                </span>
                <span className="bg-emerald-950/80 backdrop-blur-sm text-emerald-400 text-xs px-2.5 py-1 rounded-lg border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Garantía {vehicle.warrantyMonths} Meses
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      idx === activeImageIndex ? 'border-red-500 scale-98' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <Calendar className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Año Modelo</div>
              <div className="text-sm font-bold text-white">{vehicle.year}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <Gauge className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Kilometraje</div>
              <div className="text-sm font-bold text-white">{formatKm(vehicle.mileage)}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <Fuel className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Combustible</div>
              <div className="text-sm font-bold text-white">{vehicle.fuelType}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <Car className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Transmisión</div>
              <div className="text-sm font-bold text-white">{vehicle.transmission}</div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-800 text-xs sm:text-sm font-semibold gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ficha')}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ficha' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Ficha Técnica
            </button>
            <button
              onClick={() => setActiveTab('equipamiento')}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'equipamiento' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Equipamiento ({vehicle.equipment.length})
            </button>
            <button
              onClick={() => setActiveTab('seguridad')}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'seguridad' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Seguridad ({vehicle.safety.length})
            </button>
            <button
              onClick={() => setActiveTab('financiamiento')}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'financiamiento' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Simular Crédito</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            {activeTab === 'ficha' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  {vehicle.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Motor:</span>
                    <span className="font-semibold text-white">{vehicle.engine}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Tracción:</span>
                    <span className="font-semibold text-white">{vehicle.traction}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Color Exterior:</span>
                    <span className="font-semibold text-white">{vehicle.color}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Puertas:</span>
                    <span className="font-semibold text-white">{vehicle.doors}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Terminación Patente:</span>
                    <span className="font-semibold text-white">Dígito {vehicle.plateEnding}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Informe Autofact:</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      100% Limpio al Día
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'equipamiento' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.equipment.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'seguridad' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vehicle.safety.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                      <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-slate-300">
                  <strong className="text-red-400 block mb-1">Garantía Autoval:</strong>
                  Este vehículo cuenta con 140 puntos de inspección mecánica y legal previos a la entrega.
                </div>
              </div>
            )}

            {activeTab === 'financiamiento' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                      <span>Pie Inicial ({downPercent}%)</span>
                      <span className="text-emerald-400 font-bold">{formatCLP(downPaymentAmount)}</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      step="5"
                      value={downPercent}
                      onChange={(e) => setDownPercent(Number(e.target.value))}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Mínimo 20%</span>
                      <span>Máximo 50%</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                      <span>Plazo de Cuotas</span>
                      <span className="text-red-400 font-bold">{installments} Cuotas</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[12, 24, 36, 48].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setInstallments(n)}
                          className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            installments === n
                              ? 'bg-red-600 text-white border-red-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {n}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl">
                  <div>
                    <div className="text-xs text-slate-400">Cuota mensual referencial:</div>
                    <div className="text-2xl font-black text-emerald-400">{formatCLP(currentMonthlyFee)} / mes</div>
                    <div className="text-[11px] text-slate-500">Tasa mensual referencial 1.35% (Sujeto a evaluación)</div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenFinancingForVehicle(vehicle);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Postular a este Crédito
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 hidden sm:block">
            Atención presencial en Valparaíso · Lunes a Viernes 10:00 a 17:00
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href="tel:+5698253776"
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-400" />
              <span>Llamar</span>
            </a>

            <a
              href={buildWhatsAppLink('5698253776', whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar por WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenFinancingForVehicle(vehicle);
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer"
            >
              Simular Crédito
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
