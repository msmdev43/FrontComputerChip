// C:\xampp\htdocs\FrontComputerChip\src\services\usuarioService.js
import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const usuarioService = {
  getAll: async () => {
    const { data } = await clienteAxios.get(ENDPOINTS.usuarios.all);
    return data;
  },

  getById: async (id) => {
    const { data } = await clienteAxios.get(ENDPOINTS.usuarios.porId(id));
    return data;
  },

  getMe: async () => {
    const { data } = await clienteAxios.get(ENDPOINTS.usuarios.me);
    return data;
  },

  buscar: async (q) => {
    const { data } = await clienteAxios.get(ENDPOINTS.usuarios.buscar(q));
    return data;
  },

  getRecientes: async (days = 7) => {
    const { data } = await clienteAxios.get(ENDPOINTS.usuarios.recientes(days));
    return data;
  },

  getStats: async () => {
    const { data } = await clienteAxios.get(ENDPOINTS.usuarios.stats);
    return data;
  },

  eliminar: async (id) => {
    const { data } = await clienteAxios.delete(ENDPOINTS.usuarios.eliminar(id));
    return data;
  },
};

export default usuarioService;