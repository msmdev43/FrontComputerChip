// C:\xampp\htdocs\FrontComputerChip\src\services\usuarioService.js
import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

export const usuarioService = {
    /**
     * Obtener el usuario autenticado
     * @returns {Promise<Object>} Datos del usuario
     */
    getMe: async () => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.auth.me);
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuario autenticado:', error);
            throw error;
        }
    },

    /**
     * Validar token del usuario
     * @returns {Promise<Object>} Respuesta de validación
     */
    validate: async () => {
        try {
            const response = await clienteAxios.get(ENDPOINTS.auth.validate);
            return response.data;
        } catch (error) {
            console.error('Error al validar token:', error);
            throw error;
        }
    },

    /**
     * Registrar un nuevo usuario
     * @param {Object} data - Datos del usuario
     * @param {string} data.nombreCompleto - Nombre completo
     * @param {string} data.email - Email
     * @param {string} data.password - Contraseña
     * @param {string} data.pais - País (opcional)
     * @param {string} data.provincia - Provincia (opcional)
     * @param {string} data.ciudad - Ciudad (opcional)
     * @param {string} data.calle - Calle (opcional)
     * @param {string} data.numero - Número (opcional)
     * @param {string} data.celular - Celular (opcional)
     * @returns {Promise<Object>} Usuario creado
     */
    register: async (data) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.auth.register, data);
            return response.data;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    },

    /**
     * Iniciar sesión como usuario normal
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Promise<Object>} Datos de autenticación
     */
    login: async (email, password) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.auth.login, {
                email,
                password
            });
            return response.data;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    },

    /**
     * Iniciar sesión con Google
     * @param {string} googleSub - ID de Google
     * @param {string} email - Email
     * @param {string} nombre - Nombre
     * @param {string} avatarUrl - URL del avatar (opcional)
     * @returns {Promise<Object>} Datos de autenticación
     */
    loginGoogle: async (googleSub, email, nombre, avatarUrl) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.auth.loginGoogle, {
                googleSub,
                email,
                nombre,
                avatarUrl
            });
            return response.data;
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
            throw error;
        }
    },

    /**
     * Cerrar sesión
     * @param {string} refreshToken - Token de refresco
     * @returns {Promise<Object>} Respuesta
     */
    logout: async (refreshToken) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.auth.logout, { refreshToken });
            return response.data;
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw error;
        }
    },

    /**
     * Cerrar sesión en todos los dispositivos
     * @param {string} refreshToken - Token de refresco
     * @returns {Promise<Object>} Respuesta
     */
    logoutAll: async (refreshToken) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.auth.logoutAll, { refreshToken });
            return response.data;
        } catch (error) {
            console.error('Error al cerrar sesión en todos los dispositivos:', error);
            throw error;
        }
    },

    /**
     * Refrescar token
     * @param {string} refreshToken - Token de refresco
     * @returns {Promise<Object>} Nuevos tokens
     */
    refreshToken: async (refreshToken) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.auth.refresh, { refreshToken });
            return response.data;
        } catch (error) {
            console.error('Error al refrescar token:', error);
            throw error;
        }
    },

    /**
     * Verificar email
     * @param {string} token - Token de verificación
     * @returns {Promise<Object>} Respuesta
     */
    verifyEmail: async (token) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.auth.verifyEmail, { token });
            return response.data;
        } catch (error) {
            console.error('Error al verificar email:', error);
            throw error;
        }
    },

    /**
     * Enviar verificación de email
     * @param {string} email - Email del usuario
     * @returns {Promise<Object>} Respuesta
     */
    sendVerification: async (email) => {
        try {
            const response = await clienteAxios.post(ENDPOINTS.auth.sendVerification, { email });
            return response.data;
        } catch (error) {
            console.error('Error al enviar verificación:', error);
            throw error;
        }
    }
};

export default usuarioService;