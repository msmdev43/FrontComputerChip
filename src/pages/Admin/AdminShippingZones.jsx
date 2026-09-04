// src/pages/Admin/AdminShippingZones.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { zonaEnvioService } from '../../services/zonaEnvioService';
import { formatPrice } from '../../config/currency';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminShippingZones.css';

const AdminShippingZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [formData, setFormData] = useState({
    pais: '',
    provincia: '',
    ciudad: '',
    codigoPostal: '',
    costo: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await zonaEnvioService.getAll();
      setZones(data || []);
    } catch (err) {
      console.error('Error al cargar zonas de envío:', err);
      setError(err.response?.data?.Error || 'Error al cargar las zonas de envío');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadZones(); }, [loadZones]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pais.trim() || !formData.costo.trim()) {
      alert('País y Costo son obligatorios');
      return;
    }
    try {
      setSubmitting(true);
      const data = { ...formData };
      
      if (editingZone) {
        await zonaEnvioService.update(editingZone.id, data);
      } else {
        await zonaEnvioService.create(data);
      }
      
      setShowModal(false);
      setEditingZone(null);
      setFormData({ pais: '', provincia: '', ciudad: '', codigoPostal: '', costo: '' });
      await loadZones();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta zona de envío?')) return;
    try {
      await zonaEnvioService.delete(id);
      await loadZones();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al eliminar');
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      pais: zone.pais || '',
      provincia: zone.provincia || '',
      ciudad: zone.ciudad || '',
      codigoPostal: zone.codigoPostal || '',
      costo: zone.costo || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZone(null);
    setFormData({ pais: '', provincia: '', ciudad: '', codigoPostal: '', costo: '' });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Zonas de Envío" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando zonas de envío<span className="dots">...</span></div>
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
        <AdminHeader title="Zonas de Envío" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>🚚 Zonas de Envío</h2>
              <button className="btn-primary" onClick={() => { setEditingZone(null); setFormData({ pais: '', provincia: '', ciudad: '', codigoPostal: '', costo: '' }); setShowModal(true); }}>
                ➕ Agregar Zona
              </button>
            </div>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadZones}>Reintentar</button>
              </div>
            )}

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>País</th>
                    <th>Provincia</th>
                    <th>Ciudad</th>
                    <th>Código Postal</th>
                    <th>Costo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-results">
                        <div className="empty-state">
                          <span className="empty-icon">📭</span>
                          <p>No hay zonas de envío</p>
                          <span className="empty-sub">Crea tu primera zona de envío</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    zones.map(zone => (
                      <tr key={zone.id}>
                        <td>#{zone.id}</td>
                        <td><strong>{zone.pais}</strong></td>
                        <td>{zone.provincia || '-'}</td>
                        <td>{zone.ciudad || '-'}</td>
                        <td>{zone.codigoPostal || '-'}</td>
                        <td className="product-price">{zone.costo}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-action btn-action-edit" onClick={() => handleEdit(zone)} title="Editar">✏️</button>
                            <button className="btn-action btn-action-delete" onClick={() => handleDelete(zone.id)} title="Eliminar">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <div className="pagination-info">
                Total: <strong>{zones.length}</strong> zonas de envío
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingZone ? '✏️ Editar Zona' : '➕ Nueva Zona'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>País *</label>
                  <input 
                    type="text" 
                    value={formData.pais} 
                    onChange={e => setFormData({ ...formData, pais: e.target.value })} 
                    placeholder="Ej: Argentina" 
                    required 
                    disabled={submitting} 
                  />
                </div>
                <div className="form-group">
                  <label>Provincia</label>
                  <input 
                    type="text" 
                    value={formData.provincia} 
                    onChange={e => setFormData({ ...formData, provincia: e.target.value })} 
                    placeholder="Ej: Buenos Aires" 
                    disabled={submitting} 
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad</label>
                  <input 
                    type="text" 
                    value={formData.ciudad} 
                    onChange={e => setFormData({ ...formData, ciudad: e.target.value })} 
                    placeholder="Ej: CABA" 
                    disabled={submitting} 
                  />
                </div>
                <div className="form-group">
                  <label>Código Postal</label>
                  <input 
                    type="text" 
                    value={formData.codigoPostal} 
                    onChange={e => setFormData({ ...formData, codigoPostal: e.target.value })} 
                    placeholder="Ej: C1000" 
                    disabled={submitting} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Costo *</label>
                <input 
                  type="text" 
                  value={formData.costo} 
                  onChange={e => setFormData({ ...formData, costo: e.target.value })} 
                  placeholder="Ej: 5000 o $5.000" 
                  required 
                  disabled={submitting} 
                />
                <small style={{ color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                  Ejemplo: 5000 o $5.000 (Pesos Argentinos)
                </small>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShippingZones;