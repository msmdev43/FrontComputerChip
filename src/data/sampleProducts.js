// C:\xampp\htdocs\FrontComputerChip\src\data\sampleProducts.js
//
// Datos de ejemplo que siguen EXACTAMENTE la estructura de la base de datos MySQL
// Incluye: productos, marcas, categorías, imágenes, ofertas, especificaciones, atributos y preguntas

// ============================================
// DATOS MAESTROS (Tablas independientes)
// ============================================

// Marcas
export const MARCAS = [
  { id: 1, nombre: 'Zer01 Gaming' },
  { id: 2, nombre: 'American Telekinesis' },
  { id: 3, nombre: 'Redragon' },
  { id: 4, nombre: 'NVIDIA' },
  { id: 5, nombre: 'Logitech' },
  { id: 6, nombre: 'ViewSonic' },
  { id: 7, nombre: 'Corsair' },
  { id: 8, nombre: 'Kingston' },
  { id: 9, nombre: 'Samsung' },
  { id: 10, nombre: 'AMD' },
  { id: 11, nombre: 'MSI' },
  { id: 12, nombre: 'HyperX' }
];

// Categorías
export const CATEGORIAS = [
  { id: 1, nombre: 'Gabinetes' },
  { id: 2, nombre: 'Memorias Para Pc' },
  { id: 3, nombre: 'Teclados' },
  { id: 4, nombre: 'Placas De Video' },
  { id: 5, nombre: 'Mouse' },
  { id: 6, nombre: 'Monitores' },
  { id: 7, nombre: 'Fuentes' },
  { id: 8, nombre: 'Almacenamiento' },
  { id: 9, nombre: 'Procesadores' },
  { id: 10, nombre: 'Placas Madre' },
  { id: 11, nombre: 'Auriculares' }
];

// ============================================
// PRODUCTOS (Tabla principal)
// ============================================

