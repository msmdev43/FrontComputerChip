import clienteAxios from '../config/axiosClient';
import { ENDPOINTS } from '../config/config';

// Clave para el localStorage
const STORAGE_KEY = 'adminAuth';

class AdminAuthService {
  /**
   * Obtiene los datos de autenticación del localStorage
   */
  getAuthData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Guarda los datos de autenticación en localStorage
   */
  saveAuthData(authData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  }

  /**
   * Limpia los datos de autenticación
   */
  clearAuthData() {
    localStorage.removeItem(STORAGE_KEY);
    delete clienteAxios.defaults.headers.common['Authorization'];
  }

  /**
   * Configura el token en el header de axios
   */
  setAuthToken(token) {
    if (token) {
      clienteAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete clienteAxios.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Verifica si el usuario está autenticado en localStorage
   */
  isAuthenticated() {
    const authData = this.getAuthData();
    return !!(authData?.isAuthenticated && authData?.token);
  }

  /**
   * Obtiene el usuario guardado en localStorage
   */
  getUser() {
    const authData = this.getAuthData();
    return authData?.user || null;
  }

  /**
   * Obtiene el token guardado
   */
  getToken() {
    const authData = this.getAuthData();
    return authData?.token || null;
  }

  /**
   * Verifica el token con el backend
   */
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token');
      }

      this.setAuthToken(token);
      const response = await clienteAxios.get(ENDPOINTS.admin.me);
      
      return {
        isValid: true,
        user: response.data
      };
    } catch (error) {
      console.error('Error verificando token:', error);
      this.clearAuthData();
      this.setAuthToken(null);
      
      return {
        isValid: false,
        user: null
      };
    }
  }

  /**
   * Inicia sesión del administrador
   */
  async login(usuario, password) {
    try {
      const response = await clienteAxios.post(ENDPOINTS.admin.login, {
        usuario,
        password
      });

      // La respuesta puede tener diferentes formatos
      // Opción 1: { admin, token }
      // Opción 2: { ...adminData, token }
      // Opción 3: solo admin (backward compatibility)
      
      let userData = null;
      let token = null;

      // Si la respuesta tiene la estructura { admin, token }
      if (response.data.admin && response.data.token) {
        userData = response.data.admin;
        token = response.data.token;
      } 
      // Si la respuesta tiene token directamente en la raíz
      else if (response.data.token) {
        userData = response.data;
        token = response.data.token;
      }
      // Si la respuesta solo tiene el admin (sin token - modo desarrollo)
      else {
        // Usar token mock solo para desarrollo
        userData = response.data;
        token = `mock-token-${Date.now()}`;
        console.warn('⚠️ Usando token mock - El backend no está retornando token JWT');
      }

      const authData = {
        isAuthenticated: true,
        user: userData,
        token: token
      };

      this.saveAuthData(authData);
      this.setAuthToken(token);

      return {
        success: true,
        user: userData,
        token: token
      };
    } catch (error) {
      console.error('Error en login:', error);
      
      // Limpiar cualquier dato previo en caso de error
      this.clearAuthData();
      
      return {
        success: false,
        error: this._handleLoginError(error)
      };
    }
  }

  /**
   * Cierra sesión
   */
  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await clienteAxios.post(ENDPOINTS.auth.logout).catch(() => {});
      }
    } catch (error) {
      console.warn('Error en logout backend:', error);
    } finally {
      // Siempre limpiar datos locales
      this.clearAuthData();
    }
  }

  /**
   * Refresca el token (para cuando el backend lo implemente)
   */
  async refreshToken() {
    try {
      const authData = this.getAuthData();
      if (!authData?.refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response = await clienteAxios.post(ENDPOINTS.auth.refresh, {
        token: authData.refreshToken
      });

      if (response.data?.token) {
        const newAuthData = {
          ...authData,
          token: response.data.token,
          refreshToken: response.data.refreshToken || authData.refreshToken
        };
        
        this.saveAuthData(newAuthData);
        this.setAuthToken(response.data.token);
        
        return {
          success: true,
          token: response.data.token
        };
      }

      return {
        success: false,
        error: 'No se pudo refrescar el token'
      };
    } catch (error) {
      console.error('Error refrescando token:', error);
      this.clearAuthData();
      return {
        success: false,
        error: error.response?.data?.Error || 'Error al refrescar el token'
      };
    }
  }

  /**
   * ✅ MEJORADO: Maneja errores del login con más detalles
   */
  _handleLoginError(error) {
    if (!error.response) {
      return 'Error de conexión con el servidor. Verifique su conexión a Internet.';
    }

    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.Error || 'Datos de inicio de sesión inválidos';
      case 401:
        return data?.Error || 'Credenciales inválidas. Verifique su usuario y contraseña.';
      case 403:
        return 'Acceso denegado. No tiene permisos de administrador.';
      case 404:
        return 'Usuario no encontrado en el sistema.';
      case 429:
        return 'Demasiados intentos. Espere un momento antes de intentar nuevamente.';
      case 500:
        return 'Error interno del servidor. Intente más tarde.';
      default:
        return data?.Error || `Error al iniciar sesión (${status})`;
    }
  }
}

// Exportar una instancia única
export const adminAuthService = new AdminAuthService();