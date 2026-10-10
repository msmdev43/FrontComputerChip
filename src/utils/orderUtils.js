export const orderCustomer = order => order.usuarioNombre || order.usuario?.nombreCompleto || order.usuario?.nombre || order.cliente || 'Cliente';
export const orderStatus = value => {
  const state = String(value || '').toLowerCase();
  return state ? state[0].toUpperCase() + state.slice(1) : 'Sin estado';
};
