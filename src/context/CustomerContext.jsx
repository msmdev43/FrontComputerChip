import { createContext, useContext, useEffect, useState } from 'react';
import { getCustomerSession, customerAuthService } from '../services/customerAuthService';
const CustomerContext = createContext(null);
export function CustomerProvider({ children }) {
  const [session, setSession] = useState(getCustomerSession);
  useEffect(() => {
    const sync = () => setSession(getCustomerSession());
    window.addEventListener('customer-session-change', sync);
    return () => window.removeEventListener('customer-session-change', sync);
  }, []);
  return <CustomerContext.Provider value={{ user: session?.usuario || null,
    isAuthenticated: !!session?.accessToken, loginGoogle: customerAuthService.loginGoogle,
    logout: customerAuthService.logout }}>{children}</CustomerContext.Provider>;
}
export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('useCustomer requiere CustomerProvider');
  return context;
}
