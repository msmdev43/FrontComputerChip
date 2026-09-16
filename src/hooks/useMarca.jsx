import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getMarcas,
  getMarcaById,
  getMarcaConProductos,
  getMarcaPorNombre,
  crearMarca,
  actualizarMarca,
  eliminarMarca,
  restaurarMarca,
  eliminarMarcaPermanente,
} from '../api/marcas';

/**
 * Hook para gestionar marcas.
 *
 * @param {Object}  options
 * @param {boolean} options.autoLoad      - Carga marcas al montar (default: true)
 * @param {number}  options.marcaId       - Si se pasa, carga esa marca puntual
 * @param {boolean} options.conProductos  - Si es true y hay marcaId, trae detalle con productos
 *
 * @returns {{
 *   marcas: Array,
 *   marca: Object|null,
 *   loading: boolean,
 *   error: string|null,
 *   total: number,
 *   fetchMarcas: Function,
 *   fetchMarcaById: Function,
 *   fetchMarcaConProductos: Function,
 *   fetchMarcaPorNombre: Function,
 *   addMarca: Function,
 *   editMarca: Function,
 *   removeMarca: Function,
 *   restoreMarca: Function,
 *   removeMarcaPermanente: Function,
 *   clearError: Function,
 * }}
 */
export const useMarcas = (options = {}) => {
  const {
    autoLoad = true,
    marcaId = null,
    conProductos = false,
  } = options;

  const [marcas, setMarcas] = useState([]);
  const [marca, setMarca] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // Helpers
  // ============================================
  const handleError = useCallback((err) => {
    const mensaje =
      err?.mensaje ||
      err?.response?.data ||
      err?.message ||
      'Error al procesar la solicitud';
    setError(mensaje);
    return null;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const withLoading = useCallback(
    async (fn) => {
      try {
        setLoading(true);
        setError(null);
        return await fn();
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // ============================================
  // GETs
  // ============================================
  const fetchMarcas = useCallback(
    () =>
      withLoading(async () => {
        const data = await getMarcas();
        setMarcas(data);
        return data;
      }),
    [withLoading]
  );

  const fetchMarcaById = useCallback(
    (id) =>
      withLoading(async () => {
        const data = await getMarcaById(id);
        setMarca(data);
        return data;
      }),
    [withLoading]
  );

  const fetchMarcaConProductos = useCallback(
    (id) =>
      withLoading(async () => {
        const data = await getMarcaConProductos(id);
        setMarca(data);
        return data;
      }),
    [withLoading]
  );

  const fetchMarcaPorNombre = useCallback(
    (nombre) =>
      withLoading(async () => {
        if (!nombre?.trim()) {
          setError('El nombre es requerido');
          return null;
        }
        const data = await getMarcaPorNombre(nombre);
        setMarca(data);
        return data;
      }),
    [withLoading]
  );

  // ============================================
  // Mutaciones
  // ============================================
  const addMarca = useCallback(
    (nombre) =>
      withLoading(async () => {
        const nueva = await crearMarca(nombre);
        setMarcas((prev) => [...prev, nueva]);
        return nueva;
      }),
    [withLoading]
  );

  const editMarca = useCallback(
    (id, nombre) =>
      withLoading(async () => {
        await actualizarMarca(id, nombre);

        // Actualización optimista
        setMarcas((prev) =>
          prev.map((m) => (m.id === id ? { ...m, nombre } : m))
        );
        setMarca((prev) => (prev?.id === id ? { ...prev, nombre } : prev));
        return true;
      }),
    [withLoading]
  );

  const removeMarca = useCallback(
    (id) =>
      withLoading(async () => {
        await eliminarMarca(id);

        // Soft delete → la saco del listado
        setMarcas((prev) => prev.filter((m) => m.id !== id));
        setMarca((prev) => (prev?.id === id ? null : prev));
        return true;
      }),
    [withLoading]
  );

  const restoreMarca = useCallback(
    (id) =>
      withLoading(async () => {
        await restaurarMarca(id);
        // Refresco porque el endpoint no devuelve la entidad
        await fetchMarcas();
        return true;
      }),
    [withLoading, fetchMarcas]
  );

  const removeMarcaPermanente = useCallback(
    (id) =>
      withLoading(async () => {
        await eliminarMarcaPermanente(id);
        setMarcas((prev) => prev.filter((m) => m.id !== id));
        setMarca((prev) => (prev?.id === id ? null : prev));
        return true;
      }),
    [withLoading]
  );

  // ============================================
  // Auto-load al montar
  // ============================================
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (marcaId) {
        conProductos
          ? fetchMarcaConProductos(marcaId)
          : fetchMarcaById(marcaId);
      } else if (autoLoad) {
        fetchMarcas();
      }
    }, 0);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marcaId, conProductos, autoLoad]);

  // ============================================
  // Derivados
  // ============================================
  const total = useMemo(() => marcas.length, [marcas]);

  return {
    // State
    marcas,
    marca,
    loading,
    error,
    total,

    // Actions
    fetchMarcas,
    fetchMarcaById,
    fetchMarcaConProductos,
    fetchMarcaPorNombre,
    addMarca,
    editMarca,
    removeMarca,
    restoreMarca,
    removeMarcaPermanente,
    clearError,
  };
};