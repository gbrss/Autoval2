import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { INITIAL_VEHICLES } from './src/data/initialVehicles.ts';
import { Vehicle, ValuationRequest, FinancingRequest, ConsignmentRequest, ContactMessage } from './src/types/vehicle.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');
const VALUATIONS_FILE = path.join(DATA_DIR, 'valuations.json');
const FINANCING_FILE = path.join(DATA_DIR, 'financing.json');
const CONSIGNMENTS_FILE = path.join(DATA_DIR, 'consignments.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// Helper functions for JSON persistence
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initialize vehicles store
if (!fs.existsSync(VEHICLES_FILE)) {
  writeJsonFile(VEHICLES_FILE, INITIAL_VEHICLES);
}

// ----------------- API ROUTES ----------------- //

// GET /api/vehicles - List & filter vehicles
app.get('/api/vehicles', (req: Request, res: Response) => {
  try {
    let vehicles = readJsonFile<Vehicle[]>(VEHICLES_FILE, INITIAL_VEHICLES);
    const { search, category, brand, minPrice, maxPrice, minYear, maxYear, transmission, fuelType, status, sortBy } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      vehicles = vehicles.filter(v =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.version.toLowerCase().includes(q) ||
        v.year.toString().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === 'string' && category !== 'Todos') {
      vehicles = vehicles.filter(v => v.category.toLowerCase() === category.toLowerCase());
    }

    if (brand && typeof brand === 'string' && brand !== 'Todas') {
      vehicles = vehicles.filter(v => v.brand.toLowerCase() === brand.toLowerCase());
    }

    if (transmission && typeof transmission === 'string' && transmission !== 'Todas') {
      vehicles = vehicles.filter(v => v.transmission.toLowerCase() === transmission.toLowerCase());
    }

    if (fuelType && typeof fuelType === 'string' && fuelType !== 'Todos') {
      vehicles = vehicles.filter(v => v.fuelType.toLowerCase() === fuelType.toLowerCase());
    }

    if (status && typeof status === 'string' && status !== 'Todos') {
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

    // Sorting
    if (sortBy === 'price-asc') {
      vehicles.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      vehicles.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year-desc') {
      vehicles.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'mileage-asc') {
      vehicles.sort((a, b) => a.mileage - b.mileage);
    } else {
      // Default: featured first, then newest
      vehicles.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.year - a.year);
    }

    res.json({
      success: true,
      total: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ success: false, error: 'Error al obtener vehículos' });
  }
});

// GET /api/vehicles/:id - Single vehicle
app.get('/api/vehicles/:id', (req: Request, res: Response) => {
  try {
    const vehicles = readJsonFile<Vehicle[]>(VEHICLES_FILE, INITIAL_VEHICLES);
    const vehicle = vehicles.find(v => v.id === req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehículo no encontrado' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener el vehículo' });
  }
});

// POST /api/vehicles - Add new vehicle (Admin)
app.post('/api/vehicles', (req: Request, res: Response) => {
  try {
    const vehicles = readJsonFile<Vehicle[]>(VEHICLES_FILE, INITIAL_VEHICLES);
    const body = req.body;

    if (!body.brand || !body.model || !body.price || !body.year) {
      return res.status(400).json({ success: false, error: 'Marca, modelo, precio y año son requeridos' });
    }

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
      equipment: Array.isArray(body.equipment) ? body.equipment : ['Aire Acondicionado', 'Radio Touch', 'Cierre Centralizado'],
      safety: Array.isArray(body.safety) ? body.safety : ['Airbags frontales', 'Frenos ABS', 'Control de Estabilidad'],
      comfort: Array.isArray(body.comfort) ? body.comfort : ['Alzavidrios eléctricos', 'Espejos eléctricos'],
      createdAt: new Date().toISOString()
    };

    vehicles.unshift(newVehicle);
    writeJsonFile(VEHICLES_FILE, vehicles);

    res.status(201).json({ success: true, data: newVehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ success: false, error: 'Error al crear el vehículo' });
  }
});

// PUT /api/vehicles/:id - Update vehicle (Admin)
app.put('/api/vehicles/:id', (req: Request, res: Response) => {
  try {
    const vehicles = readJsonFile<Vehicle[]>(VEHICLES_FILE, INITIAL_VEHICLES);
    const index = vehicles.findIndex(v => v.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Vehículo no encontrado' });
    }

    const updated = {
      ...vehicles[index],
      ...req.body,
      id: req.params.id // prevent altering ID
    };

    vehicles[index] = updated;
    writeJsonFile(VEHICLES_FILE, vehicles);

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar vehículo' });
  }
});

