import { useState } from 'react';

export function useAuthMozo() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('mozo_auth') === 'true';
  });

  const login = (password: string) => {
    if (password === 'mozo1234') {
      sessionStorage.setItem('mozo_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('mozo_auth');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}