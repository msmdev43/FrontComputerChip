import { useRef, useState } from 'react';
import { zonaEnvioService } from '../services/zonaEnvioService';
import { formatPrice } from '../config/currency';

export default function ShippingQuote({ onQuote }) {
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Ingresá tu código postal para consultar el envío.');
  const request = useRef(0);
  const calculate = async event => {
    event.preventDefault();
    const code = postalCode.trim();
    if (!code) return;
    const current = ++request.current;
    setLoading(true); onQuote(null); setMessage('Consultando envío…');
    try {
      // La consulta de zona distingue una tarifa gratuita de una zona inexistente.
      // /costo marca disponible=false para tarifas cero en el backend actual.
      const zone = await zonaEnvioService.getByCodigoPostal(encodeURIComponent(code));
      const cost = typeof zone.costo === 'number' ? zone.costo : Number(String(zone.costo).trim().replace(',', '.'));
      if (zone.costo == null || String(zone.costo).trim() === '' || !Number.isFinite(cost) || cost < 0) throw new Error('Tarifa no válida');
      if (current !== request.current) return;
      onQuote(cost);
      setMessage(`${zone.ciudad || code}: ${cost === 0 ? 'envío gratis' : formatPrice(cost)}. Cotización estimada.`);
    } catch (error) {
      if (current !== request.current) return;
      setMessage(error.response?.status === 404 ? 'No encontramos una zona para ese código postal.' : 'No pudimos consultar el envío. Intentá nuevamente.');
    } finally { if (current === request.current) setLoading(false); }
  };
  return <form className="shipping-quote" onSubmit={calculate}>
    <label htmlFor="shipping-postal-code">Código postal</label>
    <div><input id="shipping-postal-code" value={postalCode} maxLength={12} autoComplete="postal-code" required
      onChange={event => { ++request.current; setPostalCode(event.target.value); onQuote(null); setLoading(false); setMessage('Consultá el envío para este código postal.'); }} />
      <button type="submit" disabled={loading || !postalCode.trim()}>{loading ? 'Consultando…' : 'Calcular'}</button></div>
    <p role="status">{message}</p>
  </form>;
}