// DELETE /api/vehicles/:id - Delete vehicle (Admin)
app.delete('/api/vehicles/:id', (req: Request, res: Response) => {
  try {
    let vehicles = readJsonFile<Vehicle[]>(VEHICLES_FILE, INITIAL_VEHICLES);
    const initialLen = vehicles.length;
    vehicles = vehicles.filter(v => v.id !== req.params.id);

    if (vehicles.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Vehículo no encontrado' });
    }

    writeJsonFile(VEHICLES_FILE, vehicles);
    res.json({ success: true, message: 'Vehículo eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar vehículo' });
  }
});

// POST /api/valuations - Free Online Car Valuation
app.post('/api/valuations', (req: Request, res: Response) => {
  try {
    const body: ValuationRequest = req.body;
    const year = Number(body.year) || 2020;
    const mileage = Number(body.mileage) || 50000;
    
    // Algorithmic Chilean used car market valuation estimate
    const currentYear = 2025;
    const age = Math.max(0, currentYear - year);
    let baseRef = 16000000; // Average base reference
    
    // Adjust by brand tier
    const brandLower = (body.brand || '').toLowerCase();
    if (brandLower.includes('toyota') || brandLower.includes('honda')) baseRef = 19000000;
    else if (brandLower.includes('peugeot') || brandLower.includes('kia') || brandLower.includes('nissan') || brandLower.includes('hyundai') || brandLower.includes('mitsubishi')) baseRef = 17000000;
    else if (brandLower.includes('suzuki') || brandLower.includes('chevrolet')) baseRef = 14000000;
    else if (brandLower.includes('chery') || brandLower.includes('mg') || brandLower.includes('jac')) baseRef = 13500000;

    // Depreciation: 10% first year, 7% subsequent years
    let factor = 1.0;
    for (let i = 0; i < age; i++) {
      factor *= (i === 0 ? 0.88 : 0.92);
    }

    // Mileage adjustment (-1% per 15k km over normal)
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

    const valuations = readJsonFile<ValuationRequest[]>(VALUATIONS_FILE, []);
    valuations.unshift(newRequest);
    writeJsonFile(VALUATIONS_FILE, valuations);

    res.json({
      success: true,
      data: newRequest,
      message: 'Tasación calculada y solicitud ingresada con éxito'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al procesar la tasación' });
  }
});

// GET /api/valuations - List valuations for admin
app.get('/api/valuations', (_req: Request, res: Response) => {
  const valuations = readJsonFile<ValuationRequest[]>(VALUATIONS_FILE, []);
  res.json({ success: true, data: valuations });
});

// POST /api/financing - Submit financing pre-evaluation
app.post('/api/financing', (req: Request, res: Response) => {
  try {
    const body: FinancingRequest = req.body;
    const price = Number(body.vehiclePrice) || 12000000;
    const downPercent = Number(body.downPaymentPercent) || 20;
    const downAmount = Math.round((price * downPercent) / 100);
    const loanAmount = price - downAmount;
    const installments = Number(body.installments) || 36;
    
    // Monthly rate approx 1.35% for Chilean automotive credits
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

    const financings = readJsonFile<FinancingRequest[]>(FINANCING_FILE, []);
    financings.unshift(financingApp);
    writeJsonFile(FINANCING_FILE, financings);

    res.json({
      success: true,
      data: financingApp,
      message: 'Solicitud de financiamiento ingresada con éxito. Un ejecutivo te contactará en breve.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al procesar financiamiento' });
  }
});

// GET /api/financing - List financing applications
app.get('/api/financing', (_req: Request, res: Response) => {
  const financings = readJsonFile<FinancingRequest[]>(FINANCING_FILE, []);
  res.json({ success: true, data: financings });
});

// POST /api/consignments - Submit consignment request
app.post('/api/consignments', (req: Request, res: Response) => {
  try {
    const body: ConsignmentRequest = req.body;
    const newConsignment: ConsignmentRequest = {
      ...body,
      id: `con-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const consignments = readJsonFile<ConsignmentRequest[]>(CONSIGNMENTS_FILE, []);
    consignments.unshift(newConsignment);
    writeJsonFile(CONSIGNMENTS_FILE, consignments);

    res.json({
      success: true,
      data: newConsignment,
      message: 'Solicitud de consignación recibida. Agendaremos la sesión fotográfica e inspección técnica.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al guardar consignación' });
  }
});

// GET /api/consignments - List consignments
app.get('/api/consignments', (_req: Request, res: Response) => {
  const consignments = readJsonFile<ConsignmentRequest[]>(CONSIGNMENTS_FILE, []);
  res.json({ success: true, data: consignments });
});

// POST /api/contact - Submit general contact lead
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const body: ContactMessage = req.body;
    const newLead: ContactMessage = {
      ...body,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const leads = readJsonFile<ContactMessage[]>(LEADS_FILE, []);
    leads.unshift(newLead);
    writeJsonFile(LEADS_FILE, leads);

    res.json({
      success: true,
      data: newLead,
      message: 'Mensaje recibido en Autoval. Nos pondremos en contacto contigo a la brevedad.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al enviar mensaje' });
  }
});

// GET /api/stats - Stock and business metrics
app.get('/api/stats', (_req: Request, res: Response) => {
  try {
    const vehicles = readJsonFile<Vehicle[]>(VEHICLES_FILE, INITIAL_VEHICLES);
    const available = vehicles.filter(v => v.status === 'Disponible');
    const reserved = vehicles.filter(v => v.status === 'Reservado');
    const sold = vehicles.filter(v => v.status === 'Vendido');

    const totalValuation = available.reduce((acc, v) => acc + v.price, 0);
    const avgPrice = available.length > 0 ? Math.round(totalValuation / available.length) : 0;

    // Brands tally
    const brandsMap: Record<string, number> = {};
    vehicles.forEach(v => {
      brandsMap[v.brand] = (brandsMap[v.brand] || 0) + 1;
    });

    // Categories tally
    const categoriesMap: Record<string, number> = {};
    vehicles.forEach(v => {
      categoriesMap[v.category] = (categoriesMap[v.category] || 0) + 1;
    });

    const valuations = readJsonFile<ValuationRequest[]>(VALUATIONS_FILE, []);
    const financings = readJsonFile<FinancingRequest[]>(FINANCING_FILE, []);
    const consignments = readJsonFile<ConsignmentRequest[]>(CONSIGNMENTS_FILE, []);

    res.json({
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
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al calcular estadísticas' });
  }
});

// GET /api/admin/sql-schema - Generate full PostgreSQL DDL and DML dump
app.get('/api/admin/sql-schema', (_req: Request, res: Response) => {
  try {
    const vehicles = readJsonFile<Vehicle[]>(VEHICLES_FILE, INITIAL_VEHICLES);

    let sql = `-- ========================================================
-- AUTOVAL AUTOMOTORA VALPARAÍSO - POSTGRESQL DATABASE SCHEMA
-- Compatible with PostgreSQL 14, 15, 16 & Cloud SQL
-- ========================================================

-- 1. Create ENUM types
DO $$ BEGIN
    CREATE TYPE vehicle_category AS ENUM ('SUV', 'Sedán', 'Hatchback', 'Camioneta', 'Comercial');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_transmission AS ENUM ('Manual', 'Automática');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_fuel AS ENUM ('Bencina', 'Diésel', 'Híbrido', 'Eléctrico');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_status AS ENUM ('Disponible', 'Reservado', 'Vendido');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Vehicles Table
CREATE TABLE IF NOT EXISTS autoval_vehicles (
    id VARCHAR(64) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    version VARCHAR(150) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1990 AND year <= 2030),
    price NUMERIC(12, 0) NOT NULL CHECK (price > 0),
    original_price NUMERIC(12, 0),
    mileage INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
    category vehicle_category NOT NULL,
    transmission vehicle_transmission NOT NULL,
    fuel_type vehicle_fuel NOT NULL,
    engine VARCHAR(100) NOT NULL,
    traction VARCHAR(50) NOT NULL DEFAULT '4x2',
    color VARCHAR(50) NOT NULL,
    doors INTEGER NOT NULL DEFAULT 5,
    plate_ending INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    status vehicle_status NOT NULL DEFAULT 'Disponible',
    warranty_months INTEGER NOT NULL DEFAULT 12,
    description TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    equipment JSONB NOT NULL DEFAULT '[]'::jsonb,
    safety JSONB NOT NULL DEFAULT '[]'::jsonb,
    comfort JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_autoval_vehicles_brand ON autoval_vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_autoval_vehicles_category ON autoval_vehicles(category);
CREATE INDEX IF NOT EXISTS idx_autoval_vehicles_price ON autoval_vehicles(price);
CREATE INDEX IF NOT EXISTS idx_autoval_vehicles_year ON autoval_vehicles(year);
CREATE INDEX IF NOT EXISTS idx_autoval_vehicles_status ON autoval_vehicles(status);

-- 4. Create Leads / Valuations Table
CREATE TABLE IF NOT EXISTS autoval_valuations (
    id VARCHAR(64) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    condition VARCHAR(50) NOT NULL,
    intent VARCHAR(50) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    region VARCHAR(100) NOT NULL,
    estimated_min NUMERIC(12, 0),
    estimated_max NUMERIC(12, 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Financing Applications Table
CREATE TABLE IF NOT EXISTS autoval_financing_requests (
    id VARCHAR(64) PRIMARY KEY,
    vehicle_id VARCHAR(64) REFERENCES autoval_vehicles(id) ON DELETE SET NULL,
    vehicle_title VARCHAR(200),
    vehicle_price NUMERIC(12, 0) NOT NULL,
    down_payment_percent NUMERIC(5, 2) NOT NULL,
    down_payment_amount NUMERIC(12, 0) NOT NULL,
    installments INTEGER NOT NULL,
    credit_type VARCHAR(50) NOT NULL,
    monthly_fee NUMERIC(12, 0) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_rut VARCHAR(30) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    monthly_income NUMERIC(12, 0) NOT NULL,
    employment_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- INSERT SEED DATA (${vehicles.length} VEHICLES)
-- ========================================================
`;

    vehicles.forEach(v => {
      const escape = (str: string) => str.replace(/'/g, "''");
      const imagesJson = JSON.stringify(v.images).replace(/'/g, "''");
      const eqJson = JSON.stringify(v.equipment).replace(/'/g, "''");
      const safeJson = JSON.stringify(v.safety).replace(/'/g, "''");
      const comfJson = JSON.stringify(v.comfort).replace(/'/g, "''");

      sql += `
INSERT INTO autoval_vehicles (
    id, brand, model, version, year, price, original_price, mileage,
    category, transmission, fuel_type, engine, traction, color, doors,
    plate_ending, featured, status, warranty_months, description,
    images, equipment, safety, comfort, created_at
) VALUES (
    '${escape(v.id)}',
    '${escape(v.brand)}',
    '${escape(v.model)}',
    '${escape(v.version)}',
    ${v.year},
    ${v.price},
    ${v.originalPrice ? v.originalPrice : 'NULL'},
    ${v.mileage},
    '${v.category}',
    '${v.transmission}',
    '${v.fuelType}',
    '${escape(v.engine)}',
    '${escape(v.traction)}',
    '${escape(v.color)}',
    ${v.doors},
    ${v.plateEnding},
    ${v.featured ? 'true' : 'false'},
    '${v.status}',
    ${v.warrantyMonths},
    '${escape(v.description)}',
    '${imagesJson}'::jsonb,
    '${eqJson}'::jsonb,
    '${safeJson}'::jsonb,
    '${comfJson}'::jsonb,
    '${v.createdAt}'
) ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    mileage = EXCLUDED.mileage,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;
`;
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(sql);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error generating SQL schema' });
  }
});

// POST /api/admin/seed - Reset database to initial stock
app.post('/api/admin/seed', (_req: Request, res: Response) => {
  try {
    writeJsonFile(VEHICLES_FILE, INITIAL_VEHICLES);
    res.json({ success: true, message: 'Stock reinicializado con los datos de Autoval' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al reiniciar datos' });
  }
});

// GET /api/download-zip - Download complete project in ZIP format for GitHub
app.get('/api/download-zip', (_req: Request, res: Response) => {
  try {
    const zipScript = path.join(__dirname, 'scripts', 'generate_zip.py');
    const zipPath = path.join(__dirname, 'autoval-clon-astro.zip');

    try {
      execSync(`python3 "${zipScript}"`, { stdio: 'ignore' });
    } catch (e) {
      console.warn('Zip script regeneration warning:', e);
    }

    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="autoval-clon-astro.zip"');
      const fileStream = fs.createReadStream(zipPath);
      fileStream.pipe(res);
    } else {
      res.status(404).json({ success: false, error: 'Archivo ZIP no encontrado' });
    }
  } catch (error) {
    console.error('Error serving ZIP:', error);
    res.status(500).json({ success: false, error: 'Error al generar archivo ZIP' });
  }
});

// ----------------- VITE INTEGRATION ----------------- //
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Autoval Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
