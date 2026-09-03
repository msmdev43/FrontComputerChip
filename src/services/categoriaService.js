import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const categoriaService = {

    getAll: async () => {
        const { data } = await clienteAxios.get(ENDPOINTS.categoria.base);
        return data;
    },

    getById: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.categoria.porId(id));
        return data;
    },

    getByIdDetalle: async (id) => {
        const { data } = await clienteAxios.get(ENDPOINTS.categoria.detalle(id));
        return data;
    },

    getByNombre: async (nombre) => {
        const { data } = await clienteAxios.get(ENDPOINTS.categoria.buscar(nombre));
        return data;
    },

    create: async (categoriaData) => {
        const { data } = await clienteAxios.post(ENDPOINTS.categoria.base, categoriaData);
        return data;
    },

    update: async (id, categoriaData) => {
        const { data } = await clienteAxios.put(ENDPOINTS.categoria.porId(id), categoriaData);
        return data;
    },

    delete: async (id) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.categoria.porId(id));
        return data;
    },

    restore: async (id) => {
        const { data } = await clienteAxios.patch(ENDPOINTS.categoria.restaurar(id));
        return data;
    },

    deletePermanente: async (id) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.categoria.eliminarPermanente(id));
        return data;
    }
};