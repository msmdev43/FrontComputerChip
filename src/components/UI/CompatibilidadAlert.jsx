import { useEffect, useState } from 'react';
import { atributoService } from '../../services/attributesService';
export default function CompatibilidadAlert({ products = [] }) {
  const ids = [...new Set(products.map(product => product.id))].sort((a, b) => a - b).join(',');
  const [result, setResult] = useState({ key: '', rows: [], error: '' });
  useEffect(() => {
    let active = true;
    if (ids.split(',').filter(Boolean).length < 2) return;
    atributoService.comparar(ids.split(',').map(Number))
      .then(rows => { if (active) setResult({ key: ids, rows, error: '' }); })
      .catch(() => { if (active) setResult({ key: ids, rows: [], error: 'No pudimos comparar los atributos. No se verificó la compatibilidad.' }); });
    return () => { active = false; };
  }, [ids]);
  if (products.length < 2) return <p>Elegí al menos dos componentes para comparar sus atributos.</p>;
  if (result.key !== ids) return <p role="status">Comparando atributos…</p>;
  return <section className="atp-comparison" aria-label="Comparación de atributos">
    <h3>Comparación orientativa</h3>
    <p>La coincidencia de atributos no garantiza que todos los componentes sean compatibles. Revisá las especificaciones antes de comprar.</p>
    {result.error && <p role="alert">{result.error}</p>}
    {!result.error && !result.rows.length && <p>No hay atributos suficientes para comparar esta selección.</p>}
    {result.rows.map(row => <div key={row.atributoId} className="atp-comparison__row">
      <strong>{row.nombre}: {row.sonCompatibles ? 'valores coincidentes' : 'revisar valores o datos faltantes'}</strong>
      <ul>{products.map(product => <li key={product.id}>{product.nombre}: {row.valoresPorProducto?.[product.id] || 'Sin información'}</li>)}</ul>
    </div>)}
  </section>;
}
