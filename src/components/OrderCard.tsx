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
      className={`flex flex-col bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${isDragging ? 'shadow-lg' : ''
        }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Mesa {order.tableNumber}</h3>
        <p className="text-sm text-gray-500">
          {new Date(order.timestamp).toLocaleTimeString()}
        </p>
      </div>
      <ul className="space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-center">
            <span className='text-lg'>
              {item.quantity}x {item.name}
            </span>
          </li>
        ))}
      </ul>
      {order.status === 'preparing' && onComplete && (
        <div className='flex justify-center items-center'>
          <button
            onClick={onComplete}
            className="w-3/4 mt-5 rounded-md p-2 bg-green-500 text-white hover:bg-green-900 transition-colors hover:cursor-pointer"
            title="Marcar como completado"
          >
            <div className='flex flex-row justify-center items-center'>
              <Check size={24} />
              <span className='p-2 text-lg'>Listo</span>
            </div>
          </button>
        </div>
      )}
      {/* <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total:</span>
          <span className="font-semibold">${order.total.toLocaleString()}</span>
        </div>
      </div> */}
    </div>
  );
};