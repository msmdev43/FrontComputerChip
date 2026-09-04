// src/pages/Admin/AdminCarts.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import clienteAxios from '../../config/axiosClient';
import { ENDPOINTS } from '../../config/config';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminCarts.css';

const AdminCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCart, setSelectedCart] = useState(null);

  const loadCarts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteAxios.get(ENDPOINTS.carrito.base);
      setCarts(response.data || []);
    } catch (err) {
      console.error('Error al cargar carritos:', err);
      setError(err.response?.data?.Error || 'Error al cargar los carritos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCarts(); }, [loadCarts]);

  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCartTotal = (cart) => {
    if (!cart.carritoProductos) return 0;
    return cart.carritoProductos.reduce((sum, cp) => sum + (cp.precioUnitario * cp.cantidad), 0);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'activo': 'Activo',
      'abandonado': 'Abandonado',
      'convertido': 'Convertido'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Carritos" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando carritos<span className="dots">...</span></div>
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
        <AdminHeader title="Carritos" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>🛒 Carritos de Compra</h2>
              <button className="btn-primary" onClick={loadCarts}>🔄 Recargar</button>
            </div>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadCarts}>Reintentar</button>
              </div>
            )}

            <div className="carts-grid">
              {carts.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No hay carritos</p>
                </div>
              ) : (
                carts.map(cart => (
                  <div key={cart.id} className="cart-card">
                    <div className="cart-header">
                      <span className="cart-id">Carrito #{cart.id}</span>
                      <span className={`cart-status ${cart.estado}`}>
                        {getStatusLabel(cart.estado)}
                      </span>
                    </div>
                    <div className="cart-info">
                      <span>👤 {cart.usuario?.nombreCompleto || 'Anónimo'}</span>
                      <span>📦 {cart.carritoProductos?.length || 0} productos</span>
                    </div>
                    <div className="cart-total">
                      Total: <strong>{formatPrice(getCartTotal(cart))}</strong>
                    </div>
                    <div className="cart-actions">
                      <button 
                        className="btn-action btn-action-view" 
                        onClick={() => setSelectedCart(cart)}
                      >
                        👁️ Ver detalles
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="table-footer">
              <div className="pagination-info">
                Total: <strong>{carts.length}</strong> carritos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DETALLE */}
      {selectedCart && (
        <div className="modal-overlay" onClick={() => setSelectedCart(null)}>
          <div className="modal-content modal-cart-detail" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🛒 Detalle del Carrito #{selectedCart.id}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedCart(null)}>✕</button>
            </div>
            <div className="cart-detail-info">
              <p><strong>Usuario:</strong> {selectedCart.usuario?.nombreCompleto || 'Anónimo'}</p>
              <p><strong>Estado:</strong> {getStatusLabel(selectedCart.estado)}</p>
              <p><strong>Fecha:</strong> {new Date(selectedCart.createdAt).toLocaleString('es-CL')}</p>
            </div>
            <div className="cart-products-list">
              <h4>Productos</h4>
              {selectedCart.carritoProductos?.map((cp, index) => (
                <div key={index} className="cart-product-item">
                  <span className="name">{cp.productos?.nombre || 'Producto'}</span>
                  <span className="qty">x{cp.cantidad}</span>
                  <span className="price">{formatPrice(cp.precioUnitario)}</span>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedCart(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarts;