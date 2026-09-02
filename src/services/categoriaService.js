import clienteAxios from '../config/axiosClient';
import {ENDPOINTS} from '../config/config';

export const categoriaService = {

    getAll: async () => {
        const {data} = await clienteAxios.get(ENDPOINTS.categorias.base);
        return data;
    },

    getById: async (id) => {
        const {data} = await clienteAxios.get(ENDPOINTS.categorias.porId(id));
        return data;
    },

    getByIdDetalle: async (id) => {
        const {data} = await clienteAxios.get(ENDPOINTS.categorias.detalle(id));
        return data;
    },

    getByNombre: async (nombre) => {
        const {data} = await clienteAxios.get(ENDPOINTS.categorias.buscar(nombre));
        return data;
    },

    create: async (categoriaData) => {
        const { data } = await clienteAxios.post(ENDPOINTS.categorias.base, categoriaData);
        return data;
    },

    update: async (id, categoriaData) => {
        const { data } = await clienteAxios.put(ENDPOINTS.categorias.porId(id), categoriaData)
        return data;
    },

    delete: async (id) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.categorias.porId(id), categoriaData)
        return data;
    },

    restore: async (id) => {
        const { data } = await clienteAxios.patch(ENDPOINTS.categorias.restaurar(id));
        return data;
    },

    deletePermanente: async (id) => {
        const { data } = await clienteAxios.delete(ENDPOINTS.categorias.eliminarPermanente(id));
        return data;
    }


};