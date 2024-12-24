import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KitchenView } from '../components/KitchenView';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';
import { Order } from '../types';

interface KitchenPageProps {
  orders: Order[];
  loading: boolean;
  onUpdateStatus: (orderId: string, status: 'pending' | 'preparing' | 'completed') => void;
}

export const KitchenPage: React.FC<KitchenPageProps> = ({ orders, loading, onUpdateStatus }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Acceso a Cocina</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">Vista de Cocina</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>
      <KitchenView 
        orders={orders} 
        loading={loading} 
        onUpdateStatus={onUpdateStatus} 
      />
    </div>
  );
};