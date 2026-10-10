export const featureFlags = {
  // Activar SOLO después de agregar autorización por propietario en el backend.
  customerOrders: import.meta.env.VITE_CUSTOMER_ORDERS_ENABLED === 'true',
  // Comparación orientativa de atributos; no certifica compatibilidad completa.
  pcBuilder: import.meta.env.VITE_PC_BUILDER_ENABLED === 'true',
};
