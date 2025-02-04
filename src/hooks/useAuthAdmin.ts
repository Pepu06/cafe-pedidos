import { useState } from 'react';

export function useAuthAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });

  const login = (password: string) => {
    if (password === 'admin1234') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}