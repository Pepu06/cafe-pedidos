import React from 'react';
import { Order } from '../types';
import { Check } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onComplete?: () => void;
  isDragging?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onComplete, isDragging }) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">Mesa {order.tableNumber}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.timestamp).toLocaleTimeString()}
          </p>
        </div>
        {order.status === 'preparing' && onComplete && (
          <button
            onClick={onComplete}
            className="p-2 text-green-600 hover:text-green-700 transition-colors"
            title="Marcar como completado"
          >
            <Check size={24} />
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.quantity}x {item.name}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total:</span>
          <span className="font-semibold">${order.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};