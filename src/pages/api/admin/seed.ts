import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { INITIAL_VEHICLES } from '../../../data/initialVehicles';

export const prerender = false;

const DATA_DIR = path.resolve(process.cwd(), 'data');
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');

export const POST: APIRoute = async () => {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(VEHICLES_FILE, JSON.stringify(INITIAL_VEHICLES, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, message: 'Stock reinicializado con los datos oficiales de Autoval' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Error al reiniciar datos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
