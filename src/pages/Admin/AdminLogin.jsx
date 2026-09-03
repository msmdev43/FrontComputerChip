import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import CatLogo from '../../components/Admin/CatLogo';
import '../../styles/admin/AdminLogin.css';

// Constantes para el formulario
const INITIAL_CREDENTIALS = {
  usuario: '',
  password: ''
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const { 
    login, 
    isAuthenticated, 
    loading: authLoading, 
    error: authError,
    clearError 
  } = useAdmin();

  // Estado local del formulario
  const [credentials, setCredentials] = useState(INITIAL_CREDENTIALS);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Sincronizar errores del contexto con el estado local
  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  /**
   * Maneja el cambio en los campos del formulario
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Limpiar errores al escribir
    if (formError) {
      setFormError('');
      clearError();
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!credentials.usuario.trim() || !credentials.password.trim()) {
      setFormError('Por favor, complete todos los campos');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');
      clearError();

      const result = await login(credentials.usuario, credentials.password);
      
      if (result.success) {
        // El useEffect se encargará de la redirección
        setCredentials(INITIAL_CREDENTIALS);
      } else {
        setFormError(result.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      setFormError('Error al conectar con el servidor');
      console.error('Error en login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="login-header">
            <CatLogo size={100} className="login-cat-logo" />
            <h1>Computer Chip</h1>
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <CatLogo size={100} className="login-cat-logo" />
          <h1>Computer Chip</h1>
          <p>Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              value={credentials.usuario}
              onChange={handleChange}
              placeholder="Ingrese su usuario o email"
              required
              disabled={isSubmitting}
              className="login-input"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              required
              disabled={isSubmitting}
              className="login-input"
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          {formError && (
            <div className="login-error" role="alert">
              {formError}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;