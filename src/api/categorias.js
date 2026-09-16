import { apiClient } from './client';

/**
 * Base: /api/categoria
 */
const BASE = '/categoria';

// ============================================
// GET: api/categoria
// Lista todas las categorías activas
// ============================================
export const getCategorias = async () => {
  const { data } = await apiClient.get(BASE);
  return data; // CategoriaResponse[]
};

// ============================================
// GET: api/categoria/{id}
// ============================================
export const getCategoriaById = async (id) => {
  const { data } = await apiClient.get(`${BASE}/${id}`);
  return data; // CategoriaResponse
};

// ============================================
// GET: api/categoria/{id}/detalle
// Categoría con sus productos incluidos
// ============================================
export const getCategoriaConProductos = async (id) => {
  const { data } = await apiClient.get(`${BASE}/${id}/detalle`);
  return data; // CategoriaDetailResponse
};

// ============================================
// GET: api/categoria/buscar?nombre=...
// ============================================
export const getCategoriaPorNombre = async (nombre) => {
  const { data } = await apiClient.get(`${BASE}/buscar`, {
    params: { nombre },
  });
  return data; // CategoriaResponse
};

// ============================================
// POST: api/categoria
// Body: { nombre: string }
// ============================================
export const crearCategoria = async (nombre) => {
  const { data } = await apiClient.post(BASE, { nombre });
  return data; // CategoriaResponse
};

// ============================================
// PUT: api/categoria/{id}
// Body: { nombre: string }
// ============================================
export const actualizarCategoria = async (id, nombre) => {
  await apiClient.put(`${BASE}/${id}`, { nombre });
  // 204 No Content → no devuelve nada
};

// ============================================
// DELETE: api/categoria/{id}  (soft delete)
// ============================================
export const eliminarCategoria = async (id) => {
  await apiClient.delete(`${BASE}/${id}`);
};

// ============================================
// PATCH: api/categoria/{id}/restore
// ============================================
export const restaurarCategoria = async (id) => {
  await apiClient.patch(`${BASE}/${id}/restore`);
};

// ============================================
// DELETE: api/categoria/{id}/permanente
// ============================================
export const eliminarCategoriaPermanente = async (id) => {
  await apiClient.delete(`${BASE}/${id}/permanente`);
};