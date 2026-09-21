import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { atributoService } from '../../services/attributesService';
import { productoService } from '../../services/productoService';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminAttributes.css';

const AdminAttributes = () => {
  // ============================================
  // LISTA DE ASIGNACIONES (lo que se muestra en la tabla)
  // ============================================
  const [asignaciones, setAsignaciones] = useState([]);

  // ============================================
  // LISTA DE ATRIBUTOS (para los selects / gestión)
  // ============================================
  const [atributos, setAtributos] = useState([]);

  // ============================================
  // ESTADO GENERAL
  // ============================================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // ============================================
  // MODAL: CREAR / EDITAR ASIGNACIÓN
  // ============================================
  const [showModal, setShowModal] = useState(false);
  const [editingAsignacion, setEditingAsignacion] = useState(null);
  const [formAsignacion, setFormAsignacion] = useState({
    productoId: '',
    atributoId: '',
    valor: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // ============================================
  // PRODUCTOS (para el select)
  // ============================================
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  // ============================================
  // CARGAR TODO
  // ============================================
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [asigsData, atrsData] = await Promise.all([
        atributoService.getAllAsignaciones(),
        atributoService.getAll(),
      ]);

      setAsignaciones(Array.isArray(asigsData) ? asigsData : []);
      setAtributos(Array.isArray(atrsData) ? atrsData : []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(
        err.response?.data?.Error || 'Error al cargar los datos'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadAll();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadAll]);

  // Cargar productos la primera vez que se abre el modal
  const loadProductos = useCallback(async () => {
    if (productos.length > 0) return;
    try {
      setLoadingProductos(true);
      const data = await productoService.getAll();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoadingProductos(false);
    }
  }, [productos.length]);

  // ============================================
  // FILTRO DE BÚSQUEDA
  // ============================================
  const asignacionesFiltradas = useMemo(() => {
    const term = busqueda.toLowerCase().trim();
    if (!term) return asignaciones;

    return asignaciones.filter(
      (a) =>
        (a.atributoNombre || '').toLowerCase().includes(term) ||
        (a.productoNombre || '').toLowerCase().includes(term) ||
        (a.valor || '').toLowerCase().includes(term)
    );
  }, [asignaciones, busqueda]);

  // ============================================
  // MODAL HANDLERS
  // ============================================
  const openCreateModal = () => {
    setEditingAsignacion(null);
    setFormAsignacion({ productoId: '', atributoId: '', valor: '' });
    setShowModal(true);
    loadProductos();
  };

  const openEditModal = (asignacion) => {
    setEditingAsignacion(asignacion);
    setFormAsignacion({
      productoId: asignacion.productoId,
      atributoId: asignacion.atributoId,
      valor: asignacion.valor,
    });
    setShowModal(true);
    loadProductos();
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setEditingAsignacion(null);
    setFormAsignacion({ productoId: '', atributoId: '', valor: '' });
  };

  // ============================================
  // SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formAsignacion.productoId || !formAsignacion.atributoId) {
      alert('Seleccioná un producto y un atributo');
      return;
    }

    if (!formAsignacion.valor.trim()) {
      alert('El valor es obligatorio');
      return;
    }

    try {
      setSubmitting(true);

      if (editingAsignacion) {
        // Actualizar valor
        await atributoService.actualizarValor(
          formAsignacion.productoId,
          formAsignacion.atributoId,
          formAsignacion.valor.trim()
        );
      } else {
        // Crear asignación
        await atributoService.asignarAProducto(formAsignacion.productoId, [
          {
            atributoId: Number(formAsignacion.atributoId),
            valor: formAsignacion.valor.trim(),
          },
        ]);
      }

      closeModal();
      await loadAll();
    } catch (err) {
      console.error('Error al guardar:', err);
      alert(
        err.response?.data?.Error ||
          err.response?.data ||
          'Error al guardar'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // DELETE
  // ============================================
  const handleDelete = async (asignacion) => {
    if (
      !window.confirm(
        `¿Quitar el atributo "${asignacion.atributoNombre}" del producto "${asignacion.productoNombre}"?`
      )
    )
      return;

    try {
      await atributoService.quitarDeProducto(
        asignacion.productoId,
        asignacion.atributoId
      );
      await loadAll();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al eliminar');
    }
  };

  // ============================================
  // RENDER: LOADING
  // ============================================
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
              <div className="loading-text">
                Cargando atributos<span className="dots">...</span>
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
        <AdminHeader title="Atributos" />
        <div className="admin-content">
          <div className="admin-page-content">
            {/* HEADER */}
            <div className="page-header">
              <h2>🔧 Atributos de Productos</h2>
              <button className="btn-primary" onClick={openCreateModal}>
                ➕ Agregar Atributo a Producto
              </button>
            </div>

            {/* BUSCADOR */}
            <div className="atributos-search">
              <input
                type="text"
                placeholder="🔍 Buscar por atributo, producto o valor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="filtro-input"
              />
            </div>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadAll}>
                  Reintentar
                </button>
              </div>
            )}

            {/* TABLA */}
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Atributo</th>
                    <th>Producto</th>
                    <th>Valor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asignacionesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="no-results">
                        <div className="empty-state">
                          <span className="empty-icon">📭</span>
                          <p>
                            {busqueda
                              ? 'No se encontraron resultados'
                              : 'No hay atributos asignados'}
                          </p>
                          <span className="empty-sub">
                            {busqueda
                              ? 'Probá con otro término'
                              : 'Asigná un atributo a un producto'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    asignacionesFiltradas.map((a, idx) => (
                      <tr key={`${a.productoId}-${a.atributoId}-${idx}`}>
                        <td>
                          <span className="atributo-badge">
                            {a.atributoNombre}
                          </span>
                        </td>
                        <td>{a.productoNombre}</td>
                        <td>
                          <span className="valor-badge">{a.valor}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-action-edit"
                              title="Editar valor"
                              onClick={() => openEditModal(a)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-action btn-action-delete"
                              title="Quitar del producto"
                              onClick={() => handleDelete(a)}
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
                Mostrando <strong>{asignacionesFiltradas.length}</strong> de{' '}
                <strong>{asignaciones.length}</strong> asignaciones
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MODAL: CREAR / EDITAR ASIGNACIÓN              */}
      {/* ============================================ */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content modal-attribute"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {editingAsignacion
                  ? '✏️ Editar Valor'
                  : '➕ Asignar Atributo a Producto'}
              </h3>
              <button
                className="modal-close-btn"
                onClick={closeModal}
                disabled={submitting}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Producto */}
              <div className="form-group">
                <label>
                  Producto <span className="required">*</span>
                </label>
                <select
                  value={formAsignacion.productoId}
                  onChange={(e) =>
                    setFormAsignacion({
                      ...formAsignacion,
                      productoId: e.target.value,
                    })
                  }
                  required
                  disabled={submitting || loadingProductos || !!editingAsignacion}
                  className="filtro-input filtro-input--select"
                >
                  <option value="">
                    {loadingProductos
                      ? 'Cargando productos...'
                      : 'Seleccioná un producto'}
                  </option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Atributo */}
              <div className="form-group">
                <label>
                  Atributo <span className="required">*</span>
                </label>
                <select
                  value={formAsignacion.atributoId}
                  onChange={(e) =>
                    setFormAsignacion({
                      ...formAsignacion,
                      atributoId: e.target.value,
                    })
                  }
                  required
                  disabled={submitting || !!editingAsignacion}
                  className="filtro-input filtro-input--select"
                >
                  <option value="">Seleccioná un atributo</option>
                  {atributos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Valor */}
              <div className="form-group">
                <label>
                  Valor <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formAsignacion.valor}
                  onChange={(e) =>
                    setFormAsignacion({
                      ...formAsignacion,
                      valor: e.target.value,
                    })
                  }
                  placeholder="Ej: AM4, DDR5, 16GB..."
                  required
                  maxLength={65}
                  disabled={submitting}
                  autoFocus
                />
                <small className="form-hint">
                  {formAsignacion.valor.length}/65 caracteres
                </small>
              </div>

              {editingAsignacion && (
                <div className="form-hint-box">
                  💡 En edición solo podés cambiar el valor. Si querés mover el
                  atributo a otro producto, eliminalo y creá uno nuevo.
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
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