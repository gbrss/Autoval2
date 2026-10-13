import React, { useState } from 'react';
import { Wrench, Shield, Check, Calendar, Phone, Sparkles, AlertCircle } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/formatters';

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState('Mantención por Pauta');
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentPhone, setAppointmentPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [booked, setBooked] = useState(false);

  const services = [
    {
      title: 'Mantención por Pauta',
      desc: 'Cambio de aceite sintético, filtros de aire/polen, bujías y chequeo integral de 40 puntos para mantener tu garantía de fábrica.',
      price: 'Desde $89.900'
    },
    {
      title: 'Frenos y Suspensión',
      desc: 'Rectificado de discos, cambio de pastillas cerámicas, amortiguadores y alineación 3D computarizada.',
      price: 'Desde $49.900'
    },
    {
      title: 'Desabolladura y Pintura',
      desc: 'Taller de pintura en horno presurizado con colorimetría computarizada y pulido cerámico tricapa.',
      price: 'Cotización en taller'
    },
    {
      title: 'Diagnóstico & Scanner',
      desc: 'Scanner multimarca OBD2 / CAN-Bus para detección de códigos de error de motor, transmisión y airbags.',
      price: 'Desde $35.000'
    }
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentName || !appointmentPhone) return;
    setBooked(true);
  };

  return (
    <section id="servicio" className="py-16 bg-slate-950 text-white border-b border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 text-xs font-semibold mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Taller Mecánico & Posventa Oficial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Autoval Service & Seguros Automotrices
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            No solo vendemos tu vehículo: cuidamos su rendimiento con mecánicos certificados y las coberturas de seguro más completas de Chile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Services Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((srv, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedService(srv.title)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedService === srv.title
                    ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-950/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{srv.price}</span>
                    {selectedService === srv.title && (
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{srv.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{srv.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Repuestos originales garantizados</span>
                </div>
              </div>
            ))}

            {/* Insurance Card */}
            <div className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Shield className="w-4 h-4" />
                  <span>Seguros con Deducible Inteligente</span>
                </div>
                <h4 className="text-sm font-bold text-white">¿Buscas asegurar tu auto nuevo o usado?</h4>
                <p className="text-xs text-slate-400">
                  Comparamos entre HDI, BCI, Mapfre y Consorcio para darte la prima más conveniente con asistencia en ruta 24/7.
                </p>
              </div>

              <a
                href={buildWhatsAppLink('5698253776', 'Hola Autoval, quisiera cotizar un seguro automotriz para mi vehículo.')}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cotizar Seguro</span>
              </a>
            </div>
          </div>

          {/* Quick Workshop Appointment Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Calendar className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Agendar Hora en Taller
              </h3>
            </div>

            {booked ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">¡Hora Agendada con Éxito!</h4>
                <p className="text-xs text-slate-300">
                  Te esperamos en nuestro taller de Valparaíso para <strong>{selectedService}</strong>. Te enviaremos un recordatorio por WhatsApp.
                </p>
                <button
                  onClick={() => setBooked(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white"
                >
                  Agendar otra hora
                </button>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Servicio Solicitado</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {services.map((s) => (
                      <option key={s.title} value={s.title}>{s.title} ({s.price})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tu Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={appointmentName}
                    onChange={(e) => setAppointmentName(e.target.value)}
                    placeholder="Ej: Marcelo Gómez"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={appointmentPhone}
                    onChange={(e) => setAppointmentPhone(e.target.value)}
                    placeholder="+56 9 8253 776"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Preferida</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Cupo en Taller</span>
                </button>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Horario de taller: Lunes a Viernes 09:00 a 17:30 hrs.</span>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
