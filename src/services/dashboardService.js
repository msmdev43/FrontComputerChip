// src/services/dashboardService.js
import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const dashboardService = {
    /**
     * Obtener estadísticas del dashboard
     * @returns {Promise<Object>} Estadísticas del dashboard
     */
    getStats: async () => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.admin.dashboard.stats);
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas del dashboard:', error);
            throw error;
        }
    }
};

export default dashboardService;