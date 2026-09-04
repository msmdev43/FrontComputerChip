// src/services/pedidoService.js
import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const pedidoService = {
    /**
     * Obtener todos los pedidos
     * @returns {Promise<Array>} Lista de pedidos
     */
    getAll: async () => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.pedidos.base);
            return response.data;
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            throw error;
        }
    },

    /**
     * Obtener un pedido por ID
     * @param {number} id - ID del pedido
     * @returns {Promise<Object>} Datos del pedido
     */
    getById: async (id) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.pedidos.porId(id));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener pedido ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtener pedidos recientes
     * @param {number} limit - Límite de resultados
     * @returns {Promise<Array>} Pedidos recientes
     */
    getRecent: async (limit = 5) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.pedidos.recientes);
            return response.data;
        } catch (error) {
            console.error('Error al obtener pedidos recientes:', error);
            throw error;
        }
    },

    /**
     * Obtener pedidos por estado
     * @param {string} estado - Estado del pedido
     * @returns {Promise<Array>} Pedidos filtrados
     */
    getByEstado: async (estado) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.pedidos.porEstado(estado));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener pedidos por estado ${estado}:`, error);
            throw error;
        }
    },

    /**
     * Obtener pedidos pendientes
     * @returns {Promise<Array>} Pedidos pendientes
     */
    getPendientes: async () => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.pedidos.pendientes);
            return response.data;
        } catch (error) {
            console.error('Error al obtener pedidos pendientes:', error);
            throw error;
        }
    },

    /**
     * Obtener estadísticas de pedidos
     * @returns {Promise<Object>} Estadísticas
     */
    getStats: async () => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.pedidos.stats);
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas de pedidos:', error);
            throw error;
        }
    },

    /**
     * Confirmar un pedido
     * @param {number} id - ID del pedido
     * @returns {Promise<Object>} Pedido actualizado
     */
    confirmar: async (id) => {
        try {
            const response = await clienteAxios.put(ENDPOINTS.pedidos.confirmar(id));
            return response.data;
        } catch (error) {
            console.error(`Error al confirmar pedido ${id}:`, error);
            throw error;
        }
    },

    /**
     * Enviar un pedido
     * @param {number} id - ID del pedido
     * @returns {Promise<Object>} Pedido actualizado
     */
    enviar: async (id) => {
        try {
            const response = await clienteAxios.put(ENDPOINTS.pedidos.enviar(id));
            return response.data;
        } catch (error) {
            console.error(`Error al enviar pedido ${id}:`, error);
            throw error;
        }
    },

    /**
     * Entregar un pedido
     * @param {number} id - ID del pedido
     * @returns {Promise<Object>} Pedido actualizado
     */
    entregar: async (id) => {
        try {
            const response = await clienteAxios.put(ENDPOINTS.pedidos.entregar(id));
            return response.data;
        } catch (error) {
            console.error(`Error al entregar pedido ${id}:`, error);
            throw error;
        }
    },

    /**
     * Cancelar un pedido
     * @param {number} id - ID del pedido
     * @returns {Promise<Object>} Pedido actualizado
     */
    cancelar: async (id) => {
        try {
            const response = await clienteAxios.put(ENDPOINTS.pedidos.cancelar(id));
            return response.data;
        } catch (error) {
            console.error(`Error al cancelar pedido ${id}:`, error);
            throw error;
        }
    },

    /**
     * Actualizar un pedido
     * @param {number} id - ID del pedido
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<Object>} Pedido actualizado
     */
    update: async (id, data) => {
        try {
            const response = await clienteAxios.put(ENDPOINTS.pedidos.porId(id), data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar pedido ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar un pedido
     * @param {number} id - ID del pedido
     * @returns {Promise<Object>} Respuesta
     */
    delete: async (id) => {
        try {
            const response = await clienteAxios.delete(ENDPOINTS.pedidos.porId(id));
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar pedido ${id}:`, error);
            throw error;
        }
    }
};

export default pedidoService;