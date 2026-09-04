// src/pages/Admin/AdminSupport.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import clienteAxios from '../../config/axiosClient';
import { ENDPOINTS } from '../../config/config';
import '../../styles/Spinner.css';
import '../../styles/admin/AdminSupport.css';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteAxios.get(ENDPOINTS.soporte.base);
      setTickets(response.data || []);
    } catch (err) {
      console.error('Error al cargar tickets:', err);
      setError(err.response?.data?.Error || 'Error al cargar los tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este ticket?')) return;
    try {
      await clienteAxios.delete(ENDPOINTS.soporte.porId(id));
      await loadTickets();
    } catch (err) {
      alert(err.response?.data?.Error || 'Error al eliminar');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader title="Soporte" />
          <div className="admin-content">
            <div className="loading-container">
              <div className="spinner-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="loading-text">Cargando tickets<span className="dots">...</span></div>
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
        <AdminHeader title="Soporte" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="page-header">
              <h2>🎫 Tickets de Soporte</h2>
              <button className="btn-primary" onClick={loadTickets}>🔄 Recargar</button>
            </div>

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button className="btn-primary" onClick={loadTickets}>Reintentar</button>
              </div>
            )}

            <div className="tickets-list">
              {tickets.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No hay tickets de soporte</p>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-header">
                      <span className="ticket-id">Ticket #{ticket.id}</span>
                      <span className="ticket-date">{formatDate(ticket.fecha)}</span>
                    </div>
                    <div className="ticket-customer">
                      <span>👤 <strong>{ticket.nombreCompleto}</strong></span>
                      <span className="email">📧 {ticket.email}</span>
                      {ticket.telefono && <span>📞 {ticket.telefono}</span>}
                    </div>
                    <div className="ticket-message">
                      {ticket.mensaje}
                    </div>
                    <div className="ticket-actions">
                      <button className="btn-action btn-action-view" onClick={() => setSelectedTicket(ticket)}>👁️ Ver completo</button>
                      <button className="btn-action btn-action-delete" onClick={() => handleDelete(ticket.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="table-footer">
              <div className="pagination-info">
                Total: <strong>{tickets.length}</strong> tickets
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DETALLE */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content modal-ticket-detail" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎫 Ticket #{selectedTicket.id}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedTicket(null)}>✕</button>
            </div>
            <div className="ticket-detail-info">
              <p><strong>Nombre:</strong> {selectedTicket.nombreCompleto}</p>
              <p><strong>Email:</strong> {selectedTicket.email}</p>
              {selectedTicket.telefono && <p><strong>Teléfono:</strong> {selectedTicket.telefono}</p>}
              <p><strong>Fecha:</strong> {formatDate(selectedTicket.fecha)}</p>
            </div>
            <div className="ticket-detail-message">
              <h4>Mensaje</h4>
              <p>{selectedTicket.mensaje}</p>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedTicket(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;