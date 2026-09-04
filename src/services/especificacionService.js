// C:\xampp\htdocs\FrontComputerChip\src\services\especificacionService.js
import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const especificacionService = {
    /**
     * Obtener todas las especificaciones
     * @returns {Promise<Array>} Lista de especificaciones
     */
    getAll: async () => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.especificacion.base);
            return response.data;
        } catch (error) {
            console.error('Error al obtener especificaciones:', error);
            throw error;
        }
    },

    /**
     * Obtener una especificación por ID
     * @param {number} id - ID de la especificación
     * @returns {Promise<Object>} Datos de la especificación
     */
    getById: async (id) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.especificacion.porId(id));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener especificación ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtener especificaciones por producto
     * @param {number} productoId - ID del producto
     * @returns {Promise<Array>} Especificaciones del producto
     */
    getByProducto: async (productoId) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.especificacion.porProducto(productoId));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener especificaciones del producto ${productoId}:`, error);
            throw error;
        }
    },

    /**
     * Buscar especificaciones por término
     * @param {string} termino - Término de búsqueda
     * @returns {Promise<Array>} Especificaciones encontradas
     */
    buscar: async (termino) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.especificacion.buscar, {
                params: { q: termino }
            });
            return response.data;
        } catch (error) {
            console.error(`Error al buscar especificaciones:`, error);
            throw error;
        }
    },

    /**
     * Crear una nueva especificación
     * @param {Object} data - Datos de la especificación
     * @param {string} data.titulo - Título
     * @param {string} data.descripcion - Descripción
     * @returns {Promise<Object>} Especificación creada
     */
    create: async (data) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.especificacion.base, data);
            return response.data;
        } catch (error) {
            console.error('Error al crear especificación:', error);
            throw error;
        }
    },

    /**
     * Actualizar una especificación
     * @param {number} id - ID de la especificación
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<Object>} Especificación actualizada
     */
    update: async (id, data) => {
        try {
            const response = await clienteAxios.put(ENDPOINTS.especificacion.porId(id), data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar especificación ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar una especificación
     * @param {number} id - ID de la especificación
     * @returns {Promise<Object>} Respuesta
     */
    delete: async (id) => {
        try {
            const response = await clienteAxios.delete(ENDPOINTS.especificacion.porId(id));
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar especificación ${id}:`, error);
            throw error;
        }
    },

    /**
     * Asignar especificación a un producto
     * @param {number} productoId - ID del producto
     * @param {number} especificacionId - ID de la especificación
     * @returns {Promise<Object>} Respuesta
     */
    asignar: async (productoId, especificacionId) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.especificacion.asignar, {
                productoId,
                especificacionId
            });
            return response.data;
        } catch (error) {
            console.error('Error al asignar especificación:', error);
            throw error;
        }
    },

    /**
     * Eliminar asignación de especificación a producto
     * @param {number} productoId - ID del producto
     * @param {number} especificacionId - ID de la especificación
     * @returns {Promise<Object>} Respuesta
     */
    eliminarAsignacion: async (productoId, especificacionId) => {
        try {
            const response = await clienteAxios.delete(ENDPOINTS.especificacion.eliminarAsignacion, {
                data: { productoId, especificacionId }
            });
            return response.data;
        } catch (error) {
            console.error('Error al eliminar asignación:', error);
            throw error;
        }
    }
};

export default especificacionService;