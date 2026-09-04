// src/pages/Admin/AdminAttributes.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import clienteAxios from '../../config/axiosClient';
import { ENDPOINTS } from '../../config/config';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminAttributes.css';

const AdminAttributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadAttributes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteAxios.get(ENDPOINTS.atributos.base);
      setAttributes(response.data || []);
    } catch (err) {
      console.error('Error al cargar atributos:', err);
      setError(err.response?.data?.Error || 'Error al cargar los atributos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAttributes(); }, [loadAttributes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      setSubmitting(true);
      if (editingItem) {
        await clienteAxios.put(ENDPOINTS.atributos.porId(editingItem.id), formData);
      } else {
        await clienteAxios.post(ENDPOINTS.atributos.base, formData);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ nombre: '' });
      await loadAttributes();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este atributo?')) return;
    try {
      await clienteAxios.delete(ENDPOINTS.atributos.porId(id));
      await loadAttributes();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al eliminar');
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ nombre: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ nombre: item.nombre });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Atributos" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando atributos<span className="dots">...</span></div>
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
        <AdminHeader title="Atributos" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>🔧 Atributos</h2>
              <button className="btn-primary" onClick={openCreateModal}>
                ➕ Agregar Atributo
              </button>
            </div>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadAttributes}>Reintentar</button>
              </div>
            )}

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {attributes.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="no-results">
                        <div className="empty-state">
                          <span className="empty-icon">📭</span>
                          <p>No hay atributos</p>
                          <span className="empty-sub">Crea tu primer atributo</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    attributes.map(attr => (
                      <tr key={attr.id}>
                        <td>#{attr.id}</td>
                        <td>{attr.nombre}</td>
                        <td>
                          <button className="btn-action btn-action-edit" onClick={() => openEditModal(attr)}>✏️</button>
                          <button className="btn-action btn-action-delete" onClick={() => handleDelete(attr.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <div className="pagination-info">
                Total: <strong>{attributes.length}</strong> atributos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingItem ? '✏️ Editar Atributo' : '➕ Nuevo Atributo'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Color, Tamaño, Material..."
                  required
                  disabled={submitting}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>
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

export default AdminAttributes;