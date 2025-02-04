import React, { useState } from 'react';
import { useAuthMozo } from '../hooks/useAuthMozo';
import { Order } from '../types';
import { UtensilsCrossed } from 'lucide-react';
import { useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';

interface MozoPageProps {
    orders: Order[];
    loading: boolean;
    onUpdateStatus: (orderId: string, status: 'pending' | 'preparing' | 'completed') => void;
    onUpdateTableStatus: (orderId: string, status: 'finished' | 'during') => void;
}

export const MozoPage: React.FC<MozoPageProps> = ({ orders, loading, onUpdateTableStatus }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isAuthenticated, login } = useAuthMozo();
    const { countOrders, listenToUpdates } = useOrders();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            setError('');
        } else {
            setError('Contraseña incorrecta');
        }
    };


    useEffect(() => {
        let initialCountedOrders = 0;

        const fetchInitialOrders = async () => {
            initialCountedOrders = await countOrders();
        };

        fetchInitialOrders();

        const intervalId = setInterval(async () => {
            const countedOrders = await countOrders();

            if (countedOrders > initialCountedOrders) {
                alert('Nueva orden!');
                window.location.reload();
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        let initialLastUpdate = null;

        const fetchInitialUpdates = async () => {
            const updates = await listenToUpdates(); // Llama a tu función listenToUpdates
            if (updates.length > 0) {
                // Encuentra la última fecha de actualización
                initialLastUpdate = updates.reduce((latest, current) => {
                    return new Date(latest) > new Date(current) ? latest : current;
                });
            }
        };

        fetchInitialUpdates();

        const intervalId = setInterval(async () => {
            const updates = await listenToUpdates(); // Llama a listenToUpdates para obtener las fechas actualizadas
            if (updates.length > 0) {
                // Encuentra la última fecha de actualización
                const latestUpdate = updates.reduce((latest, current) => {
                    return new Date(latest) > new Date(current) ? latest : current;
                });


                // Compara la última actualización con la inicial
                if (latestUpdate && latestUpdate !== initialLastUpdate) {
                    alert('¡Nueva orden actualizada!');
                    window.location.reload();
                }
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Acceso a Mozo</h2>
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

    const duringOrders = orders.filter(order => order.status_table === 'during');

    return (
        <div className="h-screen bg-gray-50">
            <header className="bg-white shadow-sm rounded-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center p-5">
                        <UtensilsCrossed className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-semibold text-gray-900 px-5 py-2">
                            Mozo
                        </h1>
                        <UtensilsCrossed className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
            </header>
            <div className="p-4">
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <div className="space-y-4">
                        {duringOrders.map(order => (
                            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
                                <p className={`justify-center text-white items-center flex font-bold rounded-full m-3 py-2 text-lg ${order.status === 'pending' ? 'bg-red-500' : order.status === 'preparing' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </p>
                                <p className='text-lg'><strong>Método:</strong> {order.method.charAt(0).toUpperCase() + order.method.slice(1)}</p>
                                <p><strong>Items:</strong></p>
                                <ul className="list-disc list-inside">
                                    {order.items.map((item, index) => (
                                        <li key={index}>{item.quantity}x {item.name}</li>
                                    ))}
                                </ul>
                                <p><strong>Mesa:</strong> {order.tableNumber}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Precio:</strong> {order.total}</p>
                                <div className='m-3 flex justify-center items-center'>
                                <button
                                    onClick={() => {
                                        onUpdateTableStatus(order.id, 'finished');
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 500);
                                    }}
                                    className="mt-2 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors"
                                    >
                                    Marcar como terminado
                                </button>
                                    </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};