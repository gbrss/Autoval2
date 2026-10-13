import React, { useState, useMemo } from 'react';
import { Vehicle, VehicleCategory, VehicleFilters } from '../types/vehicle';
import { VehicleCard } from './VehicleCard';
import { Search, SlidersHorizontal, LayoutGrid, List, RotateCcw, Car } from 'lucide-react';

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  filters: VehicleFilters;
  onUpdateFilters: (filters: VehicleFilters) => void;
}

export const VehicleCatalog: React.FC<VehicleCatalogProps> = ({
  vehicles,
  onSelectVehicle,
  filters,
  onUpdateFilters
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories: (VehicleCategory | 'Todos')[] = ['Todos', 'SUV', 'Camioneta', 'Hatchback', 'Sedán', 'Comercial'];

  // Extract unique brands from inventory
  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set(vehicles.map((v) => v.brand));
    return Array.from(brandsSet).sort();
  }, [vehicles]);

  const handleCategoryClick = (cat: string) => {
    onUpdateFilters({
      ...filters,
      category: cat === 'Todos' ? undefined : cat
    });
  };

  const handleBrandClick = (brand: string) => {
    onUpdateFilters({
      ...filters,
      brand: brand === 'Todas' ? undefined : brand
    });
  };

  const handleResetFilters = () => {
    onUpdateFilters({});
  };

  const activeFiltersCount = [
    filters.search,
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.minYear,
    filters.transmission,
    filters.fuelType,
    filters.status
  ].filter(Boolean).length;

  return (
    <section id="stock" className="py-12 bg-slate-950 text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-red-500 font-semibold text-xs tracking-wider uppercase mb-1">
              <Car className="w-4 h-4" />
              <span>Inventario Disponible en Valparaíso</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              Stock de Vehículos Seleccionados
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Todos nuestros autos cuentan con certificación técnica, informe Autofact al día y garantía mecánica.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* View Mode Toggle */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Vista Cuadrícula"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Vista Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? 'bg-red-600/20 text-red-400 border-red-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-4">
          {categories.map((cat) => {
            const isSelected = (!filters.category && cat === 'Todos') || filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Brand Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 scrollbar-none mb-6">
          <button
            onClick={() => handleBrandClick('Todas')}
            className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
              !filters.brand ? 'bg-slate-200 text-slate-900 font-bold' : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas las Marcas
          </button>
          {uniqueBrands.map((b) => {
            const isSelected = filters.brand === b;
            return (
              <button
                key={b}
                onClick={() => handleBrandClick(b)}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-8 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Search text */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Búsqueda directa</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={filters.search || ''}
                    onChange={(e) => onUpdateFilters({ ...filters, search: e.target.value })}
                    placeholder="Ej: 208, Kicks, 4x4, Diésel..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Transmisión</label>
                <select
                  value={filters.transmission || 'Todas'}
                  onChange={(e) => onUpdateFilters({ ...filters, transmission: e.target.value === 'Todas' ? undefined : e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Todas">Cualquiera (Manual o Automática)</option>
                  <option value="Manual">Manual</option>
                  <option value="Automática">Automática</option>
                </select>
              </div>

              {/* Fuel */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Combustible</label>
                <select
                  value={filters.fuelType || 'Todos'}
                  onChange={(e) => onUpdateFilters({ ...filters, fuelType: e.target.value === 'Todos' ? undefined : e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Todos">Todos (Bencina, Diésel, Híbrido)</option>
                  <option value="Bencina">Bencina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              {/* Sort by */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ordenar por</label>
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => onUpdateFilters({ ...filters, sortBy: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Destacados & Recientes</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="year-desc">Año: Más Nuevo</option>
                  <option value="mileage-asc">Kilometraje: Menor a Mayor</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Filtros aplicados: <strong className="text-white">{activeFiltersCount}</strong>
              </span>

              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Filtros</span>
              </button>
            </div>
          </div>
        )}

        {/* Results Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span>
            Mostrando <strong className="text-white font-bold">{vehicles.length}</strong> vehículos
            {filters.category && ` en ${filters.category}`}
            {filters.brand && ` · ${filters.brand}`}
          </span>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Vehicle Grid / List */}
        {vehicles.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onSelect={onSelectVehicle}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No se encontraron vehículos</h3>
            <p className="text-sm text-slate-400 mb-6">
              No hay unidades que coincidan exactamente con los filtros seleccionados. Intenta ampliar tu búsqueda o restablecer los filtros.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30"
            >
              Ver Todo el Stock Disponible
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
