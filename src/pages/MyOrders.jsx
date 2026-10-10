import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { customerClient } from '../services/customerAuthService';
import { ENDPOINTS } from '../config/config';
import { featureFlags } from '../config/featureFlags';
import { formatPrice } from '../config/currency';
import { orderStatus } from '../utils/orderUtils';
import '../styles/Account.css';
export default function MyOrders() {
  const { user, isAuthenticated } = useCustomer();
  const [orders, setOrders] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    if (!isAuthenticated || !featureFlags.customerOrders) return;
    customerClient.get(ENDPOINTS.pedidos.porUsuario(user.id))
      .then(({ data }) => { if (active) setOrders(data); })
      .catch(() => { if (active) setError('No se pudieron cargar tus pedidos.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?.id, isAuthenticated]);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!featureFlags.customerOrders) return <Navigate to="/mi-cuenta" replace />;
  const openOrder = async id => {
    setError(''); setDetail(null); setLoading(true);
    try { setDetail((await customerClient.get(ENDPOINTS.pedidos.porId(id))).data); }
    catch { setError('No se pudo cargar el detalle.'); }
    finally { setLoading(false); }
  };
  return <section className="account-page"><h1>Mis pedidos</h1>
    {loading && <p role="status">Cargando…</p>}{error && <p role="alert">{error}</p>}
    {!loading && !error && !orders.length && <p>Todavía no tenés pedidos.</p>}
    {orders.map(order => <article key={order.id} className="account-card"><h2>Pedido #{order.id}</h2>
      <p>{orderStatus(order.estado)} · {formatPrice(order.total)}</p>
      <button className="account-button" disabled={loading} onClick={() => openOrder(order.id)}>Ver detalle</button></article>)}
    {detail && <article className="account-card"><h2>Detalle #{detail.id}</h2>
      {(detail.items || []).map((item, index) => <p key={`${item.productoId}-${index}`}>{item.productoNombre} × {item.cantidad} — {formatPrice(item.subtotal)}</p>)}
      <p>Pago: {detail.metodoPago}</p><p>Envío: {detail.direccionEnvio || detail.zonaEnvio}</p>
      <strong>Total: {formatPrice(detail.total)}</strong>
      <p><button onClick={() => setDetail(null)}>Cerrar detalle</button></p>
    </article>}
  </section>;
}
