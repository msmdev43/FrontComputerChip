import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCategorias,
  getCategoriaById,
  getCategoriaConProductos,
  getCategoriaPorNombre,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  restaurarCategoria,
  eliminarCategoriaPermanente,
} from '../api/categorias';

/**
 * Hook para gestionar categorías.
 *
 * @param {Object} options
 * @param {boolean} options.autoLoad     - Carga categorías al montar (default: true)
 * @param {number}  options.categoriaId  - Si se pasa, carga esa categoría automáticamente
 * @param {boolean} options.conProductos - Si es true y hay categoriaId, trae detalle con productos
 *
 * @returns {{
 *   categorias: Array,
 *   categoria: Object|null,
 *   loading: boolean,
 *   error: string|null,
 *   total: number,
 *   fetchCategorias: Function,
 *   fetchCategoriaById: Function,
 *   fetchCategoriaConProductos: Function,
 *   fetchCategoriaPorNombre: Function,
 *   addCategoria: Function,
 *   editCategoria: Function,
 *   removeCategoria: Function,
 *   restoreCategoria: Function,
 *   removeCategoriaPermanente: Function,
 *   clearError: Function,
 * }}
 */
export const useCategorias = (options = {}) => {
  const {
    autoLoad = true,
    categoriaId = null,
    conProductos = false,
  } = options;

  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // Helper interno para manejo de errores
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

  // ============================================
  // GET: Listar todas las categorías
  // ============================================
  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategorias();
      setCategorias(data);
      return data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ============================================
  // GET: Por ID
  // ============================================
  const fetchCategoriaById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategoriaById(id);
      setCategoria(data);
      return data;
    } catch (err) {
      setCategoria(null);
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ============================================
  // GET: Con productos (detalle)
  // ============================================
  const fetchCategoriaConProductos = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategoriaConProductos(id);
      setCategoria(data);
      return data;
    } catch (err) {
      setCategoria(null);
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ============================================
  // GET: Por nombre
  // ============================================
  const fetchCategoriaPorNombre = useCallback(async (nombre) => {
    if (!nombre?.trim()) {
      setError('El nombre es requerido');
      return null;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getCategoriaPorNombre(nombre);
      setCategoria(data);
      return data;
    } catch (err) {
      setCategoria(null);
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ============================================
  // POST: Crear
  // ============================================
  const addCategoria = useCallback(async (nombre) => {
    try {
      setLoading(true);
      setError(null);
      const nueva = await crearCategoria(nombre);
      setCategorias((prev) => [...prev, nueva]);
      return nueva;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ============================================
  // PUT: Actualizar
  // ============================================
  const editCategoria = useCallback(async (id, nombre) => {
    try {
      setLoading(true);
      setError(null);
      await actualizarCategoria(id, nombre);

      // Actualización optimista del state
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, nombre } : c
        )
      );
      setCategoria((prev) =>
        prev?.id === id ? { ...prev, nombre } : prev
      );
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ============================================
  // DELETE: Soft delete
  // ============================================
  const removeCategoria = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await eliminarCategoria(id);

      // La sacamos del listado (soft delete → ya no está activa)
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      setCategoria((prev) => (prev?.id === id ? null : prev));
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ============================================
  // PATCH: Restaurar
  // ============================================
  const restoreCategoria = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await restaurarCategoria(id);

      // Refrescamos para traer la categoría restaurada
      await fetchCategorias();
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError, fetchCategorias]);

  // ============================================
  // DELETE: Permanente
  // ============================================
  const removeCategoriaPermanente = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await eliminarCategoriaPermanente(id);

      setCategorias((prev) => prev.filter((c) => c.id !== id));
      setCategoria((prev) => (prev?.id === id ? null : prev));
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ============================================
  // Auto-load al montar
  // ============================================
  const loadInitialData = useCallback(() => {
    if (categoriaId) {
      return conProductos
        ? fetchCategoriaConProductos(categoriaId)
        : fetchCategoriaById(categoriaId);
    }

    if (autoLoad) {
      return fetchCategorias();
    }

    return undefined;
  }, [autoLoad, categoriaId, conProductos, fetchCategorias, fetchCategoriaById, fetchCategoriaConProductos]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadInitialData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadInitialData]);

  // ============================================
  // Valor derivado: total de categorías
  // ============================================
  const total = useMemo(() => categorias.length, [categorias]);

  return {
    // State
    categorias,
    categoria,
    loading,
    error,
    total,

    // Actions
    fetchCategorias,
    fetchCategoriaById,
    fetchCategoriaConProductos,
    fetchCategoriaPorNombre,
    addCategoria,
    editCategoria,
    removeCategoria,
    restoreCategoria,
    removeCategoriaPermanente,
    clearError,
  };
};