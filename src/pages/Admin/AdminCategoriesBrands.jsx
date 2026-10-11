import AdminActionDialog from '../../components/Admin/AdminActionDialog';
import { serverError } from '../../utils/adminProductForm';
import '../../styles/admin/ComputerChipAdmin.css';
import '../../styles/admin/AdminCatalogOrders.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [actionError, setActionError] = useState('');
  const lock = useRef(false);
  const nameRef = useRef(null);

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
    if (lock.current) return;
    setFormError('');
    if (!nombre.trim()) {
      setFormError('El nombre es obligatorio');
      return;
    }

    lock.current = true;
    try {
      setSubmitting(true);
      const isCategory = activeTab === 'categories';
      const service = isCategory ? categoriaService : marcaService;

      if (editingItem) {
        const itemId = editingItem.id || editingItem.idcategoria || editingItem.idmarca;
        await service.update(itemId, { nombre: nombre.trim() });
      } else {
        await service.create({ nombre: nombre.trim() });
      }

      setNotice(editingItem ? 'Cambios guardados correctamente.' : 'Registro creado correctamente.');
      setNombre('');
      setEditingItem(null);
      await fetchData();
    } catch (err) {
      console.error('Error al guardar:', err);
      setFormError(serverError(err));
    } finally {
      setSubmitting(false);
      lock.current = false;
    }
  };

  // Start Edit Mode
  const handleEdit = (item) => {
    setEditingItem(item);
    setNombre(item.nombre || '');
    setFormError('');
    nameRef.current?.focus();
    nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const requestAction = (id, type) => {
    if (lock.current) return;
    setActionError('');
    setConfirmation({ id, type, tab: activeTab });
  };
  const handleDelete = id => requestAction(id, 'delete');
  const handleRestore = id => requestAction(id, 'restore');
  const confirmAction = async () => {
    if (lock.current || !confirmation) return;
    lock.current = true; setSubmitting(true); setActionError('');
    try {
      const service = confirmation.tab === 'categories' ? categoriaService : marcaService;
      await service[confirmation.type](confirmation.id);
      setNotice(confirmation.type === 'restore' ? 'Registro restaurado correctamente.' : 'Registro desactivado correctamente.');
      setConfirmation(null); cancelEdit();
      await fetchData();
    } catch (err) { setActionError(serverError(err)); }
    finally { lock.current = false; setSubmitting(false); }
  };

  const cancelEdit = () => {
    setFormError('');
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
      <div className="admin-dashboard cc-admin-ui cc-catalog-page">
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
      <div className="admin-dashboard cc-admin-ui cc-catalog-page">
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
    <div className="admin-dashboard cc-admin-ui cc-catalog-page">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Categorías y Marcas" />
        <div className="admin-content">
          <div className="admin-page-content">
            
            <div className="page-header"><div><span className="cc-eyebrow">ORGANIZACIÓN DEL CATÁLOGO</span><h2>Categorías y marcas</h2><p className="cc-page-description">Ordená tus productos para que sean más fáciles de encontrar.</p></div></div>
            {notice && <div className="cc-feedback" role="status"><span>✓ {notice}</span><button onClick={() => setNotice('')} aria-label="Cerrar aviso">×</button></div>}
            {/* Tabs Selector */}
            <div className="cat-tabs">
              <button 
                disabled={submitting} aria-pressed={activeTab === 'categories'} className={`cat-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => { setActiveTab('categories'); cancelEdit(); }}
              >
                Categorías ({categories.length})
              </button>
              <button 
                disabled={submitting} aria-pressed={activeTab === 'brands'} className={`cat-tab-btn ${activeTab === 'brands' ? 'active' : ''}`}
                onClick={() => { setActiveTab('brands'); cancelEdit(); }}
              >
                Marcas ({brands.length})
              </button>
            </div>

            <div className="cat-grid-layout">
              {/* Form Card */}
              <div className="cat-card cat-form-card">
                <h3>
                  {editingItem ? 'Editar' : 'Nueva'} {activeTab === 'categories' ? 'Categoría' : 'Marca'}
                </h3>
                <p className="cc-page-description">Usá un nombre breve y reconocible.</p><form onSubmit={handleSubmit}>
                  {formError && <div className="cc-feedback cc-feedback--error" role="alert">{formError}</div>}
                  <div className="form-group">
                    <label htmlFor="cc-catalog-name">Nombre</label>
                    <input
                      id="cc-catalog-name" ref={nameRef} type="text"
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
                <h3>Lista de {activeTab === 'categories' ? 'Categorías' : 'Marcas'}</h3>
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
                                        disabled={submitting} title="Editar" aria-label={`Editar ${item.nombre}`}
                                      >
                                        Editar
                                      </button>
                                      <button 
                                        className="btn-action btn-action-delete" 
                                        onClick={() => handleDelete(itemId)}
                                        disabled={submitting} title="Desactivar" aria-label={`Desactivar ${item.nombre}`}
                                      >
                                        ×
                                      </button>
                                    </>
                                  ) : (
                                    <button 
                                      className="btn-action btn-action-restore" 
                                      onClick={() => handleRestore(itemId)}
                                      disabled={submitting} title="Restaurar" aria-label={`Restaurar ${item.nombre}`}
                                    >
                                      ↻
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
      {confirmation && <AdminActionDialog
        title={confirmation.type === 'restore' ? 'Restaurar registro' : 'Desactivar registro'}
        description={confirmation.type === 'restore' ? 'El registro volverá a estar activo.' : 'El registro dejará de estar activo. Esta acción no lo elimina de forma permanente.'}
        label={confirmation.type === 'restore' ? 'Restaurar' : 'Desactivar'} danger={confirmation.type === 'delete'}
        busy={submitting} error={actionError} onCancel={() => { if (!submitting) setConfirmation(null); }} onConfirm={confirmAction} />}
    </div>
  );
};

export default AdminCategoriesBrands;