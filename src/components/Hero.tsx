import React, { useState } from 'react';
import { Search, Shield, Zap, Sparkles, Award, ArrowRight, Filter } from 'lucide-react';
import { VehicleCategory } from '../types/vehicle';

interface HeroProps {
  onSearch: (filters: { brand?: string; category?: string; maxPrice?: number; minYear?: number }) => void;
  stockCount: number;
  availableBrands: string[];
}

export const Hero: React.FC<HeroProps> = ({ onSearch, stockCount, availableBrands }) => {
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

  const categories: (VehicleCategory | 'Todos')[] = ['Todos', 'SUV', 'Camioneta', 'Hatchback', 'Sedán', 'Comercial'];

  const handleApplySearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      brand: selectedBrand !== 'Todas' ? selectedBrand : undefined,
      category: selectedCategory !== 'Todos' ? selectedCategory : undefined,
      maxPrice: selectedMaxPrice,
      minYear: selectedYear
    });
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white pt-8 pb-16 md:pt-12 md:pb-20 border-b border-slate-800">
      {/* Background glow & mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Seminuevos y Usados Garantizados en la V Región</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              Tu próximo vehículo con la confianza de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">AUTOVAL</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Más de 12 años liderando la automotora en Valparaíso y Viña del Mar. Vehículos multimarca rigurosamente inspeccionados, financiamiento instantáneo y tasación online en minutos.
            </p>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <Shield className="w-5 h-5 text-red-500 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">12 Meses</div>
                  <div className="text-[11px] text-slate-400">Garantía Mecánica</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">En 15 Minutos</div>
                  <div className="text-[11px] text-slate-400">Tasación Online</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Hasta 60 Cuotas</div>
                  <div className="text-[11px] text-slate-400">Crédito a tu Medida</div>
                </div>
              </div>
            </div>
          </div>

          {/* Astro Interactive Search Island (Busca tu auto) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/60 relative">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Buscador de Stock</h2>
                    <p className="text-xs text-slate-400">{stockCount} unidades disponibles hoy</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Valparaíso
                </span>
              </div>

              <form onSubmit={handleApplySearch} className="space-y-4">
                {/* Brand */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Marca</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="Todas">Todas las Marcas (Peugeot, Nissan, Kia...)</option>
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tipo de Carrocería</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Max Price & Min Year */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Precio Máximo</label>
                    <select
                      value={selectedMaxPrice || ''}
                      onChange={(e) => setSelectedMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                    >
                      <option value="">Cualquier Precio</option>
                      <option value="12000000">Hasta $12.000.000</option>
                      <option value="15000000">Hasta $15.000.000</option>
                      <option value="18000000">Hasta $18.000.000</option>
                      <option value="22000000">Hasta $22.000.000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Año Mínimo</label>
                    <select
                      value={selectedYear || ''}
                      onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                    >
                      <option value="">Cualquier Año</option>
                      <option value="2021">Desde 2021</option>
                      <option value="2022">Desde 2022</option>
                      <option value="2023">Desde 2023</option>
                    </select>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtrar Inventario</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
