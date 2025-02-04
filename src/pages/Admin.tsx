import React, { useState } from 'react';
import { useAuthAdmin } from '../hooks/useAuthAdmin';
import { Order } from '../types';
import { AdminView } from '../components/AdminView';
import { UtensilsCrossed } from 'lucide-react';

interface AdminPageProps {
    orders: Order[];
    loading: boolean;
    onUpdateStatus: (orderId: string, status: 'pending' | 'preparing' | 'completed') => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ orders, loading }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isAuthenticated, login } = useAuthAdmin();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            setError('');
        } else {
            setError('Contraseña incorrecta');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Acceso a Administracion</h2>
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

    const completedOrders = orders.filter(order => order.status === 'completed');
    console.log(completedOrders);

    return (
        <div className="h-screen bg-gray-50">
            <header className="bg-white shadow-sm rounded-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center p-5">
                        <UtensilsCrossed className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-semibold text-gray-900 px-5 py-2">
                            Administracion
                        </h1>
                        <UtensilsCrossed className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
            </header>
            <AdminView
                orders={completedOrders}
                loading={loading}
            />
        </div>
    );
};