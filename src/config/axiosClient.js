import axios from 'axios';
import { API_BASE_URL } from './config';

// Clave para localStorage
const STORAGE_KEY = 'adminAuth';

// Crear instancia de axios con configuración base
const clienteAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000 // 30 segundos
});

/**
 * Interceptor de REQUEST - Agrega el token automáticamente
 */
clienteAxios.interceptors.request.use(
    config => {
        // Excluir endpoints de login (tanto Admin como Auth)
        const isLoginEndpoint = 
            config.url?.includes('/login') || 
            config.url?.includes('/register') ||
            config.url?.includes('/refresh');
        
        if (!isLoginEndpoint) {
            const authData = localStorage.getItem(STORAGE_KEY);
            if (authData) {
                try {
                    const parsed = JSON.parse(authData);
                    if (parsed.token) {
                        config.headers.Authorization = `Bearer ${parsed.token}`;
                    }
                } catch (error) {
                    console.warn('Error parseando authData:', error);
                }
            }
        }
        
        return config;
    },
    error => Promise.reject(error)
);

/**
 * Interceptor de RESPONSE - Maneja errores de autenticación
 */
clienteAxios.interceptors.response.use(
    response => response,
    error => {
        // Si el error es 401 (No autorizado)
        if (error.response?.status === 401) {
            const authData = localStorage.getItem(STORAGE_KEY);
            
            // Solo redirigir si tenemos token (significa que estaba autenticado)
            if (authData) {
                try {
                    const parsed = JSON.parse(authData);
                    if (parsed.token) {
                        // Limpiar datos de autenticación
                        localStorage.removeItem(STORAGE_KEY);
                        delete clienteAxios.defaults.headers.common['Authorization'];
                        
                        // Redirigir al login solo si no estamos ya en él
                        if (typeof window !== 'undefined' && 
                            !window.location.pathname.includes('/admin/login')) {
                            window.location.href = '/admin/login?session=expired';
                        }
                    }
                } catch (error) {
                    console.warn('Error procesando 401:', error);
                }
            }
        }
        
        // Error 403 - Prohibido 
        if (error.response?.status === 403) {
            console.warn('Acceso prohibido:', error.response?.data?.Error || 'No tiene permisos');
        }
        
        // Error 500 - Error del servidor
        if (error.response?.status === 500) {
            console.error('Error del servidor:', error.response?.data?.Error || 'Error interno');
        }
        
        return Promise.reject(error);
    }
);

export default clienteAxios;