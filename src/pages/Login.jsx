import { useRef, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import GoogleSignIn from '../components/GoogleSignIn';
import logo from '../assets/LogoComputerChip.png';
import '../styles/Login.css';
export default function Login({ register = false }) {
  const { isAuthenticated, loginGoogle } = useCustomer();
  const navigate = useNavigate();
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (isAuthenticated) return <Navigate to="/mi-cuenta" replace />;
  const authenticate = async credential => {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError('');
    try { await loginGoogle(credential); navigate('/mi-cuenta', { replace: true }); }
    catch (err) { setError(err.response?.data?.error || err.response?.data?.Error || err.message || 'No pudimos iniciar tu sesión.'); }
    finally { pending.current = false; setBusy(false); }
  };
  return <div className="login-wrapper"><div className="login-container"><div className="login-card">
    <div className="login-header"><img src={logo} width="96" alt="Computer Chip" />
      <h1>{register ? 'Creá tu cuenta' : 'Bienvenido'}</h1>
      <p>Ingresá con Google para acceder a tu cuenta.</p>
    </div>
    {error && <p className="login-error" role="alert">{error}</p>}
    <GoogleSignIn onCredential={authenticate} busy={busy} />
    {busy && <p role="status">Verificando tu sesión…</p>}
    <p>Si es tu primera visita, crearemos tu cuenta al continuar con Google.</p>
    <Link to="/productos">Seguir explorando productos</Link>
  </div></div></div>;
}
