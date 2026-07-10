// C:\xampp\htdocs\FrontComputerChip\src\pages\Register.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoAbierto from '../assets/LogoComputerChip.png';
import logoCerrado from '../assets/LogoComputerChipOjosCerrados.png';
import Footer from '../components/Footer';
import '../styles/Login.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    emailRegistro: '',
    passwordRegistro: '',
    confirmPassword: '',
    pais: 'Argentina',
    provincia: '',
    ciudad: '',
    calle: '',
    numero: '',
    celular: '',
    dni: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
    feedback: ''
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length === 0) {
      return { score: 0, label: '', color: '', feedback: '' };
    }

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Mínimo 8 caracteres');
    }

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Mayúsculas y minúsculas');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Al menos un número');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Carácter especial (!@#$%...)');
    }

    let label = '';
    let color = '';
    let strengthLabel = '';

    if (score === 0) {
      label = 'Muy débil';
      color = '#ef4444';
      strengthLabel = 'muy-debil';
    } else if (score === 1) {
      label = 'Débil';
      color = '#f97316';
      strengthLabel = 'debil';
    } else if (score === 2) {
      label = 'Regular';
      color = '#eab308';
      strengthLabel = 'regular';
    } else if (score === 3) {
      label = 'Fuerte';
      color = '#22c55e';
      strengthLabel = 'fuerte';
    } else if (score >= 4) {
      label = 'Muy fuerte';
      color = '#16a34a';
      strengthLabel = 'muy-fuerte';
    }

    return {
      score,
      label,
      color,
      feedback: feedback.join(' • '),
      strengthLabel
    };
  };

  useEffect(() => {
    if (passwordTouched && formData.passwordRegistro) {
      const strength = checkPasswordStrength(formData.passwordRegistro);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, label: '', color: '', feedback: '' });
    }
  }, [formData.passwordRegistro, passwordTouched]);

  useEffect(() => {
    if (confirmTouched && formData.confirmPassword) {
      const match = formData.passwordRegistro === formData.confirmPassword;
      setPasswordsMatch(match);
    } else {
      setPasswordsMatch(false);
    }
  }, [formData.passwordRegistro, formData.confirmPassword, confirmTouched]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.nombreCompleto || !formData.emailRegistro || !formData.passwordRegistro || !formData.confirmPassword) {
      setError('Completa los campos obligatorios');
      setLoading(false);
      return;
    }

    const strength = checkPasswordStrength(formData.passwordRegistro);
    if (strength.score < 2) {
      setError('La contraseña es demasiado débil. ' + strength.feedback);
      setLoading(false);
      return;
    }

    if (formData.passwordRegistro !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailRegistro)) {
      setError('Ingresa un email válido');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess('¡Registro exitoso!');
      setLoading(false);
      setTimeout(() => navigate('/login'), 1500);
    }, 1000);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      setSuccess('¡Registro con Google exitoso!');
      setLoading(false);
      setTimeout(() => navigate('/'), 1500);
    }, 1500);
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-container register-container">
          <div className="login-card register-card">
            <div className="login-header">
              <h1>ComputerChip</h1>
              <p className="register-subtitle">
                ¿No estás registrado? Por favor, completa tus datos:
              </p>
              <p className="register-hint">
                Recordá que la persona registrada deberá coincidir con los datos del titular del medio de pago elegido.
              </p>
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
              {loading ? 'Cargando...' : 'Registrarse con Google'}
            </button>

            <div className="divider"><span>o</span></div>

            <form onSubmit={handleRegister} className="register-form">
              {/* Fila 1: Email y Nombre */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="emailRegistro"
                    placeholder="E-Mail"
                    value={formData.emailRegistro}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="nombreCompleto"
                    placeholder="Nombre completo"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Fila 2: Contraseña */}
              <div className="form-row password-row">
                <div className="form-group password-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="passwordRegistro"
                    placeholder="Contraseña"
                    value={formData.passwordRegistro}
                    onChange={handleChange}
                    onFocus={() => setPasswordTouched(true)}
                    className={`form-input ${passwordTouched && formData.passwordRegistro ? 'password-input-' + passwordStrength.strengthLabel : ''}`}
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
                
                <div className="form-group password-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setConfirmTouched(true)}
                    className={`form-input ${confirmTouched && formData.confirmPassword ? (passwordsMatch ? 'password-match' : 'password-mismatch') : ''}`}
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
              </div>

              {/* Feedback de contraseñas */}
              {(passwordTouched && formData.passwordRegistro) || (confirmTouched && formData.confirmPassword) ? (
                <div className="password-feedback-row">
                  <div className="password-feedback-item">
                    {passwordTouched && formData.passwordRegistro && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          <div 
                            className={`strength-fill ${passwordStrength.strengthLabel}`}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                        <div className="strength-label" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                          {passwordStrength.feedback && (
                            <span className="strength-feedback"> • {passwordStrength.feedback}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="password-feedback-item">
                    {confirmTouched && formData.confirmPassword && (
                      <div className={`password-match-indicator ${passwordsMatch ? 'match' : 'mismatch'}`}>
                        {passwordsMatch ? '✅ Coinciden' : '❌ No coinciden'}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Fila 3: DNI y Celular */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    value={formData.dni}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="celular"
                    placeholder="Teléfono de contacto"
                    value={formData.celular}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Fila 4: Dirección */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="calle"
                    placeholder="Dirección"
                    value={formData.calle}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="numero"
                    placeholder="Número"
                    value={formData.numero}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Fila 5: Ciudad y Provincia */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="provincia"
                    placeholder="Provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Checkbox ofertas */}
              <div className="form-check">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Quiero recibir ofertas y novedades en mi correo.
                </label>
              </div>

              <button type="submit" className="login-btn register-btn" disabled={loading}>
                {loading ? 'Cargando...' : 'Continuar'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="toggle-link">
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;