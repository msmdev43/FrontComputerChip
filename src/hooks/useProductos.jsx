import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getProductos,
  getProductoById,
  getProductosPorCategoria,
  getProductosPorMarca,
  getProductosPorPrecio,
  getProductosPorStock,
  getProductosEnOferta,
  getProductosNuevos,
  buscarProductos,
  getProductosRelacionados,
  getProductosStats,
  crearProducto,
  actualizarProducto,
  actualizarStock,
  eliminarProducto,
  restaurarProducto,
  agregarCategoriasAProducto,
  quitarCategoriasDeProducto,
  agregarMarcasAProducto,
  quitarMarcasDeProducto,
} from "../api/productos";

/**
 * Hook de productos.
 *
 * @param {Object} options
 * @param {number}  options.categoriaId  - Si se pasa, carga productos de esa categoría
 * @param {boolean} options.autoLoad     - Carga automática al montar (default: true)
 * @param {Object}  options.filtros      - { marcaId, precioMin, precioMax, inStock, oferta, nuevos }
 * @param {string}  options.searchQuery  - Si se pasa, busca por texto
 *
 * @returns {{
 *   productos: Array,
 *   producto: Object|null,
 *   stats: Object|null,
 *   loading: boolean,
 *   error: string|null,
 *   total: number,
 *   filtrosActivos: boolean,
 *   fetchProductos: Function,
 *   fetchProductoById: Function,
 *   fetchProductosPorCategoria: Function,
 *   fetchProductosPorMarca: Function,
 *   fetchProductosPorPrecio: Function,
 *   fetchProductosPorStock: Function,
 *   fetchProductosEnOferta: Function,
 *   fetchProductosNuevos: Function,
 *   fetchBuscarProductos: Function,
 *   fetchProductosRelacionados: Function,
 *   fetchProductosStats: Function,
 *   addProducto: Function,
 *   editProducto: Function,
 *   editStock: Function,
 *   removeProducto: Function,
 *   restoreProducto: Function,
 *   addCategorias: Function,
 *   removeCategorias: Function,
 *   addMarcas: Function,
 *   removeMarcas: Function,
 *   clearError: Function,
 * }}
 */
