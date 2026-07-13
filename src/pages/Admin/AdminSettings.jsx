// C:\xampp\htdocs\FrontComputerChip\src\pages\Admin\AdminSettings.jsx
import React, { useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import '../../styles/admin/AdminSettings.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Computer Chip',
    siteEmail: 'info@computerchip.com',
    currency: 'CLP',
    taxRate: '19',
    maintenanceMode: false
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
    // Limpiar mensaje al cambiar
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardar en localStorage para persistencia
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setMessage('✅ Configuración guardada exitosamente!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Cargar settings guardados al iniciar
  React.useEffect(() => {
    const saved = localStorage.getItem('adminSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (e) {
        console.error('Error al cargar settings:', e);
      }
    }
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Configuración" />
        <div className="admin-content">
          <div className="admin-page-content">
            <div className="settings-container">
              <h2>⚙️ Configuración General</h2>
              
              {message && (
                <div style={{
                  padding: '12px',
                  background: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  {message}
                </div>
              )}
              
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
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="form-check">
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

              <div className="settings-actions" style={{ marginTop: '32px' }}>
                <h3>Acciones del Sistema</h3>
                <div className="action-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button className="btn-danger" onClick={() => {
                    if (confirm('¿Estás seguro de limpiar la caché?')) {
                      localStorage.clear();
                      alert('Caché limpiada correctamente');
                    }
                  }}>
                    🗑️ Limpiar Caché
                  </button>
                  <button className="btn-warning" onClick={() => {
                    alert('Exportando datos... (simulación)');
                  }}>
                    📊 Exportar Datos
                  </button>
                  <button className="btn-info" onClick={() => {
                    alert('📋 Logs del sistema:\n\n' + 
                          '✅ Sistema operativo: Simulado\n' +
                          '✅ Versión: 1.0.0\n' +
                          '✅ Estado: Activo\n' +
                          '✅ Última actualización: ' + new Date().toLocaleString());
                  }}>
                    📋 Ver Logs
                  </button>
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