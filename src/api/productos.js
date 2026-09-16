import { apiClient } from './client';

const BASE = '/productos';

// ============================================
// GET — Listados y filtros
// ============================================

// GET: api/productos
export const getProductos = async () => {
  const { data } = await apiClient.get(BASE);
  return data;
};

// GET: api/productos/{id}
export const getProductoById = async (id) => {
  const { data } = await apiClient.get(`${BASE}/${id}`);
  return data;
};

// GET: api/productos/categoria/{categoriaId}
export const getProductosPorCategoria = async (categoriaId) => {
  const { data } = await apiClient.get(`${BASE}/categoria/${categoriaId}`);
  return data;
};

// GET: api/productos/marca/{marcaId}
export const getProductosPorMarca = async (marcaId) => {
  const { data } = await apiClient.get(`${BASE}/marca/${marcaId}`);
  return data;
};

// GET: api/productos/precio?min=&max=
export const getProductosPorPrecio = async (min, max) => {
  const { data } = await apiClient.get(`${BASE}/precio`, {
    params: { min, max },
  });
  return data;
};

// GET: api/productos/stock/{inStock}
export const getProductosPorStock = async (inStock) => {
  const { data } = await apiClient.get(`${BASE}/stock/${inStock}`);
  return data;
};

// GET: api/productos/oferta
export const getProductosEnOferta = async () => {
  const { data } = await apiClient.get(`${BASE}/oferta`);
  return data;
};

// GET: api/productos/nuevos?days=7
export const getProductosNuevos = async (days = 7) => {
  const { data } = await apiClient.get(`${BASE}/nuevos`, {
    params: { days },
  });
  return data;
};

// GET: api/productos/buscar?q=...
export const buscarProductos = async (q) => {
  const { data } = await apiClient.get(`${BASE}/buscar`, {
    params: { q },
  });
  return data;
};

// GET: api/productos/relacionados/{id}
export const getProductosRelacionados = async (id) => {
  const { data } = await apiClient.get(`${BASE}/relacionados/${id}`);
  return data;
};

// GET: api/productos/stats
export const getProductosStats = async () => {
  const { data } = await apiClient.get(`${BASE}/stats`);
  return data;
};

// ============================================
// POST / PUT / PATCH / DELETE — Admin
// ============================================

// POST: api/productos
export const crearProducto = async (payload) => {
  const { data } = await apiClient.post(BASE, payload);
  return data;
};

// PUT: api/productos/{id}
export const actualizarProducto = async (id, payload) => {
  const { data } = await apiClient.put(`${BASE}/${id}`, payload);
  return data;
};

// PATCH: api/productos/{id}/stock  → body: boolean
export const actualizarStock = async (id, stock) => {
  const { data } = await apiClient.patch(`${BASE}/${id}/stock`, stock);
  return data;
};

// DELETE: api/productos/{id}  (soft delete)
export const eliminarProducto = async (id) => {
  await apiClient.delete(`${BASE}/${id}`);
};

// POST: api/productos/{id}/restaurar
export const restaurarProducto = async (id) => {
  const { data } = await apiClient.post(`${BASE}/${id}/restaurar`);
  return data;
};

// POST: api/productos/{id}/categorias  → body: [ids]
export const agregarCategoriasAProducto = async (id, categoriaIds) => {
  const { data } = await apiClient.post(
    `${BASE}/${id}/categorias`,
    categoriaIds
  );
  return data;
};

// DELETE: api/productos/{id}/categorias  → body: [ids]
export const quitarCategoriasDeProducto = async (id, categoriaIds) => {
  const { data } = await apiClient.delete(`${BASE}/${id}/categorias`, {
    data: categoriaIds, // axios requiere `data` para DELETE con body
  });
  return data;
};

// POST: api/productos/{id}/marcas
export const agregarMarcasAProducto = async (id, marcaIds) => {
  const { data } = await apiClient.post(`${BASE}/${id}/marcas`, marcaIds);
  return data;
};

// DELETE: api/productos/{id}/marcas
export const quitarMarcasDeProducto = async (id, marcaIds) => {
  const { data } = await apiClient.delete(`${BASE}/${id}/marcas`, {
    data: marcaIds,
  });
  return data;
};

export const getImagenPrincipal = (producto) => {
  if (!producto) return null;
  if (producto.imagenes?.length > 0) return producto.imagenes[0];
  if (producto.imagenPrincipal) return producto.imagenPrincipal; // por si viene del mini
  return null;
};