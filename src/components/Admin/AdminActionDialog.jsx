import { useEffect, useRef } from 'react';
export default function AdminActionDialog({ title, description, label, busy, error, danger = false, onCancel, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); if (opener?.isConnected) opener.focus(); };
  }, []);
  return <dialog ref={ref} className="cc-confirm" aria-labelledby="cc-action-title"
    onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}>
    <div className="cc-confirm-icon" aria-hidden="true">{danger ? '−' : '↻'}</div>
    <h2 id="cc-action-title">{title}</h2><p>{description}</p>
    {error && <p className="cc-feedback cc-feedback--error" role="alert">{error}</p>}
    <div className="cc-confirm-actions">
      <button type="button" autoFocus disabled={busy} onClick={onCancel}>Volver</button>
      <button type="button" disabled={busy} className={danger ? 'cc-confirm-danger' : 'cc-confirm-primary'} onClick={onConfirm}>{busy ? 'Procesando…' : label}</button>
    </div>
  </dialog>;
}
