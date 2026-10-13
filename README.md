# 🚗 Autoval - Clon Automotora Valparaíso & Viña del Mar

> Proyecto web moderno inspirado en **Astro JS** y construido con **React + TypeScript + Tailwind CSS**, respaldado por un backend **Express** y gestión de base de datos **PostgreSQL**.

Este proyecto es una versión renovada, ultra-rápida y de alto rendimiento de **autoval2.cl**, reemplazando la versión antigua de WordPress con componentes modernos, simulador de crédito en tiempo real, tasación instantánea en 15 minutos, consignación y panel de administración con PostgreSQL.

---

## 🚀 Cómo subir este proyecto a GitHub

Sigue estos sencillos pasos desde la terminal de tu computadora:

### 1. Descomprime el archivo ZIP
Descomprime `autoval-clon-astro.zip` en la carpeta donde desees trabajar y abre una terminal dentro de esa carpeta:
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
git commit -m "feat: Clon de Autoval con Astro/React y PostgreSQL"

# Establecer la rama principal
git branch -M main
```

### 3. Crea el repositorio en GitHub
1. Ve a [GitHub](https://github.com/new) y crea un nuevo repositorio (por ejemplo, `autoval-automotora`).
2. No marques la opción de inicializar con README ni `.gitignore` (ya están incluidos en este proyecto).

### 4. Vincula y sube a GitHub
Copia la URL de tu repositorio de GitHub y ejecuta:
```bash
git remote add origin https://github.com/TU-USUARIO/autoval-automotora.git
git push -u origin main
```
*(Reemplaza `TU-USUARIO/autoval-automotora` con tu usuario y nombre de repositorio)*

---

## 💻 Instalación y ejecución local

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** (o yarn / pnpm / bun)

### Pasos
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo (Full-Stack)
npm run dev
```

La aplicación estará corriendo en:
👉 `http://localhost:3000`

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
3. Puedes obtener el script SQL desde la aplicación en **"Admin Stock" -> "PostgreSQL" -> "Copiar SQL"** (o descargando el backup `.sql`).
4. Pega el contenido y presiona **"Run"**.

---

## 📁 Estructura del Proyecto

```
├── data/
│   └── vehicles.json             # Almacenamiento local persistente de vehículos
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Barra superior con datos de Valparaíso y menú
│   │   ├── Hero.tsx              # Hero con buscador interactivo estilo Astro
│   │   ├── VehicleCatalog.tsx    # Catálogo con filtros y vista grilla/lista
│   │   ├── VehicleCard.tsx       # Tarjetas con fotos, especificaciones y cuota
│   │   ├── VehicleDetailModal.tsx# Ficha técnica, equipamiento y simulador
│   │   ├── FinancingSection.tsx  # Simulador de crédito automotriz
│   │   ├── ValuationSection.tsx  # Asistente de tasación en 3 pasos
│   │   ├── ConsignmentSection.tsx# Sección y formulario de consignación
│   │   ├── ServicesSection.tsx   # Taller mecánico y cotizador de seguros
│   │   ├── AdminModal.tsx        # Panel de control, consola SQL y leads
│   │   ├── Footer.tsx            # Pie de página y datos de sucursal
│   │   └── WhatsAppButton.tsx    # Botón flotante directo a WhatsApp
│   ├── data/
│   │   └── initialVehicles.ts    # Datos iniciales con marcas oficiales de Autoval
│   ├── types/
│   │   └── vehicle.ts            # Definiciones de TypeScript
│   ├── utils/
│   │   └── formatters.ts         # Formateo en CLP, kilometraje y cuotas
│   ├── App.tsx                   # Aplicación principal
│   ├── main.tsx                  # Punto de entrada de React
│   └── index.css                 # Estilos globales y Tailwind CSS
├── server.ts                     # Servidor Express Full-Stack con API REST
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
└── vite.config.ts                # Configuración de Vite
```

---

## 📞 Contacto Autoval
- **Ubicación:** Valparaíso y Viña del Mar, Región de Valparaíso, Chile.
- **Teléfono / WhatsApp:** +56 9 8253 776
- **Email:** ventas@autoval.cl
- **Horario:** Lunes a Viernes de 10:00 a 17:00 hrs.
