import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { pedidoService } from '../../services/pedidoService';
import { formatPrice } from '../../config/currency';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminOrders.css';

// ============================================
// CONSTANTES
// ============================================
const ORDER_STATUSES = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Confirmado', label: 'Confirmado' },
  { value: 'Enviado', label: 'Enviado' },
  { value: 'Entregado', label: 'Entregado' },
  { value: 'Cancelado', label: 'Cancelado' }
];

const STATUS_COLORS = {
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

const STATUS_LABELS = {
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

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const AdminOrders = () => {
  // ===== STATE =====
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // ===== LOAD ORDERS =====
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedidoService.getAll();
      setOrders(data || []);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError(err.response?.data?.Error || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ===== FILTER ORDERS =====
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const customerName = order.usuario?.nombreCompleto || 
                          order.usuario?.nombre || 
                          order.cliente || 
                          '';
      
      const matchSearch = 
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `#${order.idpedidos || order.id}`.includes(searchTerm) ||
        (order.id && `#${order.id}`.includes(searchTerm));
      
      const matchStatus = filter === 'all' || 
                         (order.estado && order.estado.toLowerCase() === filter.toLowerCase()) ||
                         (order.estado === filter);
      
      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, filter]);

  // ===== ORDER STATS =====
  const orderStats = useMemo(() => {
    const total = orders.length;
    const pendientes = orders.filter(o => o.estado?.toLowerCase() === 'pendiente').length;
    const confirmados = orders.filter(o => o.estado?.toLowerCase() === 'confirmado').length;
    const enviados = orders.filter(o => o.estado?.toLowerCase() === 'enviado').length;
    const entregados = orders.filter(o => o.estado?.toLowerCase() === 'entregado').length;
    const cancelados = orders.filter(o => o.estado?.toLowerCase() === 'cancelado').length;

    return { total, pendientes, confirmados, enviados, entregados, cancelados };
  }, [orders]);

  // ===== HANDLERS =====
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      
      let result;
      switch (newStatus.toLowerCase()) {
        case 'confirmado':
          result = await pedidoService.confirmar(orderId);
          break;
        case 'enviado':
          result = await pedidoService.enviar(orderId);
          break;
        case 'entregado':
          result = await pedidoService.entregar(orderId);
          break;
        case 'cancelado':
          result = await pedidoService.cancelar(orderId);
          break;
        default:
          // actualizar directamente
          result = await pedidoService.update(orderId, { estado: newStatus });
          break;
      }
      
      // Actualizar localmente
      setOrders(orders.map(order => 
        (order.idpedidos === orderId || order.id === orderId) 
          ? { ...order, estado: newStatus } 
          : order
      ));
      
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert(err.response?.data?.Error || 'Error al actualizar el estado del pedido');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de cancelar este pedido?')) return;
    try {
      await pedidoService.cancelar(orderId);
      await loadOrders();
    } catch (err) {
      console.error('Error al cancelar pedido:', err);
      alert(err.response?.data?.Error || 'Error al cancelar el pedido');
    }
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
  };

  // ===== HELPERS =====
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || 'status-pending';
  };

  const getStatusLabel = (status) => {
    return STATUS_LABELS[status] || status || 'Pendiente';
  };

  const getCustomerName = (order) => {
    return order.usuario?.nombreCompleto || 
           order.usuario?.nombre || 
           order.cliente || 
           'Cliente';
  };

  const getOrderId = (order) => {
    return order.idpedidos || order.id;
  };

  const hasActiveFilters = searchTerm || filter !== 'all';

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Gestión de Pedidos" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando pedidos<span className="dots">...</span></div>
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
          <AdminHeader title="Gestión de Pedidos" />
          <div className="admin-content">
            <div className="admin-page-content">
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadOrders}>Reintentar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: ORDERS
  // ============================================
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Gestión de Pedidos" />
        <div className="admin-content">
          <div className="admin-page-content">
            {/* Page Header */}
            <div className="page-header">
              <h2>📋 Pedidos</h2>
              <button className="btn-primary" onClick={loadOrders} title="Recargar pedidos">
                🔄 Recargar
              </button>
            </div>

            {/* Stats */}
            <div className="order-stats">
              <div className="order-stat-card">
                <span className="stat-number">{orderStats.total}</span>
                <span className="stat-label">📦 Total</span>
              </div>
              <div className="order-stat-card">
                <span className="stat-number">{orderStats.pendientes}</span>
                <span className="stat-label">⏳ Pendientes</span>
              </div>
              <div className="order-stat-card">
                <span className="stat-number">{orderStats.confirmados}</span>
                <span className="stat-label">✅ Confirmados</span>
              </div>
              <div className="order-stat-card">
                <span className="stat-number">{orderStats.enviados}</span>
                <span className="stat-label">🚚 Enviados</span>
              </div>
              <div className="order-stat-card">
                <span className="stat-number">{orderStats.entregados}</span>
                <span className="stat-label">📬 Entregados</span>
              </div>
              <div className="order-stat-card">
                <span className="stat-number">{orderStats.cancelados}</span>
                <span className="stat-label">❌ Cancelados</span>
              </div>
            </div>

            {/* Filters */}
            <div className="orders-filters">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar por cliente o ID de pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select 
                className="order-status-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {ORDER_STATUSES.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  ✕ Limpiar filtros
                </button>
              )}
            </div>

            {/* Table */}
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
                      <td colSpan="6" className="no-results">
                        <div className="empty-state">
                          <span className="empty-icon">📭</span>
                          <p>No se encontraron pedidos</p>
                          <span className="empty-sub">Prueba con otros filtros</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const orderId = getOrderId(order);
                      const isUpdating = updatingStatus === orderId;
                      
                      return (
                        <tr key={orderId}>
                          <td><strong>#{orderId}</strong></td>
                          <td>{getCustomerName(order)}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td className="product-price">{formatPrice(order.total)}</td>
                          <td>
                            <span className={`order-status-badge ${getStatusColor(order.estado)}`}>
                              {getStatusLabel(order.estado)}
                            </span>
                          </td>
                          <td>
                            <div className="order-actions">
                              <select
                                className="order-status-change"
                                value={order.estado || 'pendiente'}
                                onChange={(e) => updateOrderStatus(orderId, e.target.value)}
                                disabled={isUpdating}
                              >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Enviado">Enviado</option>
                                <option value="Entregado">Entregado</option>
                                <option value="Cancelado">Cancelado</option>
                              </select>
                              <button 
                                className="btn-action btn-action-view" 
                                onClick={() => viewOrderDetail(order)}
                                title="Ver detalles"
                              >
                                👁️
                              </button>
                              {order.estado?.toLowerCase() !== 'cancelado' && 
                               order.estado?.toLowerCase() !== 'entregado' && (
                                <button 
                                  className="btn-action btn-action-delete" 
                                  onClick={() => cancelOrder(orderId)}
                                  title="Cancelar pedido"
                                >
                                  ❌
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="table-footer">
              <div className="pagination-info">
                Mostrando <strong>{filteredOrders.length}</strong> de <strong>{orders.length}</strong> pedidos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetail(false);
            setSelectedOrder(null);
          }}
          formatDate={formatDate}
          getStatusLabel={getStatusLabel}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};

// ============================================
// ORDER DETAIL MODAL
// ============================================
const OrderDetailModal = ({ 
  order, 
  onClose, 
  formatDate, 
  getStatusLabel,
  getStatusColor 
}) => {
  const orderId = order.idpedidos || order.id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-order-detail" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📋 Detalle del Pedido #{orderId}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Cliente</span>
            <span>{order.usuario?.nombreCompleto || order.usuario?.nombre || 'Cliente'}</span>
          </div>
          <div className="summary-row">
            <span>Fecha</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="summary-row">
            <span>Estado</span>
            <span className={`order-status-badge ${getStatusColor(order.estado)}`}>
              {getStatusLabel(order.estado)}
            </span>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <span className="product-price">{formatPrice(order.total)}</span>
          </div>
        </div>

        {order.productos && order.productos.length > 0 && (
          <div className="order-products">
            <h4>🛒 Productos</h4>
            <div className="order-products-list">
              {order.productos.map((product, index) => (
                <div key={index} className="order-product-item">
                  <span className="product-name-small">{product.nombre || 'Producto'}</span>
                  <span className="product-qty">x{product.cantidad || 1}</span>
                  <span className="product-price-small">{formatPrice(product.precio || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;