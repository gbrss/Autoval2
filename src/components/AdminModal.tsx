import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleCategory, VehicleStatus, Transmission, FuelType } from '../types/vehicle';
import { formatCLP, formatKm } from '../utils/formatters';
import {
  X,
  Database,
  Plus,
  Trash2,
  Edit2,
  Download,
  Copy,
  Check,
  RotateCcw,
  Play,
  FileCode2,
  Users,
  BarChart3,
  Car,
  Loader2,
  AlertTriangle,
  GitBranch,
  FolderArchive,
  Terminal
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onRefreshVehicles: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onRefreshVehicles
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'stock' | 'sql' | 'leads' | 'stats' | 'github'>('stock');
  const [sqlSchema, setSqlSchema] = useState('');
  const [loadingSql, setLoadingSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // SQL Query Runner simulation
  const [customQuery, setCustomQuery] = useState(
    "SELECT brand, model, year, price, mileage, status FROM autoval_vehicles WHERE status = 'Disponible' ORDER BY price ASC;"
  );
  const [queryResults, setQueryResults] = useState<any[] | null>(null);

  // New vehicle form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: 'Peugeot',
    model: '',
    version: 'Allure',
    year: 2023,
    price: 12990000,
    originalPrice: 13500000,
    mileage: 25000,
    category: 'SUV' as VehicleCategory,
    transmission: 'Automática' as Transmission,
    fuelType: 'Bencina' as FuelType,
    engine: '1.6L',
    traction: '4x2',
    color: 'Blanco',
    doors: 5,
    plateEnding: 3,
    images: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'Disponible' as VehicleStatus,
    warrantyMonths: 12,
    description: 'Impecable estado, único dueño con mantenciones en concesionario oficial.'
  });

  // Leads
  const [valuationsList, setValuationsList] = useState<any[]>([]);
  const [financingsList, setFinancingsList] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);

  // Fetch SQL Schema and Leads
  useEffect(() => {
    fetchSqlSchema();
    fetchLeads();
    fetchStats();
  }, []);

  const fetchSqlSchema = async () => {
    setLoadingSql(true);
    try {
      const res = await fetch('/api/admin/sql-schema');
      const text = await res.text();
      setSqlSchema(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSql(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const [valRes, finRes] = await Promise.all([
        fetch('/api/valuations').then((r) => r.json()),
        fetch('/api/financing').then((r) => r.json()),
      ]);
      if (valRes.data) setValuationsList(valRes.data);
      if (finRes.data) setFinancingsList(finRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.stats) setStatsData(json.stats);
    } catch (err) {
      console.error(err);
    }
  };

  // Add vehicle
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.price) return;

    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVehicle,
          images: [newVehicle.images],
          equipment: ['Aire Acondicionado', 'Radio Touch', 'Cámara de Retroceso'],
          safety: ['Airbags frontales', 'Frenos ABS', 'Control de Estabilidad'],
          comfort: ['Cierre Centralizado', 'Alzavidrios eléctricos']
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        onRefreshVehicles();
        fetchSqlSchema();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Status change
  const handleChangeStatus = async (id: string, newStatus: VehicleStatus) => {
    try {
      await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      onRefreshVehicles();
      fetchSqlSchema();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar ${name} del inventario?`)) return;
    try {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      onRefreshVehicles();
      fetchSqlSchema();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Reset to default Autoval seed stock
  const handleResetSeed = async () => {
    if (!confirm('¿Restablecer el inventario inicial de Autoval? Se cargarán los 10 vehículos oficiales.')) return;
    try {
      await fetch('/api/admin/seed', { method: 'POST' });
      onRefreshVehicles();
      fetchSqlSchema();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Download SQL File
  const handleDownloadSql = () => {
    const blob = new Blob([sqlSchema], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autoval_postgresql_backup_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Run simulated PostgreSQL query on current dataset
  const handleRunQuery = () => {
    const q = customQuery.toLowerCase();
    let res = [...vehicles];

    if (q.includes("status = 'disponible'")) {
      res = res.filter((v) => v.status === 'Disponible');
    } else if (q.includes("status = 'reservado'")) {
      res = res.filter((v) => v.status === 'Reservado');
    }

    if (q.includes("price < 15000000")) {
      res = res.filter((v) => v.price < 15000000);
    }

    if (q.includes('order by price asc')) {
      res.sort((a, b) => a.price - b.price);
    } else if (q.includes('order by price desc')) {
      res.sort((a, b) => b.price - a.price);
    } else if (q.includes('order by year desc')) {
      res.sort((a, b) => b.year - a.year);
    }

    setQueryResults(
      res.map((v) => ({
        id: v.id,
        brand: v.brand,
        model: v.model,
        year: v.year,
        price: formatCLP(v.price),
        mileage: formatKm(v.mileage),
        status: v.status,
        category: v.category
      }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[94vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Panel de Administración · Autoval
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700">
                  PostgreSQL Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestión en tiempo real de inventario, consultas SQL y solicitudes de clientes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 sm:px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('stock')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'stock' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Stock de Vehículos ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'sql' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>PostgreSQL (DDL / Dump / Queries)</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'leads' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Solicitudes & Leads ({valuationsList.length + financingsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'stats' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Métricas del Negocio</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'github' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <span className="font-bold">Descargar ZIP para GitHub</span>
            <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-1.5 py-0.2 rounded border border-indigo-500/30">
              Listo
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          
          {/* TAB 1: VEHICLE STOCK MANAGEMENT */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="text-xs text-slate-400">
                  Gestiona las unidades disponibles en el showroom de Valparaíso.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetSeed}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    title="Restablecer stock inicial"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Stock Oficial</span>
                  </button>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Vehículo</span>
                  </button>
                </div>
              </div>

              {/* Table of Vehicles */}
              <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Vehículo</th>
                      <th className="py-3 px-3">Categoría</th>
                      <th className="py-3 px-3">Año / Km</th>
                      <th className="py-3 px-3">Precio Contado</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={v.images[0] || ''}
                              alt=""
                              className="w-12 h-9 object-cover rounded-lg border border-slate-800 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white">
                                {v.brand} {v.model}
                              </div>
                              <div className="text-[11px] text-slate-400">{v.version}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px]">
                            {v.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-300">
                          <div>{v.year}</div>
                          <div className="text-[11px] text-slate-400">{formatKm(v.mileage)}</div>
                        </td>

                        <td className="py-3 px-3 font-bold text-white">
                          {formatCLP(v.price)}
                        </td>

                        <td className="py-3 px-3">
                          <select
                            value={v.status}
                            onChange={(e) => handleChangeStatus(v.id, e.target.value as VehicleStatus)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                              v.status === 'Disponible'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : v.status === 'Reservado'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="Disponible">Disponible</option>
                            <option value="Reservado">Reservado</option>
                            <option value="Vendido">Vendido</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteVehicle(v.id, `${v.brand} ${v.model}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Eliminar de la base de datos"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: POSTGRESQL DDL, DUMP & QUERIES */}
          {activeTab === 'sql' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Esquema y Dump PostgreSQL (autoval_vehicles)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Script DDL completo con tipos ENUM, claves primarias, índices y datos INSERT actualizados.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copiado' : 'Copiar SQL'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSql}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Backup .SQL</span>
                  </button>
                </div>
              </div>

              {/* Interactive SQL Query Tester */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-400 font-mono">
                    -- Consulta SQL Interactiva sobre el inventario:
                  </label>
                  <button
                    onClick={handleRunQuery}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Ejecutar Query</span>
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="w-full bg-slate-900 font-mono text-xs text-emerald-300 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />

                {queryResults && (
                  <div className="mt-3 overflow-x-auto border border-slate-800 rounded-xl bg-slate-900">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2">brand</th>
                          <th className="p-2">model</th>
                          <th className="p-2">year</th>
                          <th className="p-2">price</th>
                          <th className="p-2">mileage</th>
                          <th className="p-2">status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {queryResults.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/50">
                            <td className="p-2 text-white">{row.brand}</td>
                            <td className="p-2 text-slate-300">{row.model}</td>
                            <td className="p-2 text-slate-400">{row.year}</td>
                            <td className="p-2 text-emerald-400">{row.price}</td>
                            <td className="p-2 text-slate-400">{row.mileage}</td>
                            <td className="p-2 text-slate-300">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Code viewer */}
              <div className="relative">
                <div className="text-[11px] text-slate-400 font-mono mb-1.5 flex items-center justify-between">
                  <span>Esquema PostgreSQL autoval2.cl DDL</span>
                  <span>Dialecto: PostgreSQL 14 / 15 / 16 / Cloud SQL</span>
                </div>
                <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-72 overflow-y-auto overflow-x-auto whitespace-pre leading-relaxed scrollbar-none">
                  {loadingSql ? 'Cargando script SQL...' : sqlSchema}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: LEADS & INQUIRIES */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Tasaciones Online Recibidas ({valuationsList.length})
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Clientes que cotizaron valor de mercado para venta directa o parte de pago en Valparaíso.
                </p>

                {valuationsList.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                        <tr>
                          <th className="p-3">Cliente</th>
                          <th className="p-3">Vehículo a Tasar</th>
                          <th className="p-3">Objetivo</th>
                          <th className="p-3">Tasación Estimada</th>
                          <th className="p-3">Contacto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {valuationsList.map((val) => (
                          <tr key={val.id} className="hover:bg-slate-900/40">
                            <td className="p-3">
                              <div className="font-bold text-white">{val.name}</div>
                              <div className="text-[11px] text-slate-400">{val.region}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-white font-medium">{val.brand} {val.model} ({val.year})</div>
                              <div className="text-[11px] text-slate-400">{formatKm(val.mileage)} · {val.condition}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-semibold">
                                {val.intent}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-emerald-400">
                              {formatCLP(val.estimatedMin)} - {formatCLP(val.estimatedMax)}
                            </td>
                            <td className="p-3 text-slate-300">
                              <div>{val.phone}</div>
                              <div className="text-[11px] text-slate-400">{val.email}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                    Aún no hay solicitudes de tasación registradas.
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Solicitudes de Financiamiento ({financingsList.length})
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Pre-evaluaciones de crédito automotriz ingresadas por clientes.
                </p>

                {financingsList.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                        <tr>
                          <th className="p-3">Cliente / RUT</th>
                          <th className="p-3">Auto</th>
                          <th className="p-3">Pie / Cuota</th>
                          <th className="p-3">Renta</th>
                          <th className="p-3">Teléfono</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {financingsList.map((fin) => (
                          <tr key={fin.id} className="hover:bg-slate-900/40">
                            <td className="p-3">
                              <div className="font-bold text-white">{fin.name}</div>
                              <div className="text-[11px] text-slate-400">RUT: {fin.rut}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-white">{fin.vehicleTitle || 'Auto catálogo'}</div>
                              <div className="text-[11px] text-slate-400">{formatCLP(fin.vehiclePrice)}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-emerald-400 font-bold">{formatCLP(fin.monthlyFee)}/mes</div>
                              <div className="text-[11px] text-slate-400">{fin.installments} cuotas · Pie {fin.downPaymentPercent}%</div>
                            </td>
                            <td className="p-3 text-slate-300">
                              <div>{formatCLP(fin.monthlyIncome)}</div>
                              <div className="text-[11px] text-slate-400">{fin.employmentType}</div>
                            </td>
                            <td className="p-3 text-slate-300">
                              {fin.phone}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                    Aún no hay postulaciones de crédito registradas.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: METRICS & STATS */}
          {activeTab === 'stats' && statsData && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Stock Total</div>
                  <div className="text-2xl font-black text-white mt-1">{statsData.totalStock}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">{statsData.availableCount} disponibles</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Valor Inventario</div>
                  <div className="text-lg font-black text-emerald-400 mt-1">{formatCLP(statsData.totalInventoryValue)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">en exhibición</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Precio Promedio</div>
                  <div className="text-lg font-black text-white mt-1">{formatCLP(statsData.averagePrice)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">por unidad</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Total Leads</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">{statsData.leadsCount}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">interesados</div>
                </div>
              </div>

              {/* Brands & Categories distribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                    Distribución por Marca
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(statsData.brandsBreakdown || {}).map(([brand, count]: any) => (
                      <div key={brand} className="flex justify-between items-center text-xs">
                        <span className="text-slate-300">{brand}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-600 rounded-full"
                              style={{ width: `${(count / statsData.totalStock) * 100}%` }}
                            />
                          </div>
                          <span className="font-bold text-white w-4 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                    Distribución por Carrocería
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(statsData.categoriesBreakdown || {}).map(([cat, count]: any) => (
                      <div key={cat} className="flex justify-between items-center text-xs">
                        <span className="text-slate-300">{cat}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${(count / statsData.totalStock) * 100}%` }}
                            />
                          </div>
                          <span className="font-bold text-white w-4 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GITHUB EXPORT & ZIP DOWNLOAD */}
          {activeTab === 'github' && (
            <div className="space-y-6">
              {/* Main Download Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/60 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700 text-indigo-300 text-xs font-semibold">
                      <FolderArchive className="w-3.5 h-3.5" />
                      <span>Paquete Listo para GitHub</span>
                    </div>
                    <h3 className="text-xl font-black text-white">
                      Descargar Proyecto Completo en ZIP
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      Incluye todo el código fuente (Astro/React, TypeScript, Tailwind CSS, Express backend, base de datos PostgreSQL con DDL y dump de vehículos, componentes, imágenes y README con instrucciones).
                    </p>
                  </div>

                  <a
                    href="/api/download-zip"
                    download="autoval-clon-astro.zip"
                    className="shrink-0 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>Descargar .ZIP Ahora</span>
                  </a>
                </div>

                <div className="pt-3 border-t border-indigo-900/40 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4" />
                    Sin carpetas basura (excluye node_modules y cache)
                  </span>
                  <span>·</span>
                  <span>Archivo: <strong>autoval-clon-astro.zip</strong></span>
                  <span>·</span>
                  <span>Compatible con GitHub, GitLab y Vercel</span>
                </div>
              </div>

              {/* Step by Step Instructions */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>Pasos para subir a tu GitHub:</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
                      <span>Descomprime el ZIP y entra a la carpeta</span>
                    </div>
                    <pre className="bg-slate-900 p-2.5 rounded-xl font-mono text-slate-300 overflow-x-auto text-[11px]">
                      cd autoval-clon-astro
                    </pre>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
                      <span>Inicializa Git y crea tu primer commit</span>
                    </div>
                    <pre className="bg-slate-900 p-2.5 rounded-xl font-mono text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
                      git init{'\n'}git add .{'\n'}git commit -m "feat: Clon Autoval con Astro y PostgreSQL"{'\n'}git branch -M main
                    </pre>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 text-xs flex items-center justify-center font-bold">3</span>
                      <span>Conecta con tu repositorio en GitHub y sube los cambios</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Crea un repositorio vacío en github.com/new y ejecuta:
                    </p>
                    <pre className="bg-slate-900 p-2.5 rounded-xl font-mono text-indigo-300 overflow-x-auto text-[11px]">
                      git remote add origin https://github.com/TU-USUARIO/autoval-automotora.git{'\n'}git push -u origin main
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs text-slate-400 flex items-center justify-between">
          <span>Autoval Automotora · Valparaíso y Viña del Mar</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>

      </div>

      {/* NESTED MODAL: ADD VEHICLE FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-500" />
                <span>Ingresar Nuevo Vehículo a PostgreSQL</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Marca *</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Modelo *</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Versión</label>
                  <input
                    type="text"
                    value={newVehicle.version}
                    onChange={(e) => setNewVehicle({ ...newVehicle, version: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Año</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Precio (CLP) *</label>
                  <input
                    type="number"
                    required
                    value={newVehicle.price}
                    onChange={(e) => setNewVehicle({ ...newVehicle, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kilometraje (Km)</label>
                  <input
                    type="number"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({ ...newVehicle, mileage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Carrocería</label>
                  <select
                    value={newVehicle.category}
                    onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Camioneta">Camioneta</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedán">Sedán</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Transmisión</label>
                  <select
                    value={newVehicle.transmission}
                    onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automática">Automática</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Combustible</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Bencina">Bencina</option>
                    <option value="Diésel">Diésel</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL de Imagen Principal</label>
                <input
                  type="url"
                  value={newVehicle.images}
                  onChange={(e) => setNewVehicle({ ...newVehicle, images: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Guardar en PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
