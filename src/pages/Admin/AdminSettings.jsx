import React, { useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import '../../styles/admin/AdminDashboard.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Computer Chip',
    siteEmail: 'info@computerchip.com',
    currency: 'CLP',
    taxRate: '19',
    maintenanceMode: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Configuración guardada exitosamente! 🎉');
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Configuración" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="settings-container">
              <h2>⚙️ Configuración General</h2>
              
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label>Nombre del Sitio</label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="settings-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email de Contacto</label>
                  <input
                    type="email"
                    name="siteEmail"
                    value={settings.siteEmail}
                    onChange={handleChange}
                    className="settings-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Moneda</label>
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className="settings-select"
                    >
                      <option value="CLP">CLP - Peso Chileno</option>
                      <option value="USD">USD - Dólar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>IVA (%)</label>
                    <input
                      type="number"
                      name="taxRate"
                      value={settings.taxRate}
                      onChange={handleChange}
                      className="settings-input"
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleChange}
                    />
                    Modo Mantenimiento
                  </label>
                </div>

                <button type="submit" className="btn-primary">
                  💾 Guardar Configuración
                </button>
              </form>

              <div className="settings-actions">
                <h3>Acciones del Sistema</h3>
                <div className="action-buttons">
                  <button className="btn-danger">🗑️ Limpiar Caché</button>
                  <button className="btn-warning">📊 Exportar Datos</button>
                  <button className="btn-info">📋 Ver Logs</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;