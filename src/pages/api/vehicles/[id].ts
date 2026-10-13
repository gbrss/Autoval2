import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { INITIAL_VEHICLES } from '../../../data/initialVehicles';
import type { Vehicle } from '../../../types/vehicle';

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

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  const vehicles = getVehicles();
  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return new Response(JSON.stringify({ success: false, error: 'Vehículo no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true, data: vehicle }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === id);

  if (index === -1) {
    return new Response(JSON.stringify({ success: false, error: 'Vehículo no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await request.json();
  vehicles[index] = { ...vehicles[index], ...body, id };
  saveVehicles(vehicles);

  return new Response(JSON.stringify({ success: true, data: vehicles[index] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  let vehicles = getVehicles();
  const initialLen = vehicles.length;
  vehicles = vehicles.filter(v => v.id !== id);

  if (vehicles.length === initialLen) {
    return new Response(JSON.stringify({ success: false, error: 'Vehículo no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveVehicles(vehicles);
  return new Response(JSON.stringify({ success: true, message: 'Vehículo eliminado con éxito' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
