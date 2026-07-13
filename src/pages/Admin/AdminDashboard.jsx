// C:\xampp\htdocs\FrontComputerChip\src\pages\Admin\AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminStats from '../../components/Admin/AdminStats';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = () => {
      setLoading(true);
      setTimeout(() => {
        // Calcular estadísticas
        const activeProducts = SAMPLE_PRODUCTS.filter(p => p.deletedAt === null);
        const totalProducts = activeProducts.length;
        const totalRevenue = activeProducts.reduce((sum, p) => sum + p.precio, 0);
        
        // Generar pedidos recientes de ejemplo
        const statuses = ['pendiente', 'confirmado', 'enviado', 'entregado'];
        const customers = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez'];
        
        const sampleOrders = activeProducts.slice(0, 5).map((product, index) => ({
          idpedidos: index + 1,
          usuario: { nombreCompleto: customers[index % customers.length] },
          total: product.precio * (Math.floor(Math.random() * 2) + 1),
          estado: statuses[index % statuses.length]
        }));

        setStats({
          products: totalProducts,
          orders: Math.floor(Math.random() * 100) + 50,
          users: Math.floor(Math.random() * 200) + 100,
          revenue: totalRevenue
        });
        
        setRecentOrders(sampleOrders);
        setLoading(false);
      }, 500);
    };
    loadDashboardData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pendiente': 'status-pending',
      'confirmado': 'status-confirmed',
      'enviado': 'status-shipped',
      'entregado': 'status-completed'
    };
    return colors[status] || 'status-pending';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pendiente': 'Pendiente',
      'confirmado': 'Confirmado',
      'enviado': 'Enviado',
      'entregado': 'Entregado'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <div className="loading-container">
           <div className="loading-spinner-modern">
            <div className="spinner-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <div className="loading-text">
              Cargando datos<span className="dots">...</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Panel de Control" />
        <div className="admin-content">
          <AdminStats stats={stats} />
          
          <div className="dashboard-grid">
            <div className="dashboard-card recent-orders">
              <h3>📦 Pedidos Recientes</h3>
              <div className="order-list">
                {recentOrders.length === 0 ? (
                  <p className="no-data">No hay pedidos recientes</p>
                ) : (
                  recentOrders.map(order => (
                    <div key={order.idpedidos} className="order-item">
                      <span className="order-id">#{order.idpedidos}</span>
                      <span className="order-customer">
                        {order.usuario?.nombreCompleto || 'Cliente'}
                      </span>
                      <span className="order-amount">
                        {formatPrice(order.total)}
                      </span>
                      <span className={`order-status ${getStatusColor(order.estado)}`}>
                        {getStatusLabel(order.estado)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dashboard-card quick-actions">
              <h3>⚡ Acciones Rápidas</h3>
              <div className="action-grid">
                <button className="action-btn" onClick={() => window.location.href = '/admin/products'}>
                  ➕ Agregar Producto
                </button>
                <button className="action-btn" onClick={() => window.location.href = '/admin/orders'}>
                  📊 Ver Reportes
                </button>
                <button className="action-btn" onClick={() => window.location.href = '/admin/users'}>
                  👥 Gestionar Usuarios
                </button>
                <button className="action-btn" onClick={() => window.location.href = '/admin/settings'}>
                  ⚙️ Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;