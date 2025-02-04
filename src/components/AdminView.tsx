import React, { useState } from 'react';
import { Order } from '../types';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';

interface AdminViewProps {
    orders: Order[];
    loading: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({ orders, loading }) => {
    const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today');

    const filterOrders = (orders: Order[]) => {
        switch (filter) {
            case 'today':
                return orders.filter((order) => isToday(new Date(order.timestamp)));
            case 'week':
                return orders.filter((order) => isThisWeek(new Date(order.timestamp)));
            case 'month':
                return orders.filter((order) => isThisMonth(new Date(order.timestamp)));
            default:
                return orders;
        }
    };

    const filteredOrders = filterOrders(orders);
    const completedOrders = filteredOrders.filter((order) => order.status === 'completed');

    if (loading) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-600">Cargando pedidos...</p>
            </div>
        );
    }

    if (completedOrders.length === 0) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-600">No hay pedidos completados</h2>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between py-5">
                <h2 className="text-2xl font-semibold text-gray-700">Pedidos Completados</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'today' | 'week' | 'month')}
                    className="border border-gray-300 rounded p-2"
                >
                    <option value="today">Hoy</option>
                    <option value="week">Esta semana</option>
                    <option value="month">Este mes</option>
                </select>
            </div>
            <ul className="space-y-4 overflow-auto max-h-[600px]">
                {completedOrders.map((order) => (
                    <li
                        key={order.id}
                        className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold">{`Mesa ${order.tableNumber}`}</h3>
                                <p className="text-gray-600 text-inherit underline">
                                    {`${order.total} $`}
                                </p>
                            </div>
                            <p className="text-green-600 font-semibold text-xl">{`Completado`}</p>
                        </div>
                        <ul className="mt-2 space-y-1">
                            {order.items.map((item) => (
                                <li key={item.id} className="text-gray-700">{`${item.name} x${item.quantity}`}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};
