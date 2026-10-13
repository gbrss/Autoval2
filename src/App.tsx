import React, { useState, useEffect, useMemo } from 'react';
import { Vehicle, VehicleFilters } from './types/vehicle';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VehicleCatalog } from './components/VehicleCatalog';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { FinancingSection } from './components/FinancingSection';
import { ValuationSection } from './components/ValuationSection';
import { ConsignmentSection } from './components/ConsignmentSection';
import { ServicesSection } from './components/ServicesSection';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { INITIAL_VEHICLES } from './data/initialVehicles';

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [financingVehicle, setFinancingVehicle] = useState<Vehicle | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  // Load vehicles from backend API
  const fetchVehicles = async (currentFilters: VehicleFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.brand) params.append('brand', currentFilters.brand);
      if (currentFilters.minPrice) params.append('minPrice', currentFilters.minPrice.toString());
      if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice.toString());
      if (currentFilters.minYear) params.append('minYear', currentFilters.minYear.toString());
      if (currentFilters.maxYear) params.append('maxYear', currentFilters.maxYear.toString());
      if (currentFilters.transmission) params.append('transmission', currentFilters.transmission);
      if (currentFilters.fuelType) params.append('fuelType', currentFilters.fuelType);
      if (currentFilters.status) params.append('status', currentFilters.status);
      if (currentFilters.sortBy) params.append('sortBy', currentFilters.sortBy);

      const res = await fetch(`/api/vehicles?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setVehicles(json.data);
      }
    } catch (err) {
      console.warn('Backend not responding yet, using local dataset fallback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(filters);
  }, [filters]);

  // Extract unique brands for hero search island
  const availableBrands = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.brand));
    return Array.from(set).sort();
  }, [vehicles]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearch = (newFilters: { brand?: string; category?: string; maxPrice?: number; minYear?: number }) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
    handleNavigate('stock');
  };

  const handleOpenFinancingForVehicle = (vehicle: Vehicle) => {
    setFinancingVehicle(vehicle);
    handleNavigate('financiamiento');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        stockCount={vehicles.length}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero with Astro Island Search */}
        <Hero
          onSearch={handleHeroSearch}
          stockCount={vehicles.length}
          availableBrands={availableBrands}
        />

        {/* Vehicles Catalog & Filters */}
        <VehicleCatalog
          vehicles={vehicles}
          onSelectVehicle={(veh) => setSelectedVehicle(veh)}
          filters={filters}
          onUpdateFilters={setFilters}
        />

        {/* Financing Calculator */}
        <FinancingSection
          selectedVehicle={financingVehicle}
          onClearSelectedVehicle={() => setFinancingVehicle(null)}
        />

        {/* Online Valuation Wizard (Tasa tu Auto en 15 min) */}
        <ValuationSection />

        {/* Consignment Section (Vende con Nosotros) */}
        <ConsignmentSection />

        {/* Autoval Service & Insurance */}
        <ServicesSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Vehicle Inspection Detail Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onOpenFinancingForVehicle={handleOpenFinancingForVehicle}
      />

      {/* PostgreSQL Stock Management Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        vehicles={vehicles}
        onRefreshVehicles={() => fetchVehicles(filters)}
      />

      {/* Floating WhatsApp Contact Button */}
      <WhatsAppButton />
    </div>
  );
}
