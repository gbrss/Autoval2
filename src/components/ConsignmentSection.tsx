import React, { useState } from 'react';
import { Camera, Shield, FileText, CheckCircle2, Send, Loader2, Award } from 'lucide-react';

export const ConsignmentSection: React.FC = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: 2022,
    mileage: 40000,
    expectedPrice: '',
    name: '',
    email: '',
    phone: '',
    city: 'Valparaíso',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.brand || !formData.model || !formData.name || !formData.phone) {
      setErrorMsg('Por favor completa los campos principales de tu vehículo.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/consignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expectedPrice: Number(formData.expectedPrice) || 0
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
    <section id="consignacion" className="py-16 bg-slate-900 text-white border-b border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Benefits & Trust */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Consignación Premium Autoval</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Vende tu auto sin riesgos, al mejor precio del mercado.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Evita recibir extraños en tu casa o arriesgarte a fraudes con transferencias bancarias. En Autoval nos encargamos de todo el proceso de venta mientras tú mantienes el control.
            </p>

            {/* 4 Pillars of Consignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="p-2 rounded-xl bg-red-600/20 text-red-400 w-fit">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">100% Seguro</h3>
                <p className="text-xs text-slate-400">
                  Protegemos tu identidad y seguridad. Tu auto se exhibe en nuestro showroom con vigilancia 24/7.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 w-fit">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Fotografía & Marketing</h3>
                <p className="text-xs text-slate-400">
                  Sesión fotográfica en alta resolución y publicación destacada en Chileautos, redes sociales y web.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 w-fit">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Gestión Legal Completa</h3>
                <p className="text-xs text-slate-400">
                  Nos encargamos del contrato de compraventa, Autofact, transferencia notarial e inscripción en el Registro Civil.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 w-fit">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Ofrecemos Crédito</h3>
                <p className="text-xs text-slate-400">
                  Podemos financiar tu auto al comprador final, multiplicando por 4 las probabilidades de venta rápida.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Intake Form */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">¡Solicitud de Consignación Recibida!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Uno de nuestros ejecutivos de consignación te contactará para agendar la sesión de fotos e inspección técnica en nuestro local de Valparaíso.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        brand: '',
                        model: '',
                        year: 2022,
                        mileage: 40000,
                        expectedPrice: '',
                        name: '',
                        email: '',
                        phone: '',
                        city: 'Valparaíso',
                        notes: ''
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer"
                  >
                    Ingresar otro vehículo
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Ingresar Auto a Consignación
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Completa la ficha y coordinamos la publicación.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Marca *</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Ej: Peugeot, Nissan, Kia"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Modelo *</label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="Ej: 208, Sportage, L200"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Año</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Kilometraje (Km)</label>
                    <input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Precio Esperado (CLP)</label>
                    <input
                      type="number"
                      value={formData.expectedPrice}
                      onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                      placeholder="12500000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+56 9 8253 776"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@ejemplo.cl"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Detalles o equipamiento especial</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Único dueño, mantenciones timbradas, láminas de seguridad..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando solicitud...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Postular mi Auto a Consignación</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
