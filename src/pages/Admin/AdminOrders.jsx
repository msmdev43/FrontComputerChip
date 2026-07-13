// C:\xampp\htdocs\FrontComputerChip\src\pages\Admin\AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import '../../styles/admin/AdminOrders.css';

const AdminOrders = () => {
  const generateSampleOrders = () => {
    const orderStatuses = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
    const customers = [
      'Juan Pérez', 'María García', 'Carlos López', 
      'Ana Martínez', 'Pedro Sánchez', 'Laura Fernández',
      'Miguel Rodríguez', 'Carmen Gómez', 'José Ruiz',
      'Isabel Díaz'
    ];
    
    return SAMPLE_PRODUCTS.filter(p => p.deletedAt === null).map((product, index) => ({
      idpedidos: index + 1,
      usuario: {
        nombreCompleto: customers[index % customers.length]
      },
      total: product.precio * (Math.floor(Math.random() * 3) + 1),
      estado: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      productos: [product]
    }));
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadOrders = () => {
      setLoading(true);
      setTimeout(() => {
        setOrders(generateSampleOrders());
        setLoading(false);
      }, 500);
    };
    loadOrders();
  }, []);

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.idpedidos === id ? { ...order, estado: newStatus } : order
    ));
  };

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
      'entregado': 'status-completed',
      'cancelado': 'status-cancelled'
    };
    return colors[status] || 'status-pending';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pendiente': 'Pendiente',
      'confirmado': 'Confirmado',
      'enviado': 'Enviado',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return labels[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchSearch = order.usuario.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        `#${order.idpedidos}`.includes(searchTerm);
    const matchStatus = filter === 'all' || order.estado === filter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Gestión de Pedidos" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>📋 Pedidos</h2>
              <div className="filter-group">
                <input
                  type="text"
                  placeholder="🔍 Buscar pedido o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  style={{ maxWidth: '200px' }}
                />
                <select 
                  className="filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            
            {loading ? (
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
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                          No se encontraron pedidos
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.idpedidos}>
                          <td><strong>#{order.idpedidos}</strong></td>
                          <td>{order.usuario.nombreCompleto}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString('es-CL')}</td>
                          <td>{formatPrice(order.total)}</td>
                          <td>
                            <span className={`order-status ${getStatusColor(order.estado)}`}>
                              {getStatusLabel(order.estado)}
                            </span>
                          </td>
                          <td>
                            <select
                              className="status-select"
                              value={order.estado}
                              onChange={(e) => updateOrderStatus(order.idpedidos, e.target.value)}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="confirmado">Confirmado</option>
                              <option value="enviado">Enviado</option>
                              <option value="entregado">Entregado</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                            <button className="btn-action view" title="Ver detalles">👁️</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="pagination-info">
                  Mostrando {filteredOrders.length} de {orders.length} pedidos
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;