export const SAMPLE_PRODUCTS = [
  // 1. Gabinete Zer01 Gaming Centauri
  {
    id: 1,
    nombre: 'Gabinete Gamer Zer01 Gaming Centauri 3 Fan Fixed Rgb',
    precio: 25900,
    garantia: '12 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'ZG-CENT3-RGB',
    createdAt: '2026-01-15 10:00:00',
    updatedAt: '2026-01-15 10:00:00',
    deletedAt: null,
    // Relaciones
    marca: 'Zer01 Gaming',
    categoria: 'Gabinetes',
    oferta: {
      id: 1,
      titulo: 'Oferta Gabinete Gamer',
      subtitulo: 'Precio especial verano',
      tipoOferta: 'flash',
      tipoDescuento: 'porcentaje',
      descuento: 32.29,
      precioOriginal: 38250,
      precioOferta: 25900,
      createdAt: '2026-01-15 10:00:00',
      updatedAt: '2026-01-15 10:00:00',
      deletedAt: null
    },
    imagenes: [
      { id: 1, nombre: 'gabinete-centauri-main', url: '/images/gabinete-centauri.webp', orden: 1 },
      { id: 2, nombre: 'gabinete-centauri-lateral', url: '/images/gabinete-centauri-2.webp', orden: 2 },
      { id: 3, nombre: 'gabinete-centauri-frente', url: '/images/gabinete-centauri-3.webp', orden: 3 }
    ],
    especificaciones: [
      { id: 1, titulo: 'Formato', descripcion: 'Mid Tower ATX' },
      { id: 2, titulo: 'Material', descripcion: 'Acero SPCC + vidrio templado 4mm' },
      { id: 3, titulo: 'Ventiladores incluidos', descripcion: '3x 120mm ARGB frontales' },
      { id: 4, titulo: 'Compatibilidad', descripcion: 'ATX, Micro-ATX, Mini-ITX' }
    ],
    atributos: [
      { id: 1, nombre: 'Color', valor: 'Negro' },
      { id: 2, nombre: 'Panel lateral', valor: 'Vidrio templado' },
      { id: 3, nombre: 'Bahías 3.5"', valor: '2' },
      { id: 4, nombre: 'Bahías 2.5"', valor: '3' },
      { id: 5, nombre: 'Peso', valor: '6.2 kg' }
    ],
    preguntas: [
      { id: 1, textoPregunta: '¿Trae los fans instalados de fábrica?', textoRespuesta: 'Sí, los 3 fans frontales ARGB vienen instalados de fábrica.' },
      { id: 2, textoPregunta: '¿Es compatible con placas madre ITX?', textoRespuesta: 'Sí, soporta ATX, Micro-ATX y Mini-ITX.' }
    ]
  },

  // 2. Memoria RAM American Telekinesis
  {
    id: 2,
    nombre: 'Memoria Ram American Telekinesis 8gb 3200 Mhz Ddr4',
    precio: 109900,
    garantia: '24 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'AT-DDR4-8G3200',
    createdAt: '2026-01-15 10:00:00',
    updatedAt: '2026-01-15 10:00:00',
    deletedAt: null,
    marca: 'American Telekinesis',
    categoria: 'Memorias Para Pc',
    oferta: {
      id: 2,
      titulo: 'Oferta Memoria RAM',
      subtitulo: 'Precio especial mes',
      tipoOferta: 'normal',
      tipoDescuento: 'porcentaje',
      descuento: 22.67,
      precioOriginal: 142113,
      precioOferta: 109900,
      createdAt: '2026-01-15 10:00:00',
      updatedAt: '2026-01-15 10:00:00',
      deletedAt: null
    },
    imagenes: [
      { id: 4, nombre: 'memoria-ram-main', url: '/images/memoria-ram.webp', orden: 1 },
      { id: 5, nombre: 'memoria-ram-2', url: '/images/memoria-ram-2.webp', orden: 2 }
    ],
    especificaciones: [
      { id: 5, titulo: 'Capacidad', descripcion: '8GB (1x8GB)' },
      { id: 6, titulo: 'Velocidad', descripcion: '3200 MHz' },
      { id: 7, titulo: 'Tipo', descripcion: 'DDR4 U-DIMM' },
      { id: 8, titulo: 'Voltaje', descripcion: '1.35V' }
    ],
    atributos: [
      { id: 6, nombre: 'Latencia', valor: 'CL16' },
      { id: 7, nombre: 'Disipador', valor: 'Sí, bajo perfil' },
      { id: 8, nombre: 'Compatibilidad', valor: 'Intel / AMD' }
    ],
    preguntas: [
      { id: 3, textoPregunta: '¿Puedo combinarla con otra memoria de otra marca?', textoRespuesta: 'Es recomendable usar memorias idénticas para evitar problemas de compatibilidad, aunque en la mayoría de los casos funciona.' }
    ]
  },

  // 3. Teclado Redragon K552
  {
    id: 3,
    nombre: 'Teclado Mecanico Redragon K552 Kumara 2 Rainbow Red Switches',
    precio: 46600,
    garantia: '12 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'RD-K552-KUM2',
    createdAt: '2026-01-15 10:00:00',
    updatedAt: '2026-01-15 10:00:00',
    deletedAt: null,
    marca: 'Redragon',
    categoria: 'Teclados',
    oferta: {
      id: 3,
      titulo: 'Teclado Gamer',
      subtitulo: 'Oferta especial',
      tipoOferta: 'flash',
      tipoDescuento: 'fijo',
      descuento: 19475,
      precioOriginal: 66075,
      precioOferta: 46600,
      createdAt: '2026-01-15 10:00:00',
      updatedAt: '2026-01-15 10:00:00',
      deletedAt: null
    },
    imagenes: [
      { id: 6, nombre: 'teclado-redragon-main', url: '/images/teclado-redragon.webp', orden: 1 },
      { id: 7, nombre: 'teclado-redragon-2', url: '/images/teclado-redragon-2.webp', orden: 2 },
      { id: 8, nombre: 'teclado-redragon-3', url: '/images/teclado-redragon-3.webp', orden: 3 }
    ],
    especificaciones: [
      { id: 9, titulo: 'Switches', descripcion: 'Mecánicos Red (lineales)' },
      { id: 10, titulo: 'Formato', descripcion: 'TKL (87 teclas)' },
      { id: 11, titulo: 'Iluminación', descripcion: 'RGB Rainbow, 19 modos' },
      { id: 12, titulo: 'Conexión', descripcion: 'Cable USB trenzado, 1.8m' }
    ],
    atributos: [
      { id: 9, nombre: 'Estructura', valor: 'Aluminio' },
      { id: 10, nombre: 'Anti-ghosting', valor: 'Sí, N-Key rollover' },
      { id: 11, nombre: 'Idioma', valor: 'Inglés (US)' }
    ],
    preguntas: [
      { id: 4, textoPregunta: '¿Las teclas son intercambiables (hot-swap)?', textoRespuesta: 'No, este modelo no es hot-swap, los switches vienen soldados.' },
      { id: 5, textoPregunta: '¿Sirve para Mac?', textoRespuesta: 'Sí, funciona por USB estándar aunque algunas teclas multimedia están pensadas para Windows.' }
    ]
  },

  // 4. Gabinete Zer01 Orion
  {
    id: 4,
    nombre: 'Gabinete Gamer Zer01 Gaming Orion 4 Fan Argb',
    precio: 50100,
    garantia: '12 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'ZG-ORION-4F',
    createdAt: '2026-01-20 10:00:00',
    updatedAt: '2026-01-20 10:00:00',
    deletedAt: null,
    marca: 'Zer01 Gaming',
    categoria: 'Gabinetes',
    oferta: {
      id: 4,
      titulo: 'Nuevo Gabinete Orion',
      subtitulo: 'Lanzamiento',
      tipoOferta: 'lanzamiento',
      tipoDescuento: 'porcentaje',
      descuento: 31.32,
      precioOriginal: 72960,
      precioOferta: 50100,
      createdAt: '2026-01-20 10:00:00',
      updatedAt: '2026-01-20 10:00:00',
      deletedAt: null
    },
    imagenes: [
      { id: 9, nombre: 'gabinete-orion-main', url: '/images/gabinete-orion.webp', orden: 1 }
    ],
    especificaciones: [
      { id: 13, titulo: 'Formato', descripcion: 'Mid Tower ATX' },
      { id: 14, titulo: 'Ventiladores incluidos', descripcion: '4x 120mm ARGB' }
    ],
    atributos: [
      { id: 12, nombre: 'Color', valor: 'Negro' },
      { id: 13, nombre: 'Panel frontal', valor: 'Malla' }
    ],
    preguntas: []
  },

  // 5. RTX 4060
  {
    id: 5,
    nombre: 'Placa de Video RTX 4060 8GB GDDR6',
    precio: 429356,
    garantia: '24 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'NV-RTX4060-8G',
    createdAt: '2026-01-25 10:00:00',
    updatedAt: '2026-01-25 10:00:00',
    deletedAt: null,
    marca: 'NVIDIA',
    categoria: 'Placas De Video',
    oferta: {
      id: 5,
      titulo: 'RTX 4060 Oferta',
      subtitulo: 'Precio especial lanzamiento',
      tipoOferta: 'lanzamiento',
      tipoDescuento: 'fijo',
      descuento: 20644,
      precioOriginal: 450000,
      precioOferta: 429356,
      createdAt: '2026-01-25 10:00:00',
      updatedAt: '2026-01-25 10:00:00',
      deletedAt: null
    },
    imagenes: [
      { id: 10, nombre: 'rtx-4060-main', url: '/images/rtx-4060.webp', orden: 1 }
    ],
    especificaciones: [
      { id: 15, titulo: 'Memoria', descripcion: '8GB GDDR6' },
      { id: 16, titulo: 'Bus de memoria', descripcion: '128 bit' },
      { id: 17, titulo: 'Conectores', descripcion: '3x DisplayPort, 1x HDMI' }
    ],
    atributos: [
      { id: 14, nombre: 'Consumo recomendado', valor: '550W PSU' },
      { id: 15, nombre: 'Conector de alimentación', valor: '8 pines' }
    ],
    preguntas: [
      { id: 6, textoPregunta: '¿Necesito una fuente especial?', textoRespuesta: 'Se recomienda una fuente de 550W u 80 Plus Bronze o superior.' }
    ]
  },

  // 6. Mouse Logitech G203 (SIN STOCK)
  {
    id: 6,
    nombre: 'Mouse Gamer Logitech G203 Lightsync',
    precio: 25000,
    garantia: '12 meses',
    stock: 0,
    envioGratis: 0,
    codigoSerie: 'LG-G203-LS',
    createdAt: '2026-01-15 10:00:00',
    updatedAt: '2026-01-15 10:00:00',
    deletedAt: null,
    marca: 'Logitech',
    categoria: 'Mouse',
    oferta: null,
    imagenes: [
      { id: 11, nombre: 'mouse-logitech-main', url: '/images/mouse-logitech.webp', orden: 1 }
    ],
    especificaciones: [
      { id: 18, titulo: 'Sensor', descripcion: 'Óptico, hasta 8000 DPI' },
      { id: 19, titulo: 'Botones programables', descripcion: '6' }
    ],
    atributos: [
      { id: 16, nombre: 'Conexión', valor: 'Cable USB' }
    ],
    preguntas: []
  },

  // 7. Monitor ViewSonic
  {
    id: 7,
    nombre: 'Monitor Gamer 24" 144Hz Full HD',
    precio: 178440,
    garantia: '36 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'VS-24-144FHD',
    createdAt: '2026-01-15 10:00:00',
    updatedAt: '2026-01-15 10:00:00',
    deletedAt: null,
    marca: 'ViewSonic',
    categoria: 'Monitores',
    oferta: {
      id: 6,
      titulo: 'Monitor Gamer 144Hz',
      subtitulo: 'Oferta especial',
      tipoOferta: 'normal',
      tipoDescuento: 'fijo',
      descuento: 11550,
      precioOriginal: 189990,
      precioOferta: 178440,
      createdAt: '2026-01-15 10:00:00',
      updatedAt: '2026-01-15 10:00:00',
      deletedAt: null
    },
    imagenes: [
      { id: 12, nombre: 'monitor-viewsonic-main', url: '/images/monitor-viewsonic.webp', orden: 1 }
    ],
    especificaciones: [
      { id: 20, titulo: 'Panel', descripcion: 'IPS Full HD' },
      { id: 21, titulo: 'Frecuencia', descripcion: '144Hz' },
      { id: 22, titulo: 'Tiempo de respuesta', descripcion: '1ms' }
    ],
    atributos: [
      { id: 17, nombre: 'Conectores', valor: 'HDMI, DisplayPort' }
    ],
    preguntas: []
  },

  // 8. Fuente Corsair 750W
  {
    id: 8,
    nombre: 'Fuente de Poder 750W 80 Plus Gold',
    precio: 105143,
    garantia: '60 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'CR-750-GOLD',
    createdAt: '2026-01-15 10:00:00',
    updatedAt: '2026-01-15 10:00:00',
    deletedAt: null,
    marca: 'Corsair',
    categoria: 'Fuentes',
    oferta: {
      id: 7,
      titulo: 'Fuente 750W Gold',
      subtitulo: 'Precio especial',
      tipoOferta: 'normal',
      tipoDescuento: 'porcentaje',
      descuento: 18.43,
      precioOriginal: 128900,
      precioOferta: 105143,
      createdAt: '2026-01-15 10:00:00',
      updatedAt: '2026-01-15 10:00:00',
      deletedAt: null
    },
    imagenes: [
      { id: 13, nombre: 'fuente-corsair-main', url: '/images/fuente-corsair.webp', orden: 1 }
    ],
    especificaciones: [
      { id: 23, titulo: 'Potencia', descripcion: '750W' },
      { id: 24, titulo: 'Certificación', descripcion: '80 Plus Gold' },
      { id: 25, titulo: 'Modularidad', descripcion: 'Full modular' }
    ],
    atributos: [
      { id: 18, nombre: 'Ventilador', valor: '135mm silencioso' }
    ],
    preguntas: []
  },

  // 9. SSD Kingston 1TB
  {
    id: 9,
    nombre: 'SSD Kingston NV2 1TB PCIe 4.0',
    precio: 68990,
    garantia: '36 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'KG-NV2-1TB',
    createdAt: '2026-02-01 10:00:00',
    updatedAt: '2026-02-01 10:00:00',
    deletedAt: null,
    marca: 'Kingston',
    categoria: 'Almacenamiento',
    oferta: {
      id: 8,
      titulo: 'SSD NVMe 1TB',
      subtitulo: 'Oferta especial',
      tipoOferta: 'normal',
      tipoDescuento: 'porcentaje',
      descuento: 15.0,
      precioOriginal: 81165,
      precioOferta: 68990,
      createdAt: '2026-02-01 10:00:00',
      updatedAt: '2026-02-01 10:00:00',
      deletedAt: null
    },
    imagenes: [
      { id: 14, nombre: 'ssd-kingston-main', url: '/images/ssd-kingston.webp', orden: 1 }
    ],
    especificaciones: [
      { id: 26, titulo: 'Capacidad', descripcion: '1TB' },
      { id: 27, titulo: 'Interfaz', descripcion: 'PCIe 4.0 NVMe' },
      { id: 28, titulo: 'Velocidad lectura', descripcion: '3500 MB/s' },
      { id: 29, titulo: 'Velocidad escritura', descripcion: '2100 MB/s' }
    ],
    atributos: [
      { id: 19, nombre: 'Factor de forma', valor: 'M.2 2280' },
      { id: 20, nombre: 'Tipo', valor: 'SSD Interno' }
    ],
    preguntas: []
  },

  // 10. Procesador AMD Ryzen 5
  {
    id: 10,
    nombre: 'Procesador AMD Ryzen 5 5600X 6-Core 4.6GHz',
    precio: 189990,
    garantia: '36 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'AMD-R5-5600X',
    createdAt: '2026-02-05 10:00:00',
    updatedAt: '2026-02-05 10:00:00',
    deletedAt: null,
    marca: 'AMD',
    categoria: 'Procesadores',
    oferta: null,
    imagenes: [
      { id: 15, nombre: 'amd-ryzen-main', url: '/images/amd-ryzen.webp', orden: 1 }
    ],
    especificaciones: [
      { id: 30, titulo: 'Núcleos', descripcion: '6' },
      { id: 31, titulo: 'Hilos', descripcion: '12' },
      { id: 32, titulo: 'Frecuencia base', descripcion: '3.7 GHz' },
      { id: 33, titulo: 'Frecuencia turbo', descripcion: '4.6 GHz' }
    ],
    atributos: [
      { id: 21, nombre: 'Socket', valor: 'AM4' },
      { id: 22, nombre: 'TDP', valor: '65W' },
      { id: 23, nombre: 'Arquitectura', valor: 'Zen 3' }
    ],
    preguntas: []
  },

  // 11. Placa Madre MSI B550
  {
    id: 11,
    nombre: 'Placa Madre MSI B550-A PRO',
    precio: 129990,
    garantia: '36 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'MSI-B550-PRO',
    createdAt: '2026-02-10 10:00:00',
    updatedAt: '2026-02-10 10:00:00',
    deletedAt: null,
    marca: 'MSI',
    categoria: 'Placas Madre',
    oferta: null,
    imagenes: [
      { id: 16, nombre: 'msi-b550-main', url: '/images/msi-b550.webp', orden: 1 }
    ],
    especificaciones: [
      { id: 34, titulo: 'Socket', descripcion: 'AM4' },
      { id: 35, titulo: 'Chipset', descripcion: 'B550' },
      { id: 36, titulo: 'Factor de forma', descripcion: 'ATX' }
    ],
    atributos: [
      { id: 24, nombre: 'RAM máxima', valor: '128GB' },
      { id: 25, nombre: 'Ranuras PCIe', valor: '2x PCIe x16' },
      { id: 26, nombre: 'Puertos USB', valor: '8' }
    ],
    preguntas: []
  },

  // 12. Auriculares HyperX Cloud
  {
    id: 12,
    nombre: 'Auriculares HyperX Cloud Stinger 2',
    precio: 45990,
    garantia: '24 meses',
    stock: 1,
    envioGratis: 1,
    codigoSerie: 'HX-CS2-BK',
    createdAt: '2026-02-15 10:00:00',
    updatedAt: '2026-02-15 10:00:00',
    deletedAt: null,
    marca: 'HyperX',
    categoria: 'Auriculares',
    oferta: {
      id: 9,
      titulo: 'Auriculares HyperX',
      subtitulo: 'Precio especial',
      tipoOferta: 'flash',
      tipoDescuento: 'porcentaje',
      descuento: 20.0,
      precioOriginal: 57488,
      precioOferta: 45990,
      createdAt: '2026-02-15 10:00:00',
      updatedAt: '2026-02-15 10:00:00',
      deletedAt: null
    },
    imagenes: [
      { id: 17, nombre: 'hyperx-cloud-main', url: '/images/hyperx-cloud.webp', orden: 1 }
    ],
    especificaciones: [
      { id: 37, titulo: 'Tipo', descripcion: 'Over-ear' },
      { id: 38, titulo: 'Conexión', descripcion: 'Cable 3.5mm' },
      { id: 39, titulo: 'Micrófono', descripcion: 'Sí, con cancelación de ruido' }
    ],
    atributos: [
      { id: 27, nombre: 'Peso', valor: '275g' },
      { id: 28, nombre: 'Color', valor: 'Negro' }
    ],
    preguntas: []
  }
];

