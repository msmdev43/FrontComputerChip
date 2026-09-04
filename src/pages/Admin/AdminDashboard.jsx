// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminStats from '../../components/Admin/AdminStats';
import { dashboardService } from '../../services/dashboardService';
import { pedidoService } from '../../services/pedidoService';
import { formatPrice } from '../../config/currency';
import '../../styles/admin/AdminDashboard.css';
import '../../styles/Spinner.css';

const AdminDashboard = () => {
  const { user } = useAdmin();
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosHoy: 0,
    pedidosPendientes: 0,
    productosPedidos: 0,
    totalUsuarios: 0,
    nuevosUsuariosMes: 0,
    usuariosGoogle: 0,
    totalProductos: 0,
    productosSinStock: 0,
    totalCategorias: 0,
    productosConCategoria: 0,
    ventasTotales: 0,
    ventasMes: 0,
    ventasSemana: 0,
    promedioVenta: 0,
    maxVenta: 0,
    ofertasActivas: 0,
    descuentoMaximo: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Obtiene el color del estado del pedido
   */
  const getStatusColor = useCallback((status) => {
    const statusMap = {
      'Pendiente': 'status-pending',
      'pendiente': 'status-pending',
      'Confirmado': 'status-confirmed',
      'confirmado': 'status-confirmed',
      'Enviado': 'status-shipped',
      'enviado': 'status-shipped',
      'Entregado': 'status-completed',
      'entregado': 'status-completed',
      'Cancelado': 'status-cancelled',
      'cancelado': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  }, []);

  /**
   * Obtiene el nombre del estado del pedido
   */
  const getStatusLabel = useCallback((status) => {
    const statusMap = {
      'Pendiente': 'Pendiente',
      'pendiente': 'Pendiente',
      'Confirmado': 'Confirmado',
      'confirmado': 'Confirmado',
      'Enviado': 'Enviado',
      'enviado': 'Enviado',
      'Entregado': 'Entregado',
      'entregado': 'Entregado',
      'Cancelado': 'Cancelado',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status || 'Pendiente';
  }, []);

  /**
   * Carga los datos del dashboard
   */
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener estadísticas del dashboard
      const statsData = await dashboardService.getStats();
      if (statsData) {
        setStats(prev => ({
          ...prev,
          ...statsData
        }));
      }

      // 2. Obtener pedidos recientes
      try {
        const ordersData = await pedidoService.getRecent();
        if (ordersData && Array.isArray(ordersData)) {
          setRecentOrders(ordersData.slice(0, 5));
        }
      } catch (orderError) {
        console.warn('No se pudieron cargar pedidos recientes:', orderError);
        // El dashboard sigue funcionando
      }

    } catch (err) {
      console.error('Error cargando dashboard:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.Error || err.response.data?.message;
        
        if (status === 401) {
          setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
        } else if (status === 403) {
          setError('No tiene permisos para ver el dashboard.');
        } else if (status === 500) {
          setError('Error interno del servidor. Intente más tarde.');
        } else {
          setError(message || `Error ${status}: No se pudieron cargar los datos`);
        }
      } else if (err.request) {
        setError('Error de conexión. Verifique su conexión a Internet.');
      } else {
        setError('Error inesperado al cargar los datos.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Preparar datos para AdminStats
  const statsForDisplay = {
    products: stats.totalProductos || 0,
    orders: stats.totalPedidos || 0,
    users: stats.totalUsuarios || 0,
    revenue: stats.ventasTotales || 0
  };

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <div className="loading-container">
            <div className="spinner-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <div className="loading-text">
              Cargando panel de control<span className="dots">...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: ERROR
  // ============================================
  if (error) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader 
            title="Panel de Control" 
            subtitle={`Bienvenido, ${user?.nombre || user?.usuario || 'Administrador'}`}
          />
          <div className="admin-content">
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <div className="error-actions">
                <button className="btn-primary" onClick={loadDashboardData}>
                  🔄 Reintentar
                </button>
                {error.includes('Sesión expirada') && (
                  <button 
                    className="btn-secondary" 
                    onClick={() => window.location.href = '/admin/login'}
                  >
                    🔑 Ir al Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: DASHBOARD
  // ============================================
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader 
          title="Panel de Control" 
          subtitle={`Bienvenido, ${user?.nombre || user?.usuario || 'Administrador'}`}
        />
        <div className="admin-content">
          {/* Stats principales */}
          <AdminStats stats={statsForDisplay} />
          
          {/* Grid de dashboard */}
          <div className="dashboard-grid">
            {/* Pedidos Recientes */}
            <div className="dashboard-card recent-orders">
              <h3>📦 Pedidos Recientes</h3>
              <div className="order-list">
                {recentOrders.length === 0 ? (
                  <p className="no-data">No hay pedidos recientes</p>
                ) : (
                  recentOrders.map(order => (
                    <div key={order.idpedidos || order.id} className="order-item">
                      <span className="order-id">#{order.idpedidos || order.id}</span>
                      <span className="order-customer">
                        {order.usuario?.nombreCompleto || order.usuario?.nombre || 'Cliente'}
                      </span>
                      <span className="order-amount">
                        {formatPrice(order.total || 0)}
                      </span>
                      <span className={`order-status ${getStatusColor(order.estado)}`}>
                        {getStatusLabel(order.estado)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="dashboard-card quick-actions">
              <h3>⚡ Acciones Rápidas</h3>
              <div className="action-grid">
                <button 
                  className="action-btn" 
                  onClick={() => window.location.href = '/admin/products'}
                >
                  ➕ Agregar Producto
                </button>
                <button 
                  className="action-btn" 
                  onClick={() => window.location.href = '/admin/orders'}
                >
                  📊 Ver Reportes
                </button>
                <button 
                  className="action-btn" 
                  onClick={() => window.location.href = '/admin/users'}
                >
                  👥 Gestionar Usuarios
                </button>
                <button 
                  className="action-btn" 
                  onClick={() => window.location.href = '/admin/settings'}
                >
                  ⚙️ Configuración
                </button>
              </div>
            </div>
          </div>

          {/* Stats Extendidos */}
          <div className="dashboard-stats-extended">
            <div className="stat-card-mini">
              <span className="stat-label">📋 Pedidos Hoy</span>
              <span className="stat-value">{stats.pedidosHoy || 0}</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-label">⏳ Pendientes</span>
              <span className="stat-value">{stats.pedidosPendientes || 0}</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-label">🆕 Nuevos Usuarios (Mes)</span>
              <span className="stat-value">{stats.nuevosUsuariosMes || 0}</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-label">⚠️ Sin Stock</span>
              <span className="stat-value">{stats.productosSinStock || 0}</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-label">🏷️ Ofertas Activas</span>
              <span className="stat-value">{stats.ofertasActivas || 0}</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-label">📈 Ventas Mes</span>
              <span className="stat-value">{formatPrice(stats.ventasMes || 0)}</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-label">📊 Promedio Venta</span>
              <span className="stat-value">{formatPrice(stats.promedioVenta || 0)}</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-label">🏆 Máxima Venta</span>
              <span className="stat-value">{formatPrice(stats.maxVenta || 0)}</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-label">🔻 Descuento Máximo</span>
              <span className="stat-value">{stats.descuentoMaximo || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;