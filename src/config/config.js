// Configuración base de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5200/api';

// ============================================
// DICCIONARIO COMPLETO DE ENDPOINTS
// ============================================
export const ENDPOINTS = {
    // ============================================
    // ADMIN - Administración
    // ============================================
    admin: {
        login: '/Admin/login',
        dashboard: {
            stats: '/Admin/dashboard/stats'
        },
        me: '/Admin/me'
    },

    // ============================================
    // AUTH - Autenticación
    // ============================================
    auth: {
        register: '/Auth/register',
        login: '/Auth/login',
        loginGoogle: '/Auth/login-google',
        adminLogin: '/Auth/admin/login',
        refresh: '/Auth/refresh',
        logout: '/Auth/logout',
        logoutAll: '/Auth/logout/all',
        verifyEmail: '/Auth/verify-email',
        sendVerification: '/Auth/send-verification',
        validate: '/Auth/validate',
        me: '/Auth/me'
    },

    // ============================================
    // CATEGORIA - Categorías
    // ============================================
    categoria: {
        base: '/Categoria',
        porId: (id) => `/Categoria/${id}`,
        detalle: (id) => `/Categoria/${id}/detalle`,
        buscar: (nombre) => `/Categoria/buscar?nombre=${nombre}`,
        restaurar: (id) => `/Categoria/${id}/restore`,
        eliminarPermanente: (id) => `/Categoria/${id}/permanente`
    },

    // ============================================
    // ESPECIFICACION - Especificaciones
    // ============================================
    especificacion: {
        base: '/Especificacion',
        porId: (id) => `/Especificacion/${id}`,
        porProducto: (productoId) => `/Especificacion/producto/${productoId}`,
        buscar: '/Especificacion/buscar',
        asignar: '/Especificacion/asignar',
        eliminarAsignacion: '/Especificacion/asignar'
    },

    // ============================================
    // LOGINGOOGLE - Login con Google
    // ============================================
    loginGoogle: {
        base: '/LoginGoogle',
        porUsuario: (usuarioId) => `/LoginGoogle/usuario/${usuarioId}`,
        porGoogleSub: (googleSub) => `/LoginGoogle/google/${googleSub}`,
        actualizarLastLogin: (id) => `/LoginGoogle/${id}/lastlogin`,
        actualizarRefresh: (id) => `/LoginGoogle/${id}/refresh`
    },

    // ============================================
    // MARCA - Marcas
    // ============================================
    marca: {
        base: '/Marca',
        porId: (id) => `/Marca/${id}`,
        detalle: (id) => `/Marca/${id}/detalle`,
        buscar: (nombre) => `/Marca/buscar?nombre=${nombre}`,
        restaurar: (id) => `/Marca/${id}/restore`,
        eliminarPermanente: (id) => `/Marca/${id}/permanente`
    },

    // ============================================
    // PEDIDOS - Pedidos
    // ============================================
    pedidos: {
        base: '/Pedidos',
        porId: (id) => `/Pedidos/${id}`,
        porUsuario: (usuarioId) => `/Pedidos/usuario/${usuarioId}`,
        porEstado: (estado) => `/Pedidos/estado/${estado}`,
        pendientes: '/Pedidos/pendientes',
        recientes: '/Pedidos/recientes',
        stats: '/Pedidos/stats',
        confirmar: (id) => `/Pedidos/${id}/confirmar`,
        enviar: (id) => `/Pedidos/${id}/enviar`,
        entregar: (id) => `/Pedidos/${id}/entregar`
    },

    // ============================================
    // PRODUCTOS - Productos
    // ============================================
    productos: {
        base: '/Productos',
        porId: (id) => `/Productos/${id}`,
        porCategoria: (categoriaId) => `/Productos/categoria/${categoriaId}`,
        porMarca: (marcaId) => `/Productos/marca/${marcaId}`,
        precio: '/Productos/precio',
        stock: (inStock) => `/Productos/stock/${inStock}`,
        oferta: '/Productos/oferta',
        nuevos: '/Productos/nuevos',
        buscar: '/Productos/buscar',
        relacionados: (id) => `/Productos/relacionados/${id}`,
        stats: '/Productos/stats',
        actualizarStock: (id) => `/Productos/${id}/stock`,
        restaurar: (id) => `/Productos/${id}/restaurar`,
        categorias: (id) => `/Productos/${id}/categorias`,
        marcas: (id) => `/Productos/${id}/marcas`
    },

    // ============================================
    // ZONAENVIO - Zonas de Envío
    // ============================================
    zonaEnvio: {
        base: '/ZonaEnvio',
        porId: (id) => `/ZonaEnvio/${id}`,
        porCodigoPostal: (codigoPostal) => `/ZonaEnvio/codigo/${codigoPostal}`,
        costoPorCodigo: (codigoPostal) => `/ZonaEnvio/costo/${codigoPostal}`,
        porPais: (pais) => `/ZonaEnvio/pais/${pais}`,
        actualizarCosto: (id) => `/ZonaEnvio/${id}/costo`
    }
};

// ============================================
// CONSTANTES DE CONFIGURACIÓN
// ============================================
export const CONFIG = {
    // Tiempos de expiración
    EXPIRATION: {
        TOKEN: 8 * 60 * 60 * 1000, // 8 horas
        REFRESH_TOKEN: 24 * 60 * 60 * 1000 // 24 horas
    },
    
    // Roles del sistema
    ROLES: {
        ADMIN: 'Admin',
        USER: 'User',
        MODERATOR: 'Moderator'
    },
    
    // Estados de pedidos
    ORDER_STATUS: {
        PENDIENTE: 'Pendiente',
        CONFIRMADO: 'Confirmado',
        ENVIADO: 'Enviado',
        ENTREGADO: 'Entregado',
        CANCELADO: 'Cancelado'
    },
    
    // Tipo de autenticación
    AUTH: {
        STORAGE_KEY: 'adminAuth',
        TOKEN_KEY: 'token',
        USER_KEY: 'user'
    }
};

// Exportar todo como objeto por defecto
export default {
    API_BASE_URL,
    ENDPOINTS,
    CONFIG
};