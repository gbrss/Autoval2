import React, { useState } from 'react';
import { formatCLP, buildWhatsAppLink } from '../utils/formatters';
import { ValuationRequest } from '../types/vehicle';
import { Zap, CheckCircle2, ArrowRight, ShieldCheck, MessageCircle, Loader2, Sparkles } from 'lucide-react';

export const ValuationSection: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationRequest | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    brand: 'Peugeot',
    model: '208',
    year: 2022,
    mileage: 35000,
    condition: 'Bueno' as 'Excelente' | 'Bueno' | 'Regular',
    intent: 'En Parte de Pago' as 'Venta Directa' | 'En Parte de Pago' | 'Consignación',
    name: '',
    email: '',
    phone: '',
    region: 'Valparaíso / Viña del Mar'
  });

  const popularBrands = ['Peugeot', 'Nissan', 'Kia', 'Mitsubishi', 'Chery', 'Toyota', 'Hyundai', 'Suzuki', 'Chevrolet', 'Volkswagen', 'Ford'];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.brand || !formData.model || !formData.year) {
        setErrorMsg('Ingresa la información básica de tu auto.');
        return;
      }
      setErrorMsg('');
      setStep(2);
    } else if (step === 2) {
      setErrorMsg('');
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Por favor ingresa tu nombre, email y teléfono para enviarte la tasación.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/valuations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const res = await response.json();
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res.error || 'No se pudo procesar la tasación.');
      }
    } catch (err) {
      setErrorMsg('Error al conectar con el tasador.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStep(1);
    setFormData({
      brand: 'Peugeot',
      model: '208',
      year: 2022,
      mileage: 35000,
      condition: 'Bueno',
      intent: 'En Parte de Pago',
      name: '',
      email: '',
      phone: '',
      region: 'Valparaíso / Viña del Mar'
    });
  };

  return (
    <section id="tasacion" className="py-16 bg-slate-950 text-white border-b border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Servicio Oficial Autoval Valparaíso</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tasa tu Auto en 15 Minutos (100% Gratis)
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Obtén una estimación de mercado inmediata según la base de datos de transferencias de la V Región. Lo compramos al contado o lo recibimos en parte de pago.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Progress Indicator */}
          {!result && (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
              {[
                { s: 1, label: 'Datos del Auto' },
                { s: 2, label: 'Estado & Destino' },
                { s: 3, label: 'Contacto' },
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === item.s
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : step > item.s
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step > item.s ? '✓' : item.s}
                  </div>
                  <span className={`text-xs hidden sm:inline ${step >= item.s ? 'text-white font-medium' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Vehicle info */}
          {!result && step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Marca del Vehículo</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                  {popularBrands.slice(0, 8).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, brand: b })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        formData.brand === b
                          ? 'bg-red-600 text-white border-red-500 font-bold'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Otra marca..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Modelo</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ej: 208, Kicks, Tucson, Swift..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Año de Fabricación</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kilometraje Aproximado</label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                  placeholder="35000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Continuar al Paso 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Condition & Intent */}
          {!result && step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Estado General del Vehículo</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Excelente', 'Bueno', 'Regular'] as const).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: cond })}
                      className={`p-3 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                        formData.condition === cond
                          ? 'bg-red-600 text-white border-red-500 font-bold shadow-md shadow-red-600/20'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <div>{cond}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">
                        {cond === 'Excelente' ? 'Como nuevo' : cond === 'Bueno' ? 'Detalles menores' : 'Desgaste normal'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">¿Qué deseas hacer?</label>
                <div className="space-y-2">
                  {([
                    { id: 'En Parte de Pago', desc: 'Deseo dejarlo en parte de pago por otro auto de Autoval' },
                    { id: 'Venta Directa', desc: 'Quiero venderlo rápido y recibir transferencia al contado' },
                    { id: 'Consignación', desc: 'Quiero que Autoval lo venda al mejor precio en consignación' },
                  ] as const).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, intent: item.id })}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${
                        formData.intent === item.id
                          ? 'bg-red-950/60 text-white border-red-500 font-semibold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                        formData.intent === item.id ? 'border-red-500 bg-red-600' : 'border-slate-700'
                      }`}>
                        {formData.intent === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-white">{item.id}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar al Paso 3</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Contact info to calculate & submit */}
          {!result && step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre y apellido"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+56 9 1234 5678"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad o Comuna</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="Valparaíso / Viña del Mar / Quilpué..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Calculando valor de mercado...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Calcular Tasación Inmediata</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* RESULT STATE: Instant Chilean valuation output */}
          {result && (
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Resultado de Tasación para {result.brand} {result.model} ({result.year})
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Rango Estimado de Mercado:
                </h3>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 max-w-lg mx-auto">
                <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  {formatCLP(result.estimatedMin || 11000000)} - {formatCLP(result.estimatedMax || 12500000)}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Valor estimado según historial de ventas en la V Región para estado <strong>{result.condition}</strong>.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={buildWhatsAppLink(
                    '5698253776',
                    `Hola Autoval! Hice la tasación de mi ${result.brand} ${result.model} ${result.year} (estimado entre ${formatCLP(result.estimatedMin || 0)} y ${formatCLP(result.estimatedMax || 0)}). Deseo coordinar la inspección presencial en Valparaíso.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar Oferta por WhatsApp</span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Tasar otro vehículo
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>La oferta final se ratifica tras la inspección física en nuestro showroom de Valparaíso.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
