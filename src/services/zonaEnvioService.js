// C:\xampp\htdocs\FrontComputerChip\src\services\zonaEnvioService.js
import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const zonaEnvioService = {
    /**
     * Obtener todas las zonas de envío
     * @returns {Promise<Array>} Lista de zonas de envío
     */
    getAll: async () => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.zonaEnvio.base);
            return response.data;
        } catch (error) {
            console.error('Error al obtener zonas de envío:', error);
            throw error;
        }
    },

    /**
     * Obtener una zona de envío por ID
     * @param {number} id - ID de la zona
     * @returns {Promise<Object>} Datos de la zona
     */
    getById: async (id) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.zonaEnvio.porId(id));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener zona ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtener zona de envío por código postal
     * @param {string} codigoPostal - Código postal
     * @returns {Promise<Object>} Zona de envío
     */
    getByCodigoPostal: async (codigoPostal) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.zonaEnvio.porCodigoPostal(codigoPostal));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener zona por código postal ${codigoPostal}:`, error);
            throw error;
        }
    },

    /**
     * Obtener costo de envío por código postal
     * @param {string} codigoPostal - Código postal
     * @returns {Promise<Object>} Costo de envío
     */
    getCostoByCodigoPostal: async (codigoPostal) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.zonaEnvio.costoPorCodigo(codigoPostal));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener costo por código postal ${codigoPostal}:`, error);
            throw error;
        }
    },

    /**
     * Obtener zonas de envío por país
     * @param {string} pais - Nombre del país
     * @returns {Promise<Array>} Zonas de envío del país
     */
    getByPais: async (pais) => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.zonaEnvio.porPais(pais));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener zonas por país ${pais}:`, error);
            throw error;
        }
    },

    /**
     * Crear una nueva zona de envío
     * @param {Object} data - Datos de la zona
     * @param {string} data.pais - País
     * @param {string} data.provincia - Provincia (opcional)
     * @param {string} data.ciudad - Ciudad (opcional)
     * @param {string} data.codigoPostal - Código postal (opcional)
     * @param {string} data.costo - Costo de envío
     * @returns {Promise<Object>} Zona creada
     */
    create: async (data) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.zonaEnvio.base, data);
            return response.data;
        } catch (error) {
            console.error('Error al crear zona de envío:', error);
            throw error;
        }
    },

    /**
     * Actualizar una zona de envío
     * @param {number} id - ID de la zona
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<Object>} Zona actualizada
     */
    update: async (id, data) => {
        try {
            const response = await clienteAxios.put(ENDPOINTS.zonaEnvio.porId(id), data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar zona ${id}:`, error);
            throw error;
        }
    },

    /**
     * Actualizar solo el costo de una zona de envío
     * @param {number} id - ID de la zona
     * @param {string} costo - Nuevo costo
     * @returns {Promise<Object>} Zona actualizada
     */
    updateCosto: async (id, costo) => {
        try {
            const response = await clienteAxios.patch(ENDPOINTS.zonaEnvio.actualizarCosto(id), { costo });
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar costo de zona ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar una zona de envío (soft delete)
     * @param {number} id - ID de la zona
     * @returns {Promise<Object>} Respuesta
     */
    delete: async (id) => {
        try {
            const response = await clienteAxios.delete(ENDPOINTS.zonaEnvio.porId(id));
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar zona ${id}:`, error);
            throw error;
        }
    }
};

export default zonaEnvioService;