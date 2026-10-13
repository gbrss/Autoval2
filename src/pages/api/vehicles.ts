import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { INITIAL_VEHICLES } from '../../data/initialVehicles';
import type { Vehicle } from '../../types/vehicle';

export const prerender = false;

const DATA_DIR = path.resolve(process.cwd(), 'data');
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');

function getVehicles(): Vehicle[] {
  try {
    if (fs.existsSync(VEHICLES_FILE)) {
      return JSON.parse(fs.readFileSync(VEHICLES_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_VEHICLES;
}

function saveVehicles(data: Vehicle[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(VEHICLES_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(e);
  }
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  let vehicles = getVehicles();

  const search = url.searchParams.get('search');
  const category = url.searchParams.get('category');
  const brand = url.searchParams.get('brand');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const minYear = url.searchParams.get('minYear');
  const maxYear = url.searchParams.get('maxYear');
  const transmission = url.searchParams.get('transmission');
  const fuelType = url.searchParams.get('fuelType');
  const status = url.searchParams.get('status');
  const sortBy = url.searchParams.get('sortBy');

  if (search) {
    const q = search.toLowerCase().trim();
    vehicles = vehicles.filter(v =>
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.version.toLowerCase().includes(q) ||
      v.year.toString().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'Todos') {
    vehicles = vehicles.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }

  if (brand && brand !== 'Todas') {
    vehicles = vehicles.filter(v => v.brand.toLowerCase() === brand.toLowerCase());
  }

  if (transmission && transmission !== 'Todas') {
    vehicles = vehicles.filter(v => v.transmission.toLowerCase() === transmission.toLowerCase());
  }

  if (fuelType && fuelType !== 'Todos') {
    vehicles = vehicles.filter(v => v.fuelType.toLowerCase() === fuelType.toLowerCase());
  }

  if (status && status !== 'Todos') {
    vehicles = vehicles.filter(v => v.status.toLowerCase() === status.toLowerCase());
  }

  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) vehicles = vehicles.filter(v => v.price >= min);
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) vehicles = vehicles.filter(v => v.price <= max);
  }

  if (minYear) {
    const y = Number(minYear);
    if (!isNaN(y)) vehicles = vehicles.filter(v => v.year >= y);
  }

  if (maxYear) {
    const y = Number(maxYear);
    if (!isNaN(y)) vehicles = vehicles.filter(v => v.year <= y);
  }

  if (sortBy === 'price-asc') {
    vehicles.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    vehicles.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'year-desc') {
    vehicles.sort((a, b) => b.year - a.year);
  } else if (sortBy === 'mileage-asc') {
    vehicles.sort((a, b) => a.mileage - b.mileage);
  } else {
    vehicles.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.year - a.year);
  }

  return new Response(JSON.stringify({ success: true, total: vehicles.length, data: vehicles }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const vehicles = getVehicles();

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      brand: body.brand,
      model: body.model,
      version: body.version || 'Estándar',
      year: Number(body.year),
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      mileage: Number(body.mileage) || 0,
      category: body.category || 'SUV',
      transmission: body.transmission || 'Manual',
      fuelType: body.fuelType || 'Bencina',
      engine: body.engine || '1.6L',
      traction: body.traction || '4x2',
      color: body.color || 'Blanco',
      doors: Number(body.doors) || 5,
      plateEnding: Number(body.plateEnding) || 0,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
      ],
      featured: Boolean(body.featured),
      status: body.status || 'Disponible',
      warrantyMonths: Number(body.warrantyMonths) || 12,
      description: body.description || 'Vehículo seleccionado garantizado por Autoval.',
      equipment: Array.isArray(body.equipment) ? body.equipment : ['Aire Acondicionado', 'Radio Touch'],
      safety: Array.isArray(body.safety) ? body.safety : ['Airbags frontales', 'Frenos ABS'],
      comfort: Array.isArray(body.comfort) ? body.comfort : ['Cierre Centralizado'],
      createdAt: new Date().toISOString()
    };

    vehicles.unshift(newVehicle);
    saveVehicles(vehicles);

    return new Response(JSON.stringify({ success: true, data: newVehicle }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Error al crear vehículo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
