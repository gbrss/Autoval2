import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import type { ConsignmentRequest } from '../../types/vehicle';

export const prerender = false;

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CONSIGNMENTS_FILE = path.join(DATA_DIR, 'consignments.json');

function getConsignments(): ConsignmentRequest[] {
  try {
    if (fs.existsSync(CONSIGNMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(CONSIGNMENTS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveConsignments(data: ConsignmentRequest[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CONSIGNMENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(e);
  }
}

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ success: true, data: getConsignments() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: ConsignmentRequest = await request.json();
    const newConsignment: ConsignmentRequest = {
      ...body,
      id: `con-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const list = getConsignments();
    list.unshift(newConsignment);
    saveConsignments(list);

    return new Response(JSON.stringify({
      success: true,
      data: newConsignment,
      message: 'Solicitud de consignación recibida'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Error al guardar consignación' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
