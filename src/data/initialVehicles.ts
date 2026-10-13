import { Vehicle } from '../types/vehicle';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    brand: 'Peugeot',
    model: '208',
    version: 'Allure 1.2 PureTech',
    year: 2023,
    price: 13990000,
    originalPrice: 14790000,
    mileage: 18500,
    category: 'Hatchback',
    transmission: 'Manual',
    fuelType: 'Bencina',
    engine: '1.2 PureTech 100 CV',
    traction: '4x2 Delantera',
    color: 'Gris Artense',
    doors: 5,
    plateEnding: 7,
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    status: 'Disponible',
    warrantyMonths: 12,
    description: 'Impecable Peugeot 208 Allure con tablero i-Cockpit 3D digital, único dueño, mantenciones al día timbradas en concesionario oficial. Incluye láminas de seguridad certificadas.',
    equipment: [
      'Pantalla táctil 10" Apple CarPlay & Android Auto inalámbrico',
      'i-Cockpit 3D con instrumental holográfico configurable',
      'Cámara de retroceso 180° VisioPark con sensores traseros',
      'Llantas de aleación diamantadas aro 16"',
      'Climatizador digital automático bizona',
      'Luces DRL LED colmillos de león'
    ],
    safety: [
      '6 Airbags (Frontales, laterales y de cortina)',
      'Frenos ABS + Repartidor electrónico de frenada (REF)',
      'Control dinámico de estabilidad (ESP)',
      'Asistente de arranque en pendiente (Hill Assist)',
      'Fijaciones Isofix para sillas infantiles'
    ],
    comfort: [
      'Acceso y encendido manos libres (Keyless)',
      'Volante deportivo compacto en cuero con mandos multifunción',
      'Alzavidrios eléctricos en las 4 puertas One-Touch',
      'Retrovisores abatibles eléctricamente con desempañador'
    ],
    createdAt: '2025-01-15T12:00:00.000Z'
  },
  {
    id: 'veh-002',
    brand: 'Nissan',
    model: 'Kicks',
    version: 'Advance 1.6 CVT',
    year: 2022,
    price: 13490000,
    originalPrice: 14190000,
    mileage: 32000,
    category: 'SUV',
    transmission: 'Automática',
    fuelType: 'Bencina',
    engine: '1.6L DOHC 118 HP',
    traction: '4x2',
    color: 'Blanco Perlado / Techo Negro',
    doors: 5,
    plateEnding: 3,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    status: 'Disponible',
    warrantyMonths: 12,
    description: 'Excelente SUV urbano, versión Advance bi-tono. Muy económico en consumo de combustible y con amplio espacio interior. Revisión técnica vigente hasta 2026.',
    equipment: [
      'Nissan Connect con pantalla táctil de 8" y conectividad smartphone',
      'Cámara de visión trasera con guías dinámicas',
      'Botón de encendido Push Start e Intelligent Key',
      'Barras de techo longitudinales originales',
      'Faros antiniebla delanteros'
    ],
    safety: [
      '6 Airbags para conductor, acompañante y cortina',
      'Control Activo de Marcha (ARC) y Control Activo de Trazo (ATC)',
      'Frenado Activo de Motor (AEB)',
      'Monitoreo de presión de neumáticos (TPMS)'
    ],
    comfort: [
      'Asientos Zero Gravity anatómicos para largos viajes',
      'Volante con ajuste telescópico y de altura',
      'Control de crucero al volante',
      'Computador a bordo de 7" en cuadro de instrumentos'
    ],
    createdAt: '2025-01-18T14:30:00.000Z'
  },
  {
    id: 'veh-003',
    brand: 'Kia',
    model: 'Sportage',
    version: 'EX 2.0 Full',
    year: 2023,
    price: 19890000,
    originalPrice: 20990000,
    mileage: 21400,
    category: 'SUV',
    transmission: 'Automática',
    fuelType: 'Bencina',
    engine: '2.0L Smartstream 154 HP',
    traction: '4x2',
    color: 'Gris Gravedad',
    doors: 5,
    plateEnding: 9,
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    status: 'Disponible',
    warrantyMonths: 12,
    description: 'Nueva generación Kia Sportage en estado como nuevo. Diseño futurista, máxima habitabilidad y tecnología de última generación. Garantía de fábrica vigente.',
    equipment: [
      'Doble pantalla panorámica integrada curvada de 12.3"',
      'Llantas de aleación 18" bitono',
      'Selector de marcha E-Shift rotativo',
      'Cargador inductivo para smartphone',
      'Faros delanteros Full LED con luces de giro'
    ],
    safety: [
      'Paquete Kia Drive Wise con frenado autónomo de emergencia',
      'Asistente de mantenimiento de carril activo (LKA)',
      'Alerta de punto ciego y tráfico cruzado',
      'Freno de mano eléctrico con función Auto Hold'
    ],
    comfort: [
      'Tapiz ecocuero de alta resistencia',
      'Climatizador digital trizona para plazas traseras',
      'Maletero con apertura eléctrica inteligente manos libres',
      'Salidas USB integradas en respaldos de asientos'
    ],
    createdAt: '2025-01-20T10:00:00.000Z'
  },
  {
    id: 'veh-004',
    brand: 'Mitsubishi',
    model: 'L200',
    version: 'Katana 2.4 TDI 4x4',
    year: 2022,
    price: 18490000,
    originalPrice: 19200000,
    mileage: 48000,
    category: 'Camioneta',
    transmission: 'Manual',
    fuelType: 'Diésel',
    engine: '2.4L MIVEC Turbo Diésel 152 HP',
    traction: '4x4 Easy Select con reductora',
    color: 'Rojo Metálico',
    doors: 4,
    plateEnding: 1,
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    status: 'Disponible',
    warrantyMonths: 12,
    description: 'La camioneta más vendida de Chile. Robusta, confiable e ideal para faena, viajes y trabajo pesado. Equipada con pisaderas, barra antivuelco y cubre pick-up.',
    equipment: [
      'Tracción 4x4 con caja reductora 4L / 4H / 2H',
      'Cubre pick-up plástico de fábrica alta densidad',
      'Barra antivuelco cromada y pisaderas laterales',
      'Enganche para carro de arrastre con conexión eléctrica',
      'Radio touch con Bluetooth y USB'
    ],
    safety: [
      'Chasis reforzado RISE con deformación programada',
      'Doble Airbag frontal',
      'Frenos ABS con EBD para carga pesada',
      'Control de estabilidad y tracción (ASTC)'
    ],
    comfort: [
      'Aire acondicionado de alta capacidad',
      'Cierre centralizado con mando a distancia',
      'Alzavidrios eléctricos en las 4 puertas',
      'Excelente despeje del suelo de 205 mm'
    ],
    createdAt: '2025-01-22T09:15:00.000Z'
  },
  {
    id: 'veh-005',
    brand: 'Chery',
    model: 'Tiggo 7 Pro',
    version: '1.5 Turbo GLX AT',
    year: 2023,
    price: 14790000,
    originalPrice: 15690000,
    mileage: 19500,
    category: 'SUV',
    transmission: 'Automática',
    fuelType: 'Bencina',
    engine: '1.5L Turbo Acteco 145 HP',
    traction: '4x2',
    color: 'Azul Quantum',
    doors: 5,
    plateEnding: 5,
    images: [
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    status: 'Disponible',
    warrantyMonths: 12,
    description: 'SUV de nivel superior con techo solar panorámico, tapiz de ecocuero y cámara 360°. Excelente relación precio/equipamiento con bajísimo kilometraje.',
    equipment: [
      'Techo panorámico corredizo eléctrico con cortinilla',
      'Cámara de estacionamiento 360° en alta definición 3D',
      'Pantalla táctil de 10.25" con compatibilidad MirrorLink / CarPlay',
      'Llantas de aleación aro 18" pulidas',
      'Iluminación ambiental interior personalizable'
    ],
    safety: [
      '6 Airbags (frontales, laterales y tipo cortina)',
      'Control de tracción y estabilidad Bosch 9.3',
      'Asistente de arranque y descenso en pendientes (HAC/HDC)',
      'Freno de estacionamiento eléctrico con Auto-Hold'
    ],
    comfort: [
      'Asiento del conductor regulable eléctricamente en 6 posiciones',
      'Climatizador digital bizona con pantalla táctil independiente',
      'Encendido remoto de motor desde el control de la llave',
      'Apertura de maletero automática por proximidad'
    ],
    createdAt: '2025-01-25T16:00:00.000Z'
  },
  {
    id: 'veh-006',
    brand: 'Toyota',
    model: 'RAV4',
    version: 'LE 2.0 4x2 AT',
    year: 2021,
    price: 17890000,
    originalPrice: 18500000,
    mileage: 41000,
    category: 'SUV',
    transmission: 'Automática',
    fuelType: 'Bencina',
    engine: '2.0L Dual VVT-i 170 HP',
    traction: '4x2',
    color: 'Plata Metálico',
    doors: 5,
    plateEnding: 2,
    images: [
      'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    status: 'Disponible',
    warrantyMonths: 12,
    description: 'La fiabilidad legendaria de Toyota en su modelo más emblemático. Plataforma TNGA con inmejorable aplomo y suavidad de marcha. Historial de revisiones al día.',
    equipment: [
      'Transmisión Direct Shift CVT con modo secuencial',
      'Radio con pantalla táctil y Apple CarPlay / Android Auto',
      'Modos de conducción Eco / Normal / Sport',
      'Luces Bi-LED con encendido automático',
      'Espejos retrovisores retráctiles calefaccionados'
    ],
    safety: [
      '7 Airbags (incluye airbag de rodilla para conductor)',
      'Toyota Safety Sense básico con control de estabilidad VSC',
      'Frenos de disco en las 4 ruedas con ABS + EBD + BA',
      'Anclajes ISOFIX'
    ],
    comfort: [
      'Amplio maletero de 580 litros con piso de doble fondo reversible',
      'Aire acondicionado manual con salidas para asientos traseros',
      'Volante de uretano de tacto suave con comandos integrados',
      'Barras portaequipaje longitudinales'
    ],
    createdAt: '2025-01-28T11:20:00.000Z'
  },
  {
    id: 'veh-007',
    brand: 'Hyundai',
    model: 'Tucson',
    version: 'Value 2.0 AT',
    year: 2022,
    price: 16990000,
    originalPrice: 17700000,
    mileage: 35000,
    category: 'SUV',
    transmission: 'Automática',
    fuelType: 'Bencina',
    engine: '2.0L MPI 156 HP',
    traction: '4x2',
    color: 'Negro Phantom',
    doors: 5,
    plateEnding: 8,
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    status: 'Disponible',
    warrantyMonths: 12,
    description: 'Diseño vanguardista con parrilla de luces paramétricas ocultas. Muy espaciosa y confortable para la familia. Único dueño, no fumador.',
    equipment: [
      'Parrilla frontal paramétrica con luces diurnas LED ocultas',
      'Pantalla táctil de 8" con conectividad inalámbrica para smartphones',
      'Cámara de retroceso con guías dinámicas y sensores',
      'Llantas de aleación aro 17"',
      'Control crucero con limitador de velocidad'
    ],
    safety: [
      '6 Airbags integrales de protección cabina',
      'Control de estabilidad ESC y control de tracción TCS',
      'Asistente de arranque en pendiente HAC',
      'Monitoreo de presión de inflado de neumáticos'
    ],
    comfort: [
      'Climatizador automático con difusor de aire suave multi-air',
      'Asientos traseros abatibles 40:20:40 con ajuste de inclinación',
      'Volante forrado en cuero con regulación en altura y profundidad',
      'Consola central flotante ergonómica'
    ],
    createdAt: '2025-02-01T15:10:00.000Z'
  },
  {
    id: 'veh-008',
    brand: 'Suzuki',
    model: 'Swift',
    version: 'GLX 1.2 Boosterjet Híbrido',
    year: 2023,
    price: 11490000,
    originalPrice: 12200000,
    mileage: 15200,
    category: 'Hatchback',
    transmission: 'Manual',
    fuelType: 'Híbrido',
    engine: '1.2L Dualjet Mild-Hybrid (SHVS)',
    traction: '4x2',
    color: 'Rojo Pasión / Techo Negro',
    doors: 5,
    plateEnding: 6,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    status: 'Disponible',
    warrantyMonths: 12,
    description: 'La máxima economía de combustible en ciudad y carretera con tecnología microhíbrida (SHVS). Exento de restricción vehicular en Santiago y Valparaíso.',
    equipment: [
      'Sistema Mild Hybrid SHVS con batería de ion-litio autorrecargable',
      'Faros delanteros Full LED con sensor crepuscular',
      'Pantalla multimedia de 7" con CarPlay y Android Auto',
      'Llantas de aleación diamantadas aro 16"',
      'Volante con base plana estilo D-Cut'
    ],
    safety: [
      '6 Airbags de serie',
      'Control de estabilidad electrónico ESP',
      'Frenos de disco delanteros ventilados con ABS y EBD',
      'Cámara de estacionamiento trasera'
    ],
    comfort: [
      'Climatizador digital automático',
      'Botón de encendido Push Start con Smart Key',
      'Control crucero al volante',
      'Consumo mixto homologado superior a 21 km/litro'
    ],
    createdAt: '2025-02-05T08:45:00.000Z'
  },
  {
    id: 'veh-009',
    brand: 'Chevrolet',
    model: 'Onix Sedán',
    version: 'Premier 1.0 Turbo AT',
    year: 2022,
    price: 10990000,
    originalPrice: 11690000,
    mileage: 38000,
    category: 'Sedán',
    transmission: 'Automática',
    fuelType: 'Bencina',
    engine: '1.0L Turbo 116 HP',
    traction: '4x2',
    color: 'Azul Seeker',
    doors: 4,
    plateEnding: 0,
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    status: 'Reservado',
    warrantyMonths: 12,
    description: 'Sedán ágil y económico con motor turbo y calificación 5 estrellas de seguridad Latin NCAP. Wi-Fi nativo a bordo y asistente OnStar.',
    equipment: [
      'Sistema OnStar con Wi-Fi nativo 4G LTE hasta 7 dispositivos',
      'Cargador inalámbrico para celulares',
      'Asistente de estacionamiento semiautónomo Easy Park',
      'Pantalla táctil MyLink 8" de alta resolución',
      'Tapiz interior bicolor premium'
    ],
    safety: [
      'Calificación 5 Estrellas Latin NCAP',
      '6 Airbags de serie',
      'Sensor de punto ciego en espejos laterales',
      'Control electrónico de estabilidad y tracción StabiliTrak'
    ],
    comfort: [
      'Caja automática de 6 velocidades con modo manual',
      'Maletero generoso de 469 litros',
      'Climatizador digital automático',
      'Acceso y arranque sin llave'
    ],
    createdAt: '2025-02-08T13:15:00.000Z'
  },
  {
    id: 'veh-010',
    brand: 'Peugeot',
    model: 'Partner',
    version: 'Maxi L2 1.6 HDi Diésel',
    year: 2021,
    price: 11890000,
    originalPrice: 12500000,
    mileage: 62000,
    category: 'Comercial',
    transmission: 'Manual',
    fuelType: 'Diésel',
    engine: '1.6L BlueHDi 100 CV Turbo Diésel',
    traction: '4x2 Delantera',
    color: 'Blanco Banquise',
    doors: 4,
    plateEnding: 4,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    status: 'Disponible',
    warrantyMonths: 6,
    description: 'El furgón utilitario más eficiente del mercado. Versión larga Maxi L2 con capacidad para 2 pallets europeos y carga útil de 1.000 kg. IVA recuperable.',
    equipment: [
      'Capacidad de carga de hasta 1.000 kg y 4,4 m³ de volumen',
      'Puerta lateral corrediza y puertas traseras batientes 180°',
      'Separador de carga metálico con ventana',
      'Radio con mandos al volante y conexión Bluetooth / manos libres',
      'Piso de zona de carga con revestimiento protector'
    ],
    safety: [
      'Doble Airbag frontal',
      'Frenos de disco en las 4 ruedas con ABS + AFU + ESC',
      'Asistente de arranque en pendiente Hill Assist',
      'Sensores de estacionamiento traseros'
    ],
    comfort: [
      'Aire acondicionado reforzado',
      'Asiento del conductor regulable en altura con apoyabrazos',
      'Guantera refrigerada de gran capacidad',
      'Alzavidrios eléctricos'
    ],
    createdAt: '2025-02-10T17:30:00.000Z'
  }
];