export const useProductos = (options = {}) => {
  const {
    categoriaId = null,
    autoLoad = true,
    filtros = null,
    searchQuery = null,
  } = options;

  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // Helper de errores
  // ============================================
  const handleError = useCallback((err) => {
    const mensaje =
      err?.mensaje ||
      err?.response?.data ||
      err?.message ||
      "Error al procesar la solicitud";
    setError(mensaje);
    return null;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ============================================
  // Wrapper común para simplificar cada acción
  // ============================================
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
    [handleError],
  );

  // ============================================
  // GETs
  // ============================================
  const fetchProductos = useCallback(
    () =>
      withLoading(async () => {
        const data = await getProductos();
        setProductos(data);
        return data;
      }),
    [withLoading],
  );

  const fetchProductoById = useCallback(
    (id) =>
      withLoading(async () => {
        const data = await getProductoById(id);
        setProducto(data);
        return data;
      }),
    [withLoading],
  );

  const fetchProductosPorCategoria = useCallback(
    (id) =>
      withLoading(async () => {
        const data = await getProductosPorCategoria(id);
        setProductos(data);
        return data;
      }),
    [withLoading],
  );

  const fetchProductosPorMarca = useCallback(
    (id) =>
      withLoading(async () => {
        const data = await getProductosPorMarca(id);
        setProductos(data);
        return data;
      }),
    [withLoading],
  );

  const fetchProductosPorPrecio = useCallback(
    (min, max) =>
      withLoading(async () => {
        const data = await getProductosPorPrecio(min, max);
        setProductos(data);
        return data;
      }),
    [withLoading],
  );

  const fetchProductosPorStock = useCallback(
    (inStock) =>
      withLoading(async () => {
        const data = await getProductosPorStock(inStock);
        setProductos(data);
        return data;
      }),
    [withLoading],
  );

  const fetchProductosEnOferta = useCallback(
    () =>
      withLoading(async () => {
        const data = await getProductosEnOferta();
        setProductos(data);
        return data;
      }),
    [withLoading],
  );

  const fetchProductosNuevos = useCallback(
    (days = 7) =>
      withLoading(async () => {
        const data = await getProductosNuevos(days);
        setProductos(data);
        return data;
      }),
    [withLoading],
  );

  const fetchBuscarProductos = useCallback(
    (q) =>
      withLoading(async () => {
        const data = await buscarProductos(q);
        setProductos(data);
        return data;
      }),
    [withLoading],
  );

  const fetchProductosRelacionados = useCallback(
    (id) =>
      withLoading(async () => {
        const data = await getProductosRelacionados(id);
        setProductos(data);
        return data;
      }),
    [withLoading],
  );

  const fetchProductosStats = useCallback(
    () =>
      withLoading(async () => {
        const data = await getProductosStats();
        setStats(data);
        return data;
      }),
    [withLoading],
  );

  // ============================================
  // Mutaciones
  // ============================================
  const addProducto = useCallback(
    (payload) =>
      withLoading(async () => {
        const nuevo = await crearProducto(payload);
        setProductos((prev) => [...prev, nuevo]);
        return nuevo;
      }),
    [withLoading],
  );

  const editProducto = useCallback(
    (id, payload) =>
      withLoading(async () => {
        const actualizado = await actualizarProducto(id, payload);
        setProductos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...actualizado } : p)),
        );
        setProducto((prev) =>
          prev?.id === id ? { ...prev, ...actualizado } : prev,
        );
        return actualizado;
      }),
    [withLoading],
  );

  const editStock = useCallback(
    (id, inStock) =>
      withLoading(async () => {
        const resp = await actualizarStock(id, inStock);
        setProductos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: inStock } : p)),
        );
        return resp;
      }),
    [withLoading],
  );

  const removeProducto = useCallback(
    (id) =>
      withLoading(async () => {
        await eliminarProducto(id);
        setProductos((prev) => prev.filter((p) => p.id !== id));
        setProducto((prev) => (prev?.id === id ? null : prev));
        return true;
      }),
    [withLoading],
  );

  const restoreProducto = useCallback(
    (id) =>
      withLoading(async () => {
        await restaurarProducto(id);
        await fetchProductos();
        return true;
      }),
    [withLoading, fetchProductos],
  );

  // ============================================
  // Relaciones: categorías y marcas
  // ============================================
  const addCategorias = useCallback(
    (id, categoriaIds) =>
      withLoading(async () => {
        await agregarCategoriasAProducto(id, categoriaIds);
        return true;
      }),
    [withLoading],
  );

  const removeCategorias = useCallback(
    (id, categoriaIds) =>
      withLoading(async () => {
        await quitarCategoriasDeProducto(id, categoriaIds);
        return true;
      }),
    [withLoading],
  );

  const addMarcas = useCallback(
    (id, marcaIds) =>
      withLoading(async () => {
        await agregarMarcasAProducto(id, marcaIds);
        return true;
      }),
    [withLoading],
  );

  const removeMarcas = useCallback(
    (id, marcaIds) =>
      withLoading(async () => {
        await quitarMarcasDeProducto(id, marcaIds);
        return true;
      }),
    [withLoading],
  );

  // ============================================
  // Auto-load: decide la estrategia según opciones
  // ============================================
  useEffect(() => {
    if (!autoLoad) return;

    // ✅ Si no hay categoría ni búsqueda ni filtros → NO hacer nada
    if (!categoriaId && !searchQuery?.trim() && !filtros) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (searchQuery?.trim()) {
        fetchBuscarProductos(searchQuery);
        return;
      }

      if (categoriaId) {
        fetchProductosPorCategoria(categoriaId);
        return;
      }

      if (filtros) {
        if (filtros.marcaId) return fetchProductosPorMarca(filtros.marcaId);
        if (filtros.precioMin != null && filtros.precioMax != null)
          return fetchProductosPorPrecio(filtros.precioMin, filtros.precioMax);
        if (filtros.inStock != null)
          return fetchProductosPorStock(filtros.inStock);
        if (filtros.oferta) return fetchProductosEnOferta();
        if (filtros.nuevos != null) return fetchProductosNuevos(filtros.nuevos);
      }

      fetchProductos();
    }, 0);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaId, autoLoad, searchQuery]);

  // ============================================
  // Valores derivados
  // ============================================
  const total = useMemo(() => productos.length, [productos]);
  const filtrosActivos = useMemo(
    () => Boolean(categoriaId || searchQuery || filtros),
    [categoriaId, searchQuery, filtros],
  );

  return {
    // State
    productos,
    producto,
    stats,
    loading,
    error,
    total,
    filtrosActivos,

    // GETs
    fetchProductos,
    fetchProductoById,
    fetchProductosPorCategoria,
    fetchProductosPorMarca,
    fetchProductosPorPrecio,
    fetchProductosPorStock,
    fetchProductosEnOferta,
    fetchProductosNuevos,
    fetchBuscarProductos,
    fetchProductosRelacionados,
    fetchProductosStats,

    // Mutaciones
    addProducto,
    editProducto,
    editStock,
    removeProducto,
    restoreProducto,

    // Relaciones
    addCategorias,
    removeCategorias,
    addMarcas,
    removeMarcas,

    // Utils
    clearError,
  };
};

export const formatPrecio = (valor) =>
  valor != null ? `$${Number(valor).toLocaleString('es-AR')}` : '—';
