import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const marcaService = {
    // ============================================
    // OPERACIONES DE LECTURA (GET)
    // ============================================
    
    getAll: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.marca.base);
        return data;
    },

    getById: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.marca.porId(id));
        return data;
    },

    getByIdDetalle: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.marca.detalle(id));
        return data;
    },

    getByNombre: async (nombre) => {
        const { data } = await clienteAxios.get(ENDPOINTS.marca.buscar(nombre));
        return data;
    },

    // ============================================
    // OPERACIONES DE ESCRITURA
    // ============================================

    create: async (marcaData) => {
        const { data } = await clienteAxios.post(ENDPOINTS.marca.base, marcaData);
        return data;
    },

    update: async (id, marcaData) => {
        const { data } = await clienteAxios.put(ENDPOINTS.marca.porId(id), marcaData);
        return data;
    },

    delete: async (id) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.marca.porId(id));
        return data;
    },

    restore: async (id) => {
        const { data } = await clienteAxios.patch(ENDPOINTS.marca.restaurar(id));
        return data;
    },

    deletePermanente: async (id) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.marca.eliminarPermanente(id));
        return data;
    }
};