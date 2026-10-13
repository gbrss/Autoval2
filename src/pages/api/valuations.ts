import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import type { ValuationRequest } from '../../types/vehicle';

export const prerender = false;

const DATA_DIR = path.resolve(process.cwd(), 'data');
const VALUATIONS_FILE = path.join(DATA_DIR, 'valuations.json');

function getValuations(): ValuationRequest[] {
  try {
    if (fs.existsSync(VALUATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(VALUATIONS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveValuations(data: ValuationRequest[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(VALUATIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(e);
  }
}

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ success: true, data: getValuations() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: ValuationRequest = await request.json();
    const year = Number(body.year) || 2020;
    const mileage = Number(body.mileage) || 50000;
    
    const currentYear = 2025;
    const age = Math.max(0, currentYear - year);
    let baseRef = 16000000;
    
    const brandLower = (body.brand || '').toLowerCase();
    if (brandLower.includes('toyota') || brandLower.includes('honda')) baseRef = 19000000;
    else if (brandLower.includes('peugeot') || brandLower.includes('kia') || brandLower.includes('nissan') || brandLower.includes('hyundai') || brandLower.includes('mitsubishi')) baseRef = 17000000;
    else if (brandLower.includes('suzuki') || brandLower.includes('chevrolet')) baseRef = 14000000;
    else if (brandLower.includes('chery') || brandLower.includes('mg') || brandLower.includes('jac')) baseRef = 13500000;

    let factor = 1.0;
    for (let i = 0; i < age; i++) {
      factor *= (i === 0 ? 0.88 : 0.92);
    }

    const normalKm = age * 15000;
    const kmDiff = mileage - normalKm;
    if (kmDiff > 0) factor *= (1 - Math.min(0.2, (kmDiff / 100000) * 0.1));
    else factor *= (1 + Math.min(0.08, Math.abs(kmDiff / 100000) * 0.05));

    if (body.condition === 'Excelente') factor *= 1.05;
    else if (body.condition === 'Regular') factor *= 0.88;

    const estimatedCenter = Math.round((baseRef * factor) / 50000) * 50000;
    const estimatedMin = Math.round((estimatedCenter * 0.93) / 50000) * 50000;
    const estimatedMax = Math.round((estimatedCenter * 1.06) / 50000) * 50000;

    const newRequest: ValuationRequest = {
      ...body,
      id: `val-${Date.now()}`,
      estimatedMin,
      estimatedMax,
      createdAt: new Date().toISOString()
    };

    const list = getValuations();
    list.unshift(newRequest);
    saveValuations(list);

    return new Response(JSON.stringify({
      success: true,
      data: newRequest,
      message: 'Tasación calculada y solicitud ingresada con éxito'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Error al procesar tasación' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
