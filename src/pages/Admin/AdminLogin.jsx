// C:\xampp\htdocs\FrontComputerChip\src\pages\Admin\AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import CatLogo from '../../components/Admin/CatLogo';
import '../../styles/admin/AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdmin();

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular validación
    setTimeout(() => {
      // Credenciales de prueba
      if (credentials.email === 'admin@computerchip.com' && credentials.password === 'admin123') {
        login({ 
          email: credentials.email, 
          role: 'admin',
          name: 'Administrador'
        });
        navigate('/admin/dashboard');
      } else {
        setError('Credenciales incorrectas. Usa: admin@computerchip.com / admin123');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <CatLogo size={100} className="login-cat-logo" />
          <h1>Computer Chip</h1>
          <p>Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              placeholder="admin@computerchip.com"
              required
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="••••••••"
              required
              className="login-input"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="login-footer">
            <span>🐱 ¡Bienvenido, humano!</span>
            <span style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
              Credenciales: admin@computerchip.com / admin123
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;