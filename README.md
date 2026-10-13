# 🚗 Autoval - Clon Automotora Valparaíso en Astro JS

> Proyecto 100% programado con **Astro JS** (`.astro`, Astro Islands, Astro SSR con `@astrojs/node`) integrado con **React**, **TypeScript**, **Tailwind CSS** y base de datos **PostgreSQL**.

Este proyecto es una reconstrucción completa de **autoval2.cl** (la antigua versión de WordPress), migrada a la arquitectura moderna de **Astro JS** con Server-Side Rendering (SSR), islas interactivas de React, API REST nativa de Astro (`src/pages/api/`) y soporte para base de datos PostgreSQL/Supabase.

---

## ⚡ Stack Tecnológico

- **Framework Web:** [Astro JS](https://astro.build/) (`v5`) con SSR (`@astrojs/node`)
- **Arquitectura de Islas:** `@astrojs/react` para interactividad cliente (`client:load`, `client:visible`)
- **Estilos:** Tailwind CSS v4 con `@tailwindcss/vite`
- **Tipado:** TypeScript estricto
- **Base de Datos:** PostgreSQL / Supabase con DDL, ENUMs, índices y datos iniciales en SQL
- **Íconos:** Lucide Icons

---

## 🚀 Cómo subir este proyecto a GitHub

Sigue estos sencillos pasos desde la terminal de tu computadora:

### 1. Descomprime el archivo ZIP
Descomprime `autoval-clon-astro.zip` en la carpeta donde desees trabajar y abre una terminal:
```bash
cd autoval-clon-astro
```

### 2. Inicializa Git y haz tu primer commit
```bash
# Inicializar repositorio local
git init

# Agregar todos los archivos
git add .

# Crear el primer commit
git commit -m "feat: Clon oficial de Autoval programado en Astro JS y PostgreSQL"

# Establecer la rama principal
git branch -M main
```

### 3. Crea tu repositorio en GitHub
1. Ve a [GitHub](https://github.com/new) y crea un nuevo repositorio (por ejemplo: `autoval-astro`).
2. No marques la opción de inicializar con README ni `.gitignore` (ya están incluidos en este proyecto).

### 4. Vincula y sube a GitHub
Copia la URL de tu repositorio y ejecuta:
```bash
git remote add origin https://github.com/TU-USUARIO/autoval-astro.git
git push -u origin main
```
*(Reemplaza `TU-USUARIO/autoval-astro` con tu usuario y nombre de repositorio)*

---

## 💻 Instalación y ejecución local

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** (o pnpm / yarn / bun)

### Pasos
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo con Astro
npm run dev
```

La aplicación abrirá en:
👉 `http://localhost:3000`

### Comandos de Astro disponibles:
- `npm run dev`: Inicia el servidor de desarrollo en vivo de Astro en el puerto 3000.
- `npm run build`: Compila el proyecto con Astro y genera la salida para producción.
- `npm run preview`: Previsualiza la compilación de producción de Astro localmente.

---

## 🗄️ Base de Datos PostgreSQL / Supabase

El proyecto incluye el esquema de base de datos completo y un volcado de datos inicial con los 10 vehículos del catálogo.

### Tablas incluidas:
- `autoval_vehicles`: Inventario completo con imágenes, especificaciones técnicas (motor, transmisión, combustible, tracción), equipamiento y garantías.
- `autoval_valuations`: Solicitudes de tasación online recibidas de clientes.
- `autoval_financing_requests`: Postulaciones a crédito automotriz (Compra Inteligente y Crédito Convencional).

### Cómo importar en Supabase:
1. Abre tu proyecto en [Supabase](https://supabase.com).
2. Ve a la pestaña **SQL Editor** en el menú izquierdo.
3. Copia el script SQL desde la aplicación en **"Admin Stock" -> "PostgreSQL" -> "Copiar SQL"** (o descargando el backup `.sql`).
4. Pega el contenido y presiona **"Run"**.

---

## 📁 Estructura del Proyecto en Astro JS

```
├── astro.config.mjs              # Configuración oficial de Astro JS (Node SSR + React)
├── data/
│   └── vehicles.json             # Almacenamiento local persistente de vehículos
├── src/
│   ├── layouts/
│   │   └── Layout.astro          # Layout principal de Astro con meta tags y SEO
│   ├── pages/
│   │   ├── index.astro           # Página principal de Astro
│   │   └── api/                  # Endpoints de API REST nativos de Astro (SSR)
│   │       ├── vehicles.ts       # GET y POST de vehículos
│   │       ├── vehicles/[id].ts  # GET, PUT, DELETE por ID
│   │       ├── valuations.ts     # Tasación online en 15 min
│   │       ├── financing.ts      # Solicitudes de financiamiento
│   │       ├── consignments.ts   # Formulario de consignación
│   │       ├── stats.ts          # Métricas de stock
│   │       ├── admin/
│   │       │   ├── sql-schema.ts # Generador DDL de PostgreSQL
│   │       │   └── seed.ts       # Reinicio de stock
│   │       └── download-zip.ts   # Descarga del ZIP para GitHub
│   ├── components/
│   │   ├── Header.astro          # Componente Astro estático
│   │   ├── Footer.astro          # Componente Astro estático
│   │   ├── Header.tsx            # Componente de navegación interactivo
│   │   ├── Hero.tsx              # Buscador interactivo
│   │   ├── VehicleCatalog.tsx    # Catálogo con filtros y vista grilla/lista
│   │   ├── VehicleCard.tsx       # Tarjetas con fotos, especificaciones y cuota
│   │   ├── VehicleDetailModal.tsx# Ficha técnica, equipamiento y simulador
│   │   ├── FinancingSection.tsx  # Simulador de crédito automotriz
│   │   ├── ValuationSection.tsx  # Asistente de tasación en 3 pasos
│   │   ├── ConsignmentSection.tsx# Sección y formulario de consignación
│   │   ├── ServicesSection.tsx   # Taller mecánico y cotizador de seguros
│   │   ├── AdminModal.tsx        # Panel de control, consola SQL y leads
│   │   └── WhatsAppButton.tsx    # Botón flotante directo a WhatsApp
│   ├── data/
│   │   └── initialVehicles.ts    # Datos iniciales con marcas oficiales de Autoval
│   ├── types/
│   │   └── vehicle.ts            # Tipos de TypeScript
│   ├── utils/
│   │   └── formatters.ts         # Formateo en CLP, kilometraje y cuotas
│   └── index.css                 # Estilos globales y Tailwind CSS
├── package.json                  # Dependencias de Astro JS y scripts
├── tsconfig.json                 # Configuración de TypeScript
└── scripts/
    └── generate_zip.py           # Generador automático del ZIP
```

---

## 📞 Contacto Autoval
- **Ubicación:** Valparaíso y Viña del Mar, Región de Valparaíso, Chile.
- **Teléfono / WhatsApp:** +56 9 8253 776
- **Email:** ventas@autoval.cl
- **Horario:** Lunes a Viernes de 10:00 a 17:00 hrs.
