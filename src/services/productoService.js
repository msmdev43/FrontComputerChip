import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const productoService = {
    // ============================================
    // OPERACIONES DE LECTURA (GET)
    // ============================================
    
    getAll: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.base);
        return data;
    },

    getById: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.porId(id));
        return data;
    },

    getByCategoria: async (categoriaId) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.porCategoria(categoriaId));
        return data;
    },

    getByMarca: async (marcaId) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.porMarca(marcaId));
        return data;
    },

    getByPrecioRange: async (min, max) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.precio, {
            params: { min, max }
        });
        return data;
    },

    getByStock: async (inStock) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.stock(inStock));
        return data;
    },

    getOnSale: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.ofertas);
        return data;
    },

    getNewProducts: async (days = 7) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.nuevos, {
            params: { days }
        });
        return data;
    },

    search: async (q) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.buscar, {
            params: { q }
        });
        return data;
    },

    getRelated: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.relacionados(id));
        return data;
    },

    getStats: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.productos.stats);
        return data;
    },

    // ============================================
    // OPERACIONES DE ESCRITURA Y MODIFICACIÓN
    // ============================================

    create: async (productoCreateRequest) => {
        const { data } = await clienteAxios.post(ENDPOINTS.productos.base, productoCreateRequest);
        return data;
    },

    update: async (id, productoUpdateRequest) => {
        const { data } = await clienteAxios.put(ENDPOINTS.productos.porId(id), productoUpdateRequest);
        return data;
    },

    updateStock: async (id, stock) => {
        const { data } = await clienteAxios.patch(ENDPOINTS.productos.stock(id), stock);
        return data;
    },

    softDelete: async (id) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.productos.porId(id));
        return data;
    },

    restore: async (id) => {
        const { data } = await clienteAxios.post(ENDPOINTS.productos.restaurar(id));
        return data;
    },

    // ============================================
    // GESTIÓN DE CATEGORÍAS Y MARCAS ASOCIADAS
    // ============================================

    addCategories: async (id, categoriaIds) => {
        const { data } = await clienteAxios.post(ENDPOINTS.productos.categorias(id), categoriaIds);
        return data;
    },

    removeCategories: async (id, categoriaIds) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.productos.categorias(id), {
            data: categoriaIds
        });
        return data;
    },

    addBrands: async (id, marcaIds) => {
        const { data } = await clienteAxios.post(ENDPOINTS.productos.marcas(id), marcaIds);
        return data;
    },

    removeBrands: async (id, marcaIds) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.productos.marcas(id), {
            data: marcaIds
        });
        return data;
    }
};