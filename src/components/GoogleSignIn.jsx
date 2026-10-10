import { useEffect, useRef, useState } from 'react';
let libraryPromise;
let initialized = false;
let credentialHandler;
function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!libraryPromise) {
    libraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client?hl=es';
      script.async = true;
      const timer = setTimeout(() => { script.remove(); reject(new Error('Google no respondió. Recargá la página para reintentar.')); }, 15000);
      script.onload = () => { clearTimeout(timer); resolve(); };
      script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('No se pudo conectar con Google.')); };
      document.head.appendChild(script);
    }).catch(error => { libraryPromise = null; throw error; });
  }
  return libraryPromise;
}
export default function GoogleSignIn({ onCredential, busy }) {
  const host = useRef(null);
  const callback = useRef(onCredential);
  const [error, setError] = useState('');
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  useEffect(() => { callback.current = onCredential; }, [onCredential]);
  useEffect(() => {
    if (!clientId) return;
    let active = true;
    const handler = response => { if (active && response.credential) callback.current(response.credential); };
    credentialHandler = handler;
    loadGoogle().then(() => {
      if (!active || !host.current) return;
      if (!initialized) {
        window.google.accounts.id.initialize({ client_id: clientId, callback: response => credentialHandler?.(response), auto_select: false });
        initialized = true;
      }
      window.google.accounts.id.renderButton(host.current, { theme: 'outline', size: 'large', text: 'continue_with', locale: 'es', width: 280 });
    }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; if (credentialHandler === handler) credentialHandler = null; };
  }, [clientId]);
  if (!clientId) return <p role="status">El acceso con Google estará disponible próximamente.</p>;
  return <div className="google-signin-wrap" aria-busy={busy}>
    {error && <p role="alert">{error}</p>}
    <div ref={host} inert={busy} style={{ opacity: busy ? .5 : 1 }} />
  </div>;
}
