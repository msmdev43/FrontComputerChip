import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const atributoService = {

    // ============================================
    // CRUD
    // ============================================

    getAll: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.atributos.base);
        return data;
    },

    getAllAsignaciones: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.atributos.asignaciones);
        return data;
    },

    getById: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.atributos.porId(id));
        return data;
    },

    getByIdDetalle: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.atributos.detalle(id));
        return data;
    },

    getByNombre: async (nombre) => {
        const { data } = await clienteAxios.get(ENDPOINTS.atributos.buscar(nombre));
        return data;
    },

    create: async (atributoData) => {
        const { data } = await clienteAxios.post(ENDPOINTS.atributos.base, atributoData);
        return data;
    },

    update: async (id, atributoData) => {
        const { data } = await clienteAxios.put(ENDPOINTS.atributos.porId(id), atributoData);
        return data;
    },

    delete: async (id) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.atributos.porId(id));
        return data;
    },

    // ============================================
    // RELACIÓN CON PRODUCTOS
    // ============================================

    /**
     * Asigna uno o varios atributos a un producto.
     * @param {number} productoId
     * @param {Array<{ atributoId: number, valor: string }>} atributos
     */
    asignarAProducto: async (productoId, atributos) => {
        const { data } = await clienteAxios.post(
            ENDPOINTS.atributos.asignarAProducto(productoId),
            { atributos }
        );
        return data;
    },

    /**
     * Actualiza el valor de un atributo específico de un producto.
     * @param {number} productoId
     * @param {number} atributoId
     * @param {string} valor
     */
    actualizarValor: async (productoId, atributoId, valor) => {
        const { data } = await clienteAxios.put(
            ENDPOINTS.atributos.actualizarValor(productoId, atributoId),
            valor, // ⚠️ el controller recibe `[FromBody] string valor`
            { headers: { 'Content-Type': 'application/json' } }
        );
        return data;
    },

    quitarDeProducto: async (productoId, atributoId) => {
        const { data } = await clienteAxios.delete(
            ENDPOINTS.atributos.quitarDeProducto(productoId, atributoId)
        );
        return data;
    },

    getByProducto: async (productoId) => {
        const { data } = await clienteAxios.get(
            ENDPOINTS.atributos.porProducto(productoId)
        );
        return data;
    },

    // ============================================
    // COMPATIBILIDAD
    // ============================================

    /**
     * Compara 2 o más productos y devuelve por cada atributo el valor
     * de cada uno + si son compatibles.
     * @param {number[]} productoIds
     */
    comparar: async (productoIds) => {
        const { data } = await clienteAxios.post(
            ENDPOINTS.atributos.comparar,
            { productoIds }
        );
        return data;
    },

    /**
     * Productos que tienen un atributo con un valor específico.
     * Ej: todos los productos con Socket = AM4.
     */
    getProductosPorValor: async (atributoId, valor) => {
        const { data } = await clienteAxios.get(
            ENDPOINTS.atributos.productosPorValor(atributoId, valor)
        );
        return data;
    },
};