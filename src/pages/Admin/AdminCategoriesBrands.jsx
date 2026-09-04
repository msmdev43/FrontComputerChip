import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { categoriaService } from '../../services/categoriaService';
import { marcaService } from '../../services/marcaService';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminCategoriesBrands.css';

const AdminCategoriesBrands = () => {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'brands'
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [nombre, setNombre] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Load Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [catData, brandData] = await Promise.all([
        categoriaService.getAll(),
        marcaService.getAll()
      ]);
      setCategories(catData || []);
      setBrands(brandData || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.response?.data?.Error || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      setSubmitting(true);
      const isCategory = activeTab === 'categories';
      const service = isCategory ? categoriaService : marcaService;

      if (editingItem) {
        const itemId = editingItem.id || editingItem.idcategoria || editingItem.idmarca;
        await service.update(itemId, { nombre });
      } else {
        await service.create({ nombre });
      }

      setNombre('');
      setEditingItem(null);
      await fetchData();
    } catch (err) {
      console.error('Error al guardar:', err);
      alert(err.response?.data?.Error || 'Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  // Start Edit Mode
  const handleEdit = (item) => {
    setEditingItem(item);
    setNombre(item.nombre || '');
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
      const isCategory = activeTab === 'categories';
      const service = isCategory ? categoriaService : marcaService;
      await service.delete(id);
      await fetchData();
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert(err.response?.data?.Error || 'Error al eliminar el registro');
    }
  };

  // Restore 
  const handleRestore = async (id) => {
    if (!window.confirm('¿Restaurar este registro?')) return;

    try {
      const isCategory = activeTab === 'categories';
      const service = isCategory ? categoriaService : marcaService;
      await service.restore(id);
      await fetchData();
    } catch (err) {
      console.error('Error al restaurar:', err);
      alert(err.response?.data?.Error || 'Error al restaurar el registro');
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNombre('');
  };

  const currentList = activeTab === 'categories' ? categories : brands;
  const isActive = (item) => !item.deletedAt;

  // ============================================
  // RENDER: LOADING
  // ============================================
  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Categorías y Marcas" />
          <div className="admin-content">
            <div className="loading-container">
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
          <AdminHeader title="Categorías y Marcas" />
          <div className="admin-content">
            <div className="admin-page-content">
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={fetchData}>Reintentar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: MAIN
  // ============================================
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Categorías y Marcas" />
        <div className="admin-content">
          <div className="admin-page-content">
            
            {/* Tabs Selector */}
            <div className="cat-tabs">
              <button 
                className={`cat-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => { setActiveTab('categories'); cancelEdit(); }}
              >
                📁 Categorías ({categories.length})
              </button>
              <button 
                className={`cat-tab-btn ${activeTab === 'brands' ? 'active' : ''}`}
                onClick={() => { setActiveTab('brands'); cancelEdit(); }}
              >
                🏷️ Marcas ({brands.length})
              </button>
            </div>

            <div className="cat-grid-layout">
              {/* Form Card */}
              <div className="cat-card cat-form-card">
                <h3>
                  {editingItem ? '✏️ Editar' : '➕ Crear'} {activeTab === 'categories' ? 'Categoría' : 'Marca'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      placeholder={`Ej. ${activeTab === 'categories' ? 'Monitores' : 'Asus'}`}
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-actions-inline">
                    <button type="submit" className="btn-primary" disabled={submitting}>
                      {submitting ? 'Guardando...' : editingItem ? 'Actualizar' : 'Guardar'}
                    </button>
                    {editingItem && (
                      <button type="button" className="btn-secondary" onClick={cancelEdit} disabled={submitting}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List Table */}
              <div className="cat-card cat-table-card">
                <h3>📋 Lista de {activeTab === 'categories' ? 'Categorías' : 'Marcas'}</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="no-results">
                            <div className="empty-state">
                              <span className="empty-icon">📭</span>
                              <p>No hay registros</p>
                              <span className="empty-sub">
                                Crea tu primer {activeTab === 'categories' ? 'categoría' : 'marca'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentList.map((item) => {
                          const itemId = item.id || item.idcategoria || item.idmarca;
                          const active = isActive(item);
                          return (
                            <tr key={itemId} className={!active ? 'row-inactive' : ''}>
                              <td>#{itemId}</td>
                              <td><strong>{item.nombre}</strong></td>
                              <td>
                                <span className={`status-badge ${active ? 'status-active' : 'status-inactive'}`}>
                                  {active ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  {active ? (
                                    <>
                                      <button 
                                        className="btn-action btn-action-edit" 
                                        onClick={() => handleEdit(item)}
                                        title="Editar"
                                      >
                                        ✏️
                                      </button>
                                      <button 
                                        className="btn-action btn-action-delete" 
                                        onClick={() => handleDelete(itemId)}
                                        title="Eliminar"
                                      >
                                        🗑️
                                      </button>
                                    </>
                                  ) : (
                                    <button 
                                      className="btn-action btn-action-restore" 
                                      onClick={() => handleRestore(itemId)}
                                      title="Restaurar"
                                    >
                                      🔄
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
                <div className="table-footer">
                  <div className="pagination-info">
                    Total: <strong>{currentList.length}</strong> {activeTab === 'categories' ? 'categorías' : 'marcas'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesBrands;