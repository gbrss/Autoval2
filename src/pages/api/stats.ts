import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { INITIAL_VEHICLES } from '../../data/initialVehicles';
import type { Vehicle, ValuationRequest, FinancingRequest, ConsignmentRequest } from '../../types/vehicle';

export const prerender = false;

const DATA_DIR = path.resolve(process.cwd(), 'data');

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const p = path.join(DATA_DIR, filename);
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (e) {
    console.error(e);
  }
  return fallback;
}

export const GET: APIRoute = async () => {
  try {
    const vehicles = readJsonFile<Vehicle[]>('vehicles.json', INITIAL_VEHICLES);
    const available = vehicles.filter(v => v.status === 'Disponible');
    const reserved = vehicles.filter(v => v.status === 'Reservado');
    const sold = vehicles.filter(v => v.status === 'Vendido');

    const totalValuation = available.reduce((acc, v) => acc + v.price, 0);
    const avgPrice = available.length > 0 ? Math.round(totalValuation / available.length) : 0;

    const brandsMap: Record<string, number> = {};
    vehicles.forEach(v => {
      brandsMap[v.brand] = (brandsMap[v.brand] || 0) + 1;
    });

    const categoriesMap: Record<string, number> = {};
    vehicles.forEach(v => {
      categoriesMap[v.category] = (categoriesMap[v.category] || 0) + 1;
    });

    const valuations = readJsonFile<ValuationRequest[]>('valuations.json', []);
    const financings = readJsonFile<FinancingRequest[]>('financing.json', []);
    const consignments = readJsonFile<ConsignmentRequest[]>('consignments.json', []);

    return new Response(JSON.stringify({
      success: true,
      stats: {
        totalStock: vehicles.length,
        availableCount: available.length,
        reservedCount: reserved.length,
        soldCount: sold.length,
        averagePrice: avgPrice,
        totalInventoryValue: totalValuation,
        brandsBreakdown: brandsMap,
        categoriesBreakdown: categoriesMap,
        leadsCount: valuations.length + financings.length + consignments.length
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Error al calcular estadísticas' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
