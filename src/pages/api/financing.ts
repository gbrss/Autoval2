import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import type { FinancingRequest } from '../../types/vehicle';

export const prerender = false;

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FINANCING_FILE = path.join(DATA_DIR, 'financing.json');

function getFinancings(): FinancingRequest[] {
  try {
    if (fs.existsSync(FINANCING_FILE)) {
      return JSON.parse(fs.readFileSync(FINANCING_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveFinancings(data: FinancingRequest[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FINANCING_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(e);
  }
}

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ success: true, data: getFinancings() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: FinancingRequest = await request.json();
    const price = Number(body.vehiclePrice) || 12000000;
    const downPercent = Number(body.downPaymentPercent) || 20;
    const downAmount = Math.round((price * downPercent) / 100);
    const loanAmount = price - downAmount;
    const installments = Number(body.installments) || 36;
    
    const monthlyRate = 0.0135;
    const monthlyFee = Math.round(
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, installments))) /
      (Math.pow(1 + monthlyRate, installments) - 1)
    );

    const financingApp: FinancingRequest = {
      ...body,
      id: `fin-${Date.now()}`,
      downPaymentAmount: downAmount,
      monthlyFee: monthlyFee,
      createdAt: new Date().toISOString()
    };

    const list = getFinancings();
    list.unshift(financingApp);
    saveFinancings(list);

    return new Response(JSON.stringify({
      success: true,
      data: financingApp,
      message: 'Solicitud de financiamiento ingresada con éxito'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Error al procesar financiamiento' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