// ============================================
// FUNCIONES DE CONSULTA
// ============================================

/**
 * Simula GET /api/productos/:id
 * Retorna un producto completo con todas sus relaciones
 */
export function getProductById(id) {
  const product = SAMPLE_PRODUCTS.find((p) => p.id === Number(id));
  if (!product) return null;
  
  // Retornar una copia profunda para evitar mutaciones
  return JSON.parse(JSON.stringify(product));
}

/**
 * Simula GET /api/productos
 * Retorna todos los productos (sin relaciones pesadas para listados)
 */
export function getAllProducts() {
  return SAMPLE_PRODUCTS.map(product => ({
    id: product.id,
    nombre: product.nombre,
    precio: product.precio,
    stock: product.stock,
    envioGratis: product.envioGratis,
    marca: product.marca,
    categoria: product.categoria,
    // Solo la primera imagen para el listado
    imagen: product.imagenes.length > 0 ? product.imagenes[0].url : '/images/product-placeholder.webp',
    // Si tiene oferta
    oferta: product.oferta ? {
      precioOferta: product.oferta.precioOferta,
      precioOriginal: product.oferta.precioOriginal, 
      descuento: product.oferta.descuento
    } : null
  }));
}

/**
 * Simula GET /api/productos?categoria=:categoria
 * Filtra productos por categoría
 */
export function getProductsByCategory(categoria) {
  return getAllProducts().filter(p => 
    p.categoria.toLowerCase() === categoria.toLowerCase()
  );
}

/**
 * Simula GET /api/productos?marca=:marca
 * Filtra productos por marca
 */
export function getProductsByBrand(marca) {
  return getAllProducts().filter(p => 
    p.marca.toLowerCase() === marca.toLowerCase()
  );
}

/**
 * Simula GET /api/productos/en-stock
 * Retorna solo productos con stock disponible
 */
export function getProductsInStock() {
  return getAllProducts().filter(p => p.stock === 1);
}

/**
 * Simula GET /api/productos/en-oferta
 * Retorna solo productos en oferta
 */
export function getProductsOnSale() {
  return getAllProducts().filter(p => p.oferta !== null);
}

// ============================================
// FUNCIONES PARA ADMIN (CRUD)
// ============================================

/**
 * Simula POST /api/productos
 * Agrega un nuevo producto
 */
export function addProduct(productData) {
  const newId = SAMPLE_PRODUCTS.length + 1;
  const newProduct = {
    id: newId,
    ...productData,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    deletedAt: null
  };
  SAMPLE_PRODUCTS.push(newProduct);
  return newProduct;
}

/**
 * Simula PUT /api/productos/:id
 * Actualiza un producto existente
 */
export function updateProduct(id, productData) {
  const index = SAMPLE_PRODUCTS.findIndex(p => p.id === Number(id));
  if (index === -1) return null;
  
  SAMPLE_PRODUCTS[index] = {
    ...SAMPLE_PRODUCTS[index],
    ...productData,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
  };
  return SAMPLE_PRODUCTS[index];
}

/**
 * Simula DELETE /api/productos/:id (soft delete)
 * Marca un producto como eliminado (deletedAt)
 */
export function deleteProduct(id) {
  const index = SAMPLE_PRODUCTS.findIndex(p => p.id === Number(id));
  if (index === -1) return false;
  
  SAMPLE_PRODUCTS[index].deletedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  return true;
}