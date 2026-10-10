import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../config/config';

const STORAGE_KEY = 'computerChipCustomerAuth';
let memory;
let generation = 0;
let refreshing = null;
export function getCustomerSession() {
  if (memory !== undefined) return memory;
  try { memory = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { memory = null; }
  return memory;
}
function saveSession(session) {
  memory = session;
  try { session ? sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session)) : sessionStorage.removeItem(STORAGE_KEY); }
  catch { /* La sesión sigue en memoria si el navegador no admite almacenamiento. */ }
  window.dispatchEvent(new Event('customer-session-change'));
}
export function clearCustomerSession() { generation += 1; saveSession(null); }
const publicClient = axios.create({ baseURL: API_BASE_URL, timeout: 30000 });
// Instancia aislada: una sesión de cliente nunca utiliza el JWT del administrador.
export const customerClient = axios.create({ baseURL: API_BASE_URL, timeout: 30000 });
customerClient.interceptors.request.use(config => {
  const session = getCustomerSession();
  config.sessionGeneration = generation;
  if (session?.accessToken) config.headers.Authorization = `Bearer ${session.accessToken}`;
  return config;
});
customerClient.interceptors.response.use(response => response, async error => {
  const config = error.config;
  const session = getCustomerSession();
  if (error.response?.status !== 401 || !config || config._retry || config.sessionGeneration !== generation) throw error;
  if (!session?.refreshToken) { clearCustomerSession(); throw error; }
  config._retry = true;
  const startGeneration = generation;
  if (!refreshing) {
    refreshing = publicClient.post(ENDPOINTS.auth.refresh, { refreshToken: session.refreshToken })
      .then(({ data }) => {
        if (!data.accessToken || generation !== startGeneration) throw new Error('La sesión cambió.');
        saveSession({ ...session, accessToken: data.accessToken });
        return data.accessToken;
      }).finally(() => { refreshing = null; });
  }
  try {
    const accessToken = await refreshing;
    config.headers.Authorization = `Bearer ${accessToken}`;
    return await customerClient(config);
  } catch (refreshError) {
    // Un corte de red no invalida una sesión. Una revocación sí.
    if (generation === startGeneration && [400, 401, 403].includes(refreshError.response?.status)) clearCustomerSession();
    throw refreshError;
  }
});
export const customerAuthService = {
  async loginGoogle(idToken) {
    const start = generation;
    const { data } = await publicClient.post(ENDPOINTS.auth.loginGoogle, { idToken });
    if (!data.accessToken || !data.refreshToken || !data.usuario?.id) throw new Error('El servidor devolvió una sesión incompleta.');
    if (start !== generation) throw new Error('La sesión cambió. Intentá nuevamente.');
    generation += 1;
    saveSession(data);
    return data.usuario;
  },
  async getMe() { return (await customerClient.get(ENDPOINTS.usuarios.me)).data; },
  async logout() {
    const session = getCustomerSession();
    clearCustomerSession();
    window.google?.accounts?.id?.disableAutoSelect();
    if (session?.refreshToken) {
      // No volver a instalar una sesión al cerrar: revocación sin interceptor.
      await publicClient.post(ENDPOINTS.auth.logout, { refreshToken: session.refreshToken }, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
    }
  }
};
