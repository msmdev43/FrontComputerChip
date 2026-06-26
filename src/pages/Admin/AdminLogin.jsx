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
  const { login } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validación simple (en producción usar API real)
      if (credentials.email === 'admin@computerchip.com' && credentials.password === 'admin123') {
        login({ email: credentials.email, role: 'admin' });
        navigate('/admin/dashboard');
      } else {
        setError('Credenciales incorrectas. Intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor intenta más tarde.');
    } finally {
      setLoading(false);
    }
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;