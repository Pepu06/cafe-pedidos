import React, { useState, useEffect } from 'react';
import { OrderItem } from '../types';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: (paymentMethod: 'cash' | 'qr' | 'tarjeta') => void;
  onMethodPaymentChange: (paymentMethod: 'cash' | 'qr' | 'tarjeta') => void;
  onModifyOrder?: (items: OrderItem[]) => void; // New prop for handling order modifications
  tableNumber: number;
  getStatusTable: (tableNumber: number) => Promise<string>;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onMethodPaymentChange,
  onModifyOrder,
  tableNumber,
  getStatusTable,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr' | 'tarjeta'>('cash');
  const [isDuring, setIsDuring] = useState(true);

  useEffect(() => {
    const checkTableStatus = async () => {
      const status = await getStatusTable(tableNumber);
      if (status === 'during') {
        setIsDuring(true);
      } else {
        setIsDuring(false);
      }
    };

    checkTableStatus();
  }, [tableNumber, getStatusTable]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    onPlaceOrder(paymentMethod);
    setTimeout(() => {
      window.location.reload();
    }
      , 3000);
  };

  const handlePaymentMethodChange = (value: 'cash' | 'qr' | 'tarjeta') => {
    setPaymentMethod(value);
    onMethodPaymentChange(value);
  };

  const handleModifyOrder = () => {
    if (onModifyOrder && items.length > 0) {
      onModifyOrder(items);
    }
    setTimeout(() => {
      window.location.reload();
    }
      , 3000);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Tu Pedido - Mesa {tableNumber}</h2>
        <p className="text-gray-500">No hay items en tu pedido</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Tu Pedido - Mesa {tableNumber}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">${item.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => item.id && onUpdateQuantity(item.id.toString(), -1)}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => item.id && onUpdateQuantity(item.id.toString(), 1)}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => item.id && onRemoveItem(item.id.toString())}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="text-xl font-bold">${total.toLocaleString()}</span>
        </div>
        {isDuring ? (
          <button
            onClick={handleModifyOrder}
            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
          >
            Agregar al Pedido
          </button>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Método de Pago</h3>
              <RadioGroup value={paymentMethod} onValueChange={(value) => handlePaymentMethodChange(value as 'cash' | 'qr' | 'tarjeta')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Efectivo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="qr" id="qr" />
                  <Label htmlFor="qr">QR</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tarjeta" id="tarjeta" />
                  <Label htmlFor="tarjeta">Tarjeta</Label>
                </div>
              </RadioGroup>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Realizar Pedido
            </button>
          </>
        )}
      </div>
    </div>
  );
};