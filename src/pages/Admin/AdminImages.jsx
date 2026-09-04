// src/pages/Admin/AdminImages.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import clienteAxios from '../../config/axiosClient';
import { ENDPOINTS } from '../../config/config';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminImages.css';

const AdminImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteAxios.get(ENDPOINTS.imagenes.base);
      setImages(response.data || []);
    } catch (err) {
      console.error('Error al cargar imágenes:', err);
      setError(err.response?.data?.Error || 'Error al cargar las imágenes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) return;
    try {
      await clienteAxios.delete(ENDPOINTS.imagenes.porId(id));
      await loadImages();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Imágenes" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando imágenes<span className="dots">...</span></div>
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
        <AdminHeader title="Imágenes" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>🖼️ Galería de Imágenes</h2>
              <button className="btn-primary" onClick={loadImages}>🔄 Recargar</button>
            </div>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadImages}>Reintentar</button>
              </div>
            )}

            <div className="images-grid">
              {images.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No hay imágenes</p>
                </div>
              ) : (
                images.map(img => (
                  <div key={img.id} className="image-card">
                    <img src={img.url} alt={img.nombre} onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x150?text=Sin+imagen';
                    }} />
                    <div className="image-info">
                      <p className="name">{img.nombre}</p>
                    </div>
                    <div className="image-actions">
                      <button className="btn-action btn-action-edit">✏️</button>
                      <button className="btn-action btn-action-delete" onClick={() => handleDelete(img.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="table-footer">
              <div className="pagination-info">
                Total: <strong>{images.length}</strong> imágenes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminImages;