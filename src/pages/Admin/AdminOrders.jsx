import AdminActionDialog from '../../components/Admin/AdminActionDialog';
import { serverError } from '../../utils/adminProductForm';
import '../../styles/admin/ComputerChipAdmin.css';
import '../../styles/admin/AdminCatalogOrders.css';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { orderCustomer, orderStatus } from '../../utils/orderUtils';
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
  const [detailLoading, setDetailLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const actionLock = useRef(false);
  const detailLock = useRef(false);

  // ===== LOAD ORDERS =====
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedidoService.getAll();
      setOrders((data || []).map(order => ({ ...order, estado: orderStatus(order.estado) })));
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
      const customerName = orderCustomer(order);
      
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
  const updateOrderStatus = (orderId, newStatus) => {
    if (actionLock.current) return;
    setActionError(''); setConfirmation({ orderId, newStatus });
  };
  const cancelOrder = orderId => updateOrderStatus(orderId, 'Cancelado');
  const confirmStatus = async () => {
    if (actionLock.current || !confirmation) return;
    const { orderId, newStatus } = confirmation;
    const action = { Confirmado: 'confirmar', Enviado: 'enviar', Entregado: 'entregar', Cancelado: 'cancelar' }[newStatus];
    if (!action) return;
    actionLock.current = true; setUpdatingStatus(orderId); setActionError('');
    try {
      await pedidoService[action](orderId);
      setOrders(current => current.map(order => (order.idpedidos || order.id) === orderId ? { ...order, estado: newStatus } : order));
      setNotice(`Pedido #${orderId}: estado actualizado a ${newStatus.toLowerCase()}.`);
      setConfirmation(null);
    } catch (err) { setActionError(serverError(err)); }
    finally { actionLock.current = false; setUpdatingStatus(null); }
  };

  const viewOrderDetail = async (order) => {
    if (detailLock.current) return;
    detailLock.current = true; setActionError('');
    setDetailLoading(true);
    try {
      const detail = await pedidoService.getById(order.idpedidos || order.id);
      setSelectedOrder({ ...detail, estado: orderStatus(detail.estado) });
      setShowOrderDetail(true);
    } catch (err) {
      setActionError(serverError(err));
    } finally { detailLock.current = false; setDetailLoading(false); }
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

  const getCustomerName = orderCustomer;

  const getOrderId = (order) => {
    return order.idpedidos || order.id;
  };

  const hasActiveFilters = searchTerm || filter !== 'all';

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="admin-dashboard cc-admin-ui cc-orders-page">
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
      <div className="admin-dashboard cc-admin-ui cc-orders-page">
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
    <div className="admin-dashboard cc-admin-ui cc-orders-page">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Gestión de Pedidos" />
        <div className="admin-content">
          <div className="admin-page-content">
            {/* Page Header */}
            <div className="page-header">
              <div><span className="cc-eyebrow">VENTAS Y SEGUIMIENTO</span><h2>Tus pedidos</h2><p className="cc-page-description">Consultá el detalle y administrá el estado de cada pedido.</p></div>
              <button className="btn-primary" onClick={loadOrders} disabled={updatingStatus !== null || detailLoading} title="Recargar pedidos">
                ↻ Actualizar
              </button>
            </div>

            {notice && <div className="cc-feedback" role="status"><span>✓ {notice}</span><button aria-label="Cerrar aviso" onClick={() => setNotice('')}>×</button></div>}
            {actionError && !confirmation && <p className="cc-feedback cc-feedback--error" role="alert">{actionError}</p>}
            {detailLoading && <p role="status" className="cc-page-description">Cargando detalle del pedido…</p>}
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
                  aria-label="Buscar pedidos" placeholder="Buscar por cliente o número de pedido…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select 
                className="order-status-select" aria-label="Filtrar por estado"
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
                          <p>{orders.length ? 'No hay coincidencias' : 'Todavía no hay pedidos'}</p>
                          <span className="empty-sub">{orders.length ? 'Probá con otro nombre o estado.' : 'Cuando se registren pedidos, aparecerán en esta lista.'}</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const orderId = getOrderId(order);
                      
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
                                disabled={updatingStatus !== null} aria-label={`Cambiar estado del pedido ${orderId}`}
                              >
                                <option value="Pendiente" disabled>Pendiente</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Enviado">Enviado</option>
                                <option value="Entregado">Entregado</option>
                                <option value="Cancelado">Cancelado</option>
                              </select>
                              <button 
                                className="btn-action btn-action-view" 
                                disabled={detailLoading} onClick={() => viewOrderDetail(order)}
                                title="Ver detalles" aria-label={`Ver pedido ${orderId}`}
                              >
                                Ver detalle
                              </button>
                              {order.estado?.toLowerCase() !== 'cancelado' && 
                               order.estado?.toLowerCase() !== 'entregado' && (
                                <button 
                                  className="btn-action btn-action-delete" 
                                  onClick={() => cancelOrder(orderId)}
                                  disabled={updatingStatus !== null} title="Cancelar pedido" aria-label={`Cancelar pedido ${orderId}`}
                                >
                                  ×
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

      {confirmation && <AdminActionDialog title={`Pedido #${confirmation.orderId}`}
        description={`¿Cambiar el estado a ${confirmation.newStatus.toLowerCase()}?`}
        label={confirmation.newStatus === 'Cancelado' ? 'Cancelar pedido' : 'Confirmar cambio'} danger={confirmation.newStatus === 'Cancelado'}
        busy={updatingStatus !== null} error={actionError} onCancel={() => { if (updatingStatus === null) { setConfirmation(null); setActionError(''); } }} onConfirm={confirmStatus} />}
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
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = overflow; if (opener?.isConnected) opener.focus(); };
  }, []);

  return (
    <dialog ref={dialogRef} className="cc-order-dialog" aria-labelledby="cc-order-title" onCancel={event => { event.preventDefault(); onClose(); }}>
      <div className="modal-content modal-order-detail" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div><span className="cc-eyebrow">DETALLE DE LA COMPRA</span><h3 id="cc-order-title">Pedido #{orderId}</h3></div>
          <button className="modal-close-btn" aria-label="Cerrar detalle" onClick={onClose}>✕</button>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Cliente</span>
            <span>{orderCustomer(order)}</span>
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

        {!order.items?.length && <p className="cc-order-empty">No hay productos informados en este pedido.</p>}
        {order.items && order.items.length > 0 && (
          <div className="order-products">
            <h4>🛒 Productos</h4>
            <div className="order-products-list">
              {order.items.map((product, index) => (
                <div key={index} className="order-product-item">
                  <span className="product-name-small">{product.productoNombre || 'Producto'}</span>
                  <span className="product-qty">x{product.cantidad || 1}</span>
                  <span className="product-price-small">{formatPrice(product.subtotal ?? (product.precioUnitario * product.cantidad))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-summary">
          <p><strong>Pago:</strong> {order.metodoPago || 'No informado'}</p>
          <p><strong>Zona:</strong> {order.zonaEnvio || 'No informada'}</p>
          <p><strong>Dirección:</strong> {order.direccionEnvio || 'No informada'}</p>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AdminOrders;