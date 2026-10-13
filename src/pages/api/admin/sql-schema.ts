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

export const GET: APIRoute = async () => {
  try {
    const vehicles = getVehicles();

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

    return new Response(sql, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    return new Response('Error generating SQL schema', { status: 500 });
  }
};
