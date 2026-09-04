// src/pages/Admin/AdminOffers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import clienteAxios from '../../config/axiosClient';
import { ENDPOINTS } from '../../config/config';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminOffers.css';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    descuento: '',
    precioOriginal: '',
    precioOferta: '',
    tipoOferta: '',
    tipoDescuento: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteAxios.get(ENDPOINTS.ofertas.base);
      setOffers(response.data || []);
    } catch (err) {
      console.error('Error al cargar ofertas:', err);
      setError(err.response?.data?.Error || 'Error al cargar las ofertas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOffers(); }, [loadOffers]);

  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = {
        ...formData,
        descuento: parseFloat(formData.descuento),
        precioOriginal: parseFloat(formData.precioOriginal),
        precioOferta: parseFloat(formData.precioOferta)
      };
      if (editingOffer) {
        await clienteAxios.put(ENDPOINTS.ofertas.porId(editingOffer.id), data);
      } else {
        await clienteAxios.post(ENDPOINTS.ofertas.base, data);
      }
      setShowModal(false);
      setEditingOffer(null);
      setFormData({ titulo: '', subtitulo: '', descuento: '', precioOriginal: '', precioOferta: '', tipoOferta: '', tipoDescuento: '' });
      await loadOffers();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta oferta?')) return;
    try {
      await clienteAxios.delete(ENDPOINTS.ofertas.porId(id));
      await loadOffers();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Ofertas" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando ofertas<span className="dots">...</span></div>
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
        <AdminHeader title="Ofertas" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>🏷️ Ofertas y Promociones</h2>
              <button className="btn-primary" onClick={() => { setEditingOffer(null); setFormData({ titulo: '', subtitulo: '', descuento: '', precioOriginal: '', precioOferta: '', tipoOferta: '', tipoDescuento: '' }); setShowModal(true); }}>
                ➕ Nueva Oferta
              </button>
            </div>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadOffers}>Reintentar</button>
              </div>
            )}

            <div className="offers-grid">
              {offers.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No hay ofertas</p>
                </div>
              ) : (
                offers.map(offer => (
                  <div key={offer.id} className="offer-card">
                    <div className="offer-header">
                      <h3>{offer.titulo}</h3>
                      <span className="offer-discount">-{offer.descuento}%</span>
                    </div>
                    <p className="offer-subtitle">{offer.subtitulo}</p>
                    <div className="offer-prices">
                      <span className="original-price">{formatPrice(offer.precioOriginal)}</span>
                      <span className="offer-price">{formatPrice(offer.precioOferta)}</span>
                    </div>
                    <div className="offer-actions">
                      <button className="btn-action btn-action-edit" onClick={() => { setEditingOffer(offer); setFormData(offer); setShowModal(true); }}>✏️</button>
                      <button className="btn-action btn-action-delete" onClick={() => handleDelete(offer.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="table-footer">
              <div className="pagination-info">
                Total: <strong>{offers.length}</strong> ofertas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingOffer ? '✏️ Editar Oferta' : '➕ Nueva Oferta'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título *</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required disabled={submitting} />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <input type="text" value={formData.subtitulo} onChange={e => setFormData({ ...formData, subtitulo: e.target.value })} disabled={submitting} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Descuento (%) *</label>
                  <input type="number" value={formData.descuento} onChange={e => setFormData({ ...formData, descuento: e.target.value })} required min="0" max="100" disabled={submitting} />
                </div>
                <div className="form-group">
                  <label>Tipo de Oferta</label>
                  <input type="text" value={formData.tipoOferta} onChange={e => setFormData({ ...formData, tipoOferta: e.target.value })} disabled={submitting} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio Original *</label>
                  <input type="number" value={formData.precioOriginal} onChange={e => setFormData({ ...formData, precioOriginal: e.target.value })} required min="0" disabled={submitting} />
                </div>
                <div className="form-group">
                  <label>Precio Oferta *</label>
                  <input type="number" value={formData.precioOferta} onChange={e => setFormData({ ...formData, precioOferta: e.target.value })} required min="0" disabled={submitting} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffers;