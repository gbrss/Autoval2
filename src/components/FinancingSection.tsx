import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types/vehicle';
import { formatCLP, calculateMonthlyFee } from '../utils/formatters';
import { Calculator, CheckCircle2, Shield, CreditCard, Sparkles, Send, Loader2 } from 'lucide-react';

interface FinancingSectionProps {
  selectedVehicle?: Vehicle | null;
  onClearSelectedVehicle?: () => void;
}

export const FinancingSection: React.FC<FinancingSectionProps> = ({
  selectedVehicle,
  onClearSelectedVehicle
}) => {
  const [creditType, setCreditType] = useState<'Compra Inteligente' | 'Crédito Convencional'>('Crédito Convencional');
  const [vehiclePrice, setVehiclePrice] = useState(14000000);
  const [downPercent, setDownPercent] = useState(20);
  const [installments, setInstallments] = useState(36);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    email: '',
    phone: '',
    monthlyIncome: '',
    employmentType: 'Dependiente' as 'Dependiente' | 'Independiente' | 'Empresa'
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync if vehicle was passed
  useEffect(() => {
    if (selectedVehicle) {
      setVehiclePrice(selectedVehicle.price);
    }
  }, [selectedVehicle]);

  const downPaymentAmount = Math.round((vehiclePrice * downPercent) / 100);
  const loanAmount = vehiclePrice - downPaymentAmount;
  const monthlyFee = calculateMonthlyFee(vehiclePrice, downPercent, installments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.rut || !formData.email || !formData.phone) {
      setErrorMsg('Por favor completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/financing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selectedVehicle?.id,
          vehicleTitle: selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model} ${selectedVehicle.year}` : 'Auto seleccionado por cliente',
          vehiclePrice,
          downPaymentPercent: downPercent,
          downPaymentAmount,
          installments,
          type: creditType,
          monthlyFee,
          name: formData.name,
          rut: formData.rut,
          email: formData.email,
          phone: formData.phone,
          monthlyIncome: Number(formData.monthlyIncome) || 850000,
          employmentType: formData.employmentType
        })
      });

      const res = await response.json();
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.error || 'Ocurrió un error al enviar la solicitud.');
      }
    } catch (err) {
      setErrorMsg('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="financiamiento" className="py-16 bg-slate-900 text-white border-b border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 text-xs font-semibold mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Financiamiento Automotriz en Valparaíso</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Simulador de Crédito a tu Medida
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Trabajamos con las principales entidades financieras automotrices de Chile (Santander Consumer, Forum, Tanner, Eurocapital) para brindarte la mejor tasa.
          </p>
        </div>

        {/* Selected Vehicle Alert if any */}
        {selectedVehicle && (
          <div className="mb-8 p-4 rounded-2xl bg-red-950/60 border border-red-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-red-400" />
              <div>
                <span className="text-xs text-red-400 font-semibold uppercase">Vehículo seleccionado:</span>
                <div className="text-sm font-bold text-white">
                  {selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.year} - {formatCLP(selectedVehicle.price)}
                </div>
              </div>
            </div>

            {onClearSelectedVehicle && (
              <button
                onClick={onClearSelectedVehicle}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Cambiar auto
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Calculator Island */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                <Calculator className="w-4 h-4" />
                <span>Simula tu cuota</span>
              </div>
              <span className="text-xs text-slate-400">Tasa referencial 1.35% mensual</span>
            </div>

            {/* Credit Type Selector */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Modalidad de Financiamiento</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCreditType('Crédito Convencional')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    creditType === 'Crédito Convencional'
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <div>Crédito Convencional</div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">Cuotas fijas hasta 60m</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCreditType('Compra Inteligente')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    creditType === 'Compra Inteligente'
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <div>Compra Inteligente</div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">Renueva cada 2-3 años</div>
                </button>
              </div>
            </div>

            {/* Price Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">Valor del Vehículo (CLP)</label>
                <span className="text-lg font-black text-white">{formatCLP(vehiclePrice)}</span>
              </div>
              <input
                type="range"
                min="6000000"
                max="30000000"
                step="500000"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>$6.000.000</span>
                <span>$30.000.000</span>
              </div>
            </div>

            {/* Down Payment % Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Pie Inicial ({downPercent}%)
                </label>
                <span className="text-sm font-bold text-emerald-400">{formatCLP(downPaymentAmount)}</span>
              </div>
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

            {/* Installments Options */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">Plazo en Cuotas</label>
                <span className="text-sm font-bold text-red-400">{installments} Meses</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[12, 24, 36, 48, 60].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setInstallments(term)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      installments === term
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {term}m
                  </button>
                ))}
              </div>
            </div>

            {/* Results Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Monto a financiar:</span>
                <span className="font-semibold text-white">{formatCLP(loanAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Pie a pagar en efectivo o auto en parte de pago:</span>
                <span className="font-semibold text-emerald-400">{formatCLP(downPaymentAmount)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Cuota mensual estimada</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">{formatCLP(monthlyFee)}</span>
                  <span className="text-xs text-slate-400"> / mes</span>
                </div>
                <span className="text-[11px] text-slate-500">{installments} cuotas fijas</span>
              </div>
            </div>
          </div>

          {/* Right: Pre-approval application form */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">¡Pre-evaluación Enviada!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Hemos recibido tu solicitud de crédito. Uno de nuestros ejecutivos de financiamiento en Valparaíso revisará tu perfil con las financieras y te contactará en menos de 2 horas hábiles.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', rut: '', email: '', phone: '', monthlyIncome: '', employmentType: 'Dependiente' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Simular otra solicitud
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Pre-evaluación Crediticia Rápida
                  </h3>
                </div>

                <p className="text-xs text-slate-400">
                  Sin costo ni compromiso. Respuesta en 2 horas hábiles con certificado de pre-aprobación.
                </p>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Juan Pérez"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">RUT *</label>
                    <input
                      type="text"
                      required
                      value={formData.rut}
                      onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                      placeholder="12.345.678-9"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email de Contacto *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="juan@gmail.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Renta Líquida Mensual (CLP)</label>
                    <input
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                      placeholder="850000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Trabajo</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Dependiente">Empleado Dependiente (Contrato)</option>
                      <option value="Independiente">Independiente (Boletas / IVA)</option>
                      <option value="Empresa">Empresa / Pyme</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluando solicitud...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Solicitar Pre-aprobación Inmediata</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 text-center">
                  Al enviar autorizas a Autoval Automotora a contactarte para gestionar tu financiamiento. Tus datos están protegidos.
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
