import { useEffect, useRef } from 'react';

export default function AdminConfirmDialog({ action, busy, error, onCancel, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); if (opener?.isConnected) opener.focus(); };
  }, []);
  const restoring = action.type === 'restore';
  return <dialog ref={ref} className="cc-confirm" aria-labelledby="cc-confirm-title" onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}>
    <div className="cc-confirm-icon" aria-hidden="true">{restoring ? '↻' : '−'}</div>
    <h2 id="cc-confirm-title">{restoring ? 'Restaurar producto' : 'Desactivar producto'}</h2>
    <p><strong>{action.product.nombre}</strong></p>
    <p>{restoring ? 'El producto volverá a estar activo en el catálogo.' : 'Se quitará del catálogo activo. Podés restaurarlo más adelante.'}</p>
    {error && <p className="cc-feedback cc-feedback--error" role="alert">{error}</p>}
    <div className="cc-confirm-actions">
      <button autoFocus type="button" onClick={onCancel} disabled={busy}>Cancelar</button>
      <button type="button" className={restoring ? 'cc-confirm-primary' : 'cc-confirm-danger'} onClick={onConfirm} disabled={busy}>
        {busy ? 'Procesando…' : restoring ? 'Restaurar' : 'Desactivar'}
      </button>
    </div>
  </dialog>;
}
