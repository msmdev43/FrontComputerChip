// C:\xampp\htdocs\FrontComputerChip\src\pages\Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoAbierto from '../assets/LogoComputerChip.png';
import logoCerrado from '../assets/LogoComputerChipOjosCerrados.png';
import Footer from '../components/Footer';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess('¡Inicio de sesión exitoso!');
      setLoading(false);
      setTimeout(() => navigate('/'), 1500);
    }, 1000);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      setSuccess('¡Inicio con Google exitoso!');
      setLoading(false);
      setTimeout(() => navigate('/'), 1500);
    }, 1500);
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>ComputerChip</h1>
              <p>Iniciar Sesión</p>
            </div>

            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}

            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {loading ? 'Cargando...' : 'Continuar con Google'}
            </button>

            <div className="divider"><span>o</span></div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Ingresar correo..."
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group password-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Ingresar clave..."
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <img 
                    src={showPassword ? logoAbierto : logoCerrado} 
                    alt={showPassword ? 'Ojo abierto' : 'Ojo cerrado'}
                    className="password-toggle-icon"
                  />
                </button>
              </div>

              <div className="login-actions">
                <Link to="#" className="forgot-password">Olvidé mi clave</Link>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Cargando...' : 'LOGIN'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                ¿No estás registrado?{' '}
                <Link to="/registro" className="toggle-link">
                  Registrarme
                </Link>
              </p>
            </div>

            <div className="login-legal">
              <Link to="#">Política de Privacidad</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;