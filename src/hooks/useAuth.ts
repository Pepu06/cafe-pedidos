import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('kitchen_auth') === 'true';
  });

  const login = (password: string) => {
    if (password === 'cocina1234') {
      sessionStorage.setItem('kitchen_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('kitchen_auth');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}