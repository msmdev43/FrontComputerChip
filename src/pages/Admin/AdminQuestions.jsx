// src/pages/Admin/AdminPaymentMethods.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import clienteAxios from '../../config/axiosClient';
import { ENDPOINTS } from '../../config/config';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminPaymentMethods.css';

const AdminPaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({ tipo: '', descuento: '', tieneDesc: false });
  const [submitting, setSubmitting] = useState(false);

  const loadMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteAxios.get(ENDPOINTS.metodosPago.base);
      setMethods(response.data || []);
    } catch (err) {
      console.error('Error al cargar métodos de pago:', err);
      setError(err.response?.data?.Error || 'Error al cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMethods(); }, [loadMethods]);

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
    if (!formData.tipo.trim()) {
      alert('El tipo es obligatorio');
      return;
    }
    try {
      setSubmitting(true);
      const data = {
        ...formData,
        descuento: parseFloat(formData.descuento) || 0
      };
      if (editingMethod) {
        await clienteAxios.put(ENDPOINTS.metodosPago.porId(editingMethod.id), data);
      } else {
        await clienteAxios.post(ENDPOINTS.metodosPago.base, data);
      }
      setShowModal(false);
      setEditingMethod(null);
      setFormData({ tipo: '', descuento: '', tieneDesc: false });
      await loadMethods();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este método de pago?')) return;
    try {
      await clienteAxios.delete(ENDPOINTS.metodosPago.porId(id));
      await loadMethods();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Métodos de Pago" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando métodos de pago<span className="dots">...</span></div>
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
        <AdminHeader title="Métodos de Pago" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>💳 Métodos de Pago</h2>
              <button className="btn-primary" onClick={() => { setEditingMethod(null); setFormData({ tipo: '', descuento: '', tieneDesc: false }); setShowModal(true); }}>
                ➕ Agregar Método
              </button>
            </div>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadMethods}>Reintentar</button>
              </div>
            )}

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Descuento</th>
                    <th>Tiene Descuento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {methods.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-results">
                        <div className="empty-state">
                          <span className="empty-icon">📭</span>
                          <p>No hay métodos de pago</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    methods.map(method => (
                      <tr key={method.id}>
                        <td>#{method.id}</td>
                        <td><strong>{method.tipo}</strong></td>
                        <td>{formatPrice(method.descuento)}</td>
                        <td>
                          <span className={`status-badge ${method.tieneDesc ? 'status-active' : 'status-inactive'}`}>
                            {method.tieneDesc ? '✅ Sí' : '❌ No'}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action btn-action-edit" onClick={() => { setEditingMethod(method); setFormData(method); setShowModal(true); }}>✏️</button>
                          <button className="btn-action btn-action-delete" onClick={() => handleDelete(method.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <div className="pagination-info">
                Total: <strong>{methods.length}</strong> métodos de pago
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingMethod ? '✏️ Editar Método' : '➕ Nuevo Método'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo *</label>
                <input type="text" value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} placeholder="Ej: Tarjeta de Crédito" required disabled={submitting} />
              </div>
              <div className="form-group">
                <label>Descuento</label>
                <input type="number" value={formData.descuento} onChange={e => setFormData({ ...formData, descuento: e.target.value })} min="0" step="0.01" disabled={submitting} />
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={formData.tieneDesc} onChange={e => setFormData({ ...formData, tieneDesc: e.target.checked })} disabled={submitting} />
                  Tiene Descuento
                </label>
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

export default AdminPaymentMethods;