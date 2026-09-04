// src/pages/Admin/AdminSpecifications.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { especificacionService } from '../../services/especificacionService';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminSpecifications.css';

const AdminSpecifications = () => {
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadSpecs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await especificacionService.getAll();
      setSpecs(data || []);
    } catch (err) {
      console.error('Error al cargar especificaciones:', err);
      setError(err.response?.data?.Error || 'Error al cargar las especificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSpecs(); }, [loadSpecs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }
    if (!formData.descripcion.trim()) {
      alert('La descripción es obligatoria');
      return;
    }
    try {
      setSubmitting(true);
      if (editingSpec) {
        await especificacionService.update(editingSpec.id, formData);
      } else {
        await especificacionService.create(formData);
      }
      setShowModal(false);
      setEditingSpec(null);
      setFormData({ titulo: '', descripcion: '' });
      await loadSpecs();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta especificación?')) return;
    try {
      await especificacionService.delete(id);
      await loadSpecs();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al eliminar');
    }
  };

  const handleEdit = (spec) => {
    setEditingSpec(spec);
    setFormData({
      titulo: spec.titulo || '',
      descripcion: spec.descripcion || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSpec(null);
    setFormData({ titulo: '', descripcion: '' });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Especificaciones" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando especificaciones<span className="dots">...</span></div>
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
        <AdminHeader title="Especificaciones" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>📋 Especificaciones</h2>
              <button 
                className="btn-primary" 
                onClick={() => { 
                  setEditingSpec(null); 
                  setFormData({ titulo: '', descripcion: '' }); 
                  setShowModal(true); 
                }}
              >
                ➕ Agregar Especificación
              </button>
            </div>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadSpecs}>Reintentar</button>
              </div>
            )}

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {specs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="no-results">
                        <div className="empty-state">
                          <span className="empty-icon">📭</span>
                          <p>No hay especificaciones</p>
                          <span className="empty-sub">Crea tu primera especificación</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    specs.map(spec => (
                      <tr key={spec.id}>
                        <td>#{spec.id}</td>
                        <td><strong>{spec.titulo}</strong></td>
                        <td className="spec-description">{spec.descripcion}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-action btn-action-edit" 
                              onClick={() => handleEdit(spec)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-action btn-action-delete" 
                              onClick={() => handleDelete(spec.id)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
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
                Total: <strong>{specs.length}</strong> especificaciones
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingSpec ? '✏️ Editar Especificación' : '➕ Nueva Especificación'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título *</label>
                <input 
                  type="text" 
                  value={formData.titulo} 
                  onChange={e => setFormData({ ...formData, titulo: e.target.value })} 
                  placeholder="Ej: Procesador" 
                  required 
                  disabled={submitting} 
                />
              </div>
              <div className="form-group">
                <label>Descripción *</label>
                <textarea 
                  value={formData.descripcion} 
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })} 
                  placeholder="Ej: Intel Core i7-12700K" 
                  rows="4" 
                  required 
                  disabled={submitting} 
                />
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

export default AdminSpecifications;