import { apiClient } from './client';

const BASE = '/Marca'; // ⚠️ coincide con [controller] = MarcaController

// ============================================
// GET: api/marca
// ============================================
export const getMarcas = async () => {
  const { data } = await apiClient.get(BASE);
  return data; // MarcaResponse[]
};

// ============================================
// GET: api/marca/{id}
// ============================================
export const getMarcaById = async (id) => {
  const { data } = await apiClient.get(`${BASE}/${id}`);
  return data;
};

// ============================================
// GET: api/marca/{id}/detalle
// Marca con sus productos
// ============================================
export const getMarcaConProductos = async (id) => {
  const { data } = await apiClient.get(`${BASE}/${id}/detalle`);
  return data; // MarcaDetailResponse
};

// ============================================
// GET: api/marca/buscar?nombre=...
// ============================================
export const getMarcaPorNombre = async (nombre) => {
  const { data } = await apiClient.get(`${BASE}/buscar`, {
    params: { nombre },
  });
  return data;
};

// ============================================
// POST: api/marca
// ============================================
export const crearMarca = async (nombre) => {
  const { data } = await apiClient.post(BASE, { nombre });
  return data;
};

// ============================================
// PUT: api/marca/{id}
// ============================================
export const actualizarMarca = async (id, nombre) => {
  await apiClient.put(`${BASE}/${id}`, { nombre });
  // 204 No Content
};

// ============================================
// DELETE: api/marca/{id}  (soft delete)
// ============================================
export const eliminarMarca = async (id) => {
  await apiClient.delete(`${BASE}/${id}`);
};

// ============================================
// PATCH: api/marca/{id}/restore
// ============================================
export const restaurarMarca = async (id) => {
  await apiClient.patch(`${BASE}/${id}/restore`);
};

// ============================================
// DELETE: api/marca/{id}/permanente
// ============================================
export const eliminarMarcaPermanente = async (id) => {
  await apiClient.delete(`${BASE}/${id}/permanente`);
};