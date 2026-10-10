// Formato común para los DTO del listado, detalle y carrito.
export const normalizeText = value => String(value ?? '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');

const names = value => (Array.isArray(value) ? value : [value])
  .map(item => typeof item === 'string' ? item : item?.nombre)
  .filter(Boolean);
const unique = values => [...new Map(values.map(value => [normalizeText(value), value])).values()];
const amount = value => value !== '' && value != null && Number.isFinite(Number(value))
  ? Math.max(0, Number(value)) : null;
export const getStock = product => Math.floor(amount(product?.stock) ?? 0);
export const categoryKey = value => {
  const key = normalizeText(value);
  return ({ 'tarjetas graficas': 'placas de video', 'placas base': 'placas madre',
    'memorias ram': 'memorias para pc' })[key] || key;
};

export function getProductPricing(product = {}) {
  const offer = product.oferta && typeof product.oferta === 'object' ? product.oferta : null;
  const base = amount(product.precio) ?? 0;
  const original = amount(offer?.precioOriginal) ?? amount(product.precioOriginal) ?? base;
  const candidate = amount(offer?.precioOferta) ?? amount(product.precioOferta);
  const enabled = product.oferta !== false && product.isOnSale !== false &&
    product.enOferta !== false && offer?.activo !== false;
  const hasOffer = enabled && candidate !== null && candidate > 0 && candidate < original;
  const price = hasOffer ? candidate : base;
  const savings = hasOffer ? original - price : 0;
  return { hasOffer, price, originalPrice: hasOffer ? original : base, savings,
    discountPercent: hasOffer ? Math.round(savings / original * 100) : 0 };
}

export function normalizeProduct(product = {}) {
  const categories = unique([
    ...names(product.categoria), ...names(product.categorias),
    ...(product.categoriasProductos || []).flatMap(row => names(row.categorias || row.categoria)),
  ]);
  const brands = unique([
    ...names(product.marca), ...names(product.marcas),
    ...(product.productosMarcas || []).flatMap(row => names(row.marcas || row.marca)),
  ]);
  const images = (Array.isArray(product.imagenes) ? product.imagenes : [])
    .map((img, index) => typeof img === 'string' ? { url: img, orden: index } : img)
    .filter(img => img?.url).sort((a, b) => (a.orden || 0) - (b.orden || 0));
  const pricing = getProductPricing(product);
  return {
    ...product,
    nombre: product.nombre || 'Producto', stock: getStock(product),
    categorias: categories, marcas: brands,
    categoria: categories[0] || '', marca: brands[0] || '',
    imagenes: images, imagen: product.imagen || images[0]?.url || '/images/product-placeholder.webp',
    envioGratis: [true, 1, '1'].includes(product.envioGratis) ? 1 : 0,
    precio: pricing.hasOffer ? pricing.originalPrice : pricing.price,
    oferta: pricing.hasOffer ? { ...(typeof product.oferta === 'object' ? product.oferta : {}),
      precioOriginal: pricing.originalPrice, precioOferta: pricing.price,
      descuento: pricing.discountPercent } : null,
  };
}

export function selectProducts(products, params) {
  const words = normalizeText(params.get('q')).split(' ').filter(Boolean);
  const category = categoryKey(params.get('categoria'));
  const brand = normalizeText(params.get('marca'));
  const min = amount(params.get('min'));
  const max = amount(params.get('max'));
  const filter = params.get('filter');
  const selected = products.filter(product => {
    if (product.deletedAt) return false;
    const pricing = getProductPricing(product);
    const haystack = normalizeText([product.nombre, product.codigoSerie,
      ...product.categorias, ...product.marcas].join(' '));
    return words.every(word => haystack.includes(word)) &&
      (!category || product.categorias.some(name => categoryKey(name) === category)) &&
      (!brand || product.marcas.some(name => normalizeText(name) === brand)) &&
      (min === null || pricing.price >= min) && (max === null || pricing.price <= max) &&
      (filter !== 'instock' || product.stock > 0) &&
      (filter !== 'outofstock' || product.stock === 0) &&
      (filter !== 'on-sale' || pricing.hasOffer);
  });
  const sort = params.get('sort');
  return selected.sort((a, b) => {
    const pa = getProductPricing(a), pb = getProductPricing(b);
    if (sort === 'price-low') return pa.price - pb.price;
    if (sort === 'price-high') return pb.price - pa.price;
    if (sort === 'savings') return pb.savings - pa.savings;
    if (sort === 'name') return a.nombre.localeCompare(b.nombre, 'es');
    return 0;
  });
}
