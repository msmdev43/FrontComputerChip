// Configuración base de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5200/api';

// Diccionario de endpoints para fácil mantenimiento
export const ENDPOINTS = {
    productos: {
        base: '/productos',
        porId: (id) => `/productos/${id}`,
        porCategoria: (id) => `/productos/categoria/${id}`,
        porMarca: (id) => `/productos/marca/${id}`,
        precio: '/productos/precio',
        stock: (id) => `/productos/${id}/stock`,
        ofertas: '/productos/oferta',
        nuevos: '/productos/nuevos',
        buscar: '/productos/buscar',
        relacionados: (id) => `/productos/relacionados/${id}`,
        stats: '/productos/stats',
        categorias: (id) => `/productos/${id}/categorias`,
        marcas: (id) => `/productos/${id}/marcas`,
        restaurar: (id) => `/productos/${id}/restaurar`
    },

    categorias:{
        base: '/categorias',
        porId: (id) =>`/categorias/${id}`,
        detalle: (id) => `/categorias/${id}/detalle`,
        buscar: (nombre) => `/categorias/buscar?nombre=${nombre}`,
        restaurar: (id) => `/categorias/${id}/restore`,
        eliminarPermanente: (id) => `/categorias/${id}/permanente`

    },
    
    // Puedes agregar más secciones aquí (usuarios, pedidos, etc.)
    auth: {
        login: '/auth/login',
        register: '/auth/register'
    }
};