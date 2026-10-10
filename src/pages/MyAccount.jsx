import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { customerAuthService } from '../services/customerAuthService';
import { featureFlags } from '../config/featureFlags';
import '../styles/Account.css';
export default function MyAccount() {
  const { user, isAuthenticated, logout } = useCustomer();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    if (!isAuthenticated) return;
    customerAuthService.getMe().then(data => { if (active) setProfile(data); })
      .catch(() => { if (active) setError('No pudimos cargar tu perfil. Intentá nuevamente.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isAuthenticated, attempt]);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const data = profile || user;
  return <section className="account-page"><h1>Mi cuenta</h1>
    {loading && <p role="status">Cargando tu perfil…</p>}
    {error && <p role="alert">{error} <button onClick={() => { setError(''); setLoading(true); setAttempt(value => value + 1); }}>Reintentar</button></p>}
    <div className="account-card"><h2>{data.nombreCompleto || 'Tu perfil'}</h2>
      <dl>{[['Correo', data.email], ['Teléfono', data.celular], ['Ciudad', data.ciudad], ['Provincia', data.provincia]].map(([label, value]) =>
        <div key={label}><dt>{label}</dt><dd>{value || 'No informado'}</dd></div>)}</dl>
    </div>
    {featureFlags.customerOrders && <Link className="account-button" to="/mis-pedidos">Ver mis pedidos</Link>}
    <button className="account-button" onClick={async () => { try { await logout(); } catch { /* La sesión local ya está cerrada. */ } }}>Cerrar sesión</button>
  </section>;
}
