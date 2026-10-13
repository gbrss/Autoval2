export type VehicleCategory = 'SUV' | 'Sedán' | 'Hatchback' | 'Camioneta' | 'Comercial';
export type Transmission = 'Manual' | 'Automática';
export type FuelType = 'Bencina' | 'Diésel' | 'Híbrido' | 'Eléctrico';
export type VehicleStatus = 'Disponible' | 'Reservado' | 'Vendido';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number; // in CLP (e.g. 14990000)
  originalPrice?: number; // for discount badge
  mileage: number; // in km
  category: VehicleCategory;
  transmission: Transmission;
  fuelType: FuelType;
  engine: string; // e.g. "1.6L Turbo"
  traction: string; // e.g. "4x2" or "4x4"
  color: string;
  doors: number;
  plateEnding: number; // e.g. 4 (useful for Chilean restriction)
  images: string[];
  featured?: boolean;
  status: VehicleStatus;
  warrantyMonths: number;
  description: string;
  equipment: string[];
  safety: string[];
  comfort: string[];
  createdAt: string;
}

export interface VehicleFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: string;
  fuelType?: string;
  status?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc';
}

export interface ValuationRequest {
  id?: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'Excelente' | 'Bueno' | 'Regular';
  intent: 'Venta Directa' | 'En Parte de Pago' | 'Consignación';
  name: string;
  email: string;
  phone: string;
  region: string;
  estimatedMin?: number;
  estimatedMax?: number;
  createdAt?: string;
}

export interface FinancingRequest {
  id?: string;
  vehicleId?: string;
  vehicleTitle?: string;
  vehiclePrice: number;
  downPaymentPercent: number; // e.g. 20
  downPaymentAmount: number;
  installments: number; // e.g. 36
  type: 'Compra Inteligente' | 'Crédito Convencional';
  monthlyFee: number;
  name: string;
  rut: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  employmentType: 'Dependiente' | 'Independiente' | 'Empresa';
  createdAt?: string;
}

export interface ConsignmentRequest {
  id?: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  expectedPrice: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  notes?: string;
  createdAt?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  vehicleId?: string;
  vehicleTitle?: string;
  createdAt?: string;
}
