import React, { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { OrderItem } from '../types';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: (paymentMethod: 'cash' | 'mercadopago') => void;
  tableNumber: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  tableNumber,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mercadopago'>('cash');
  const [showWallet, setShowWallet] = useState(false); // Controla cuándo mostrar la Wallet
  const [preferenceId, setPreferenceId] = useState<string | null>(null); // Guarda el ID de preferencia

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Inicializar Mercado Pago SDK
  useEffect(() => {
    initMercadoPago('APP_USR-6c0546fc-95a1-46d9-9403-b110ce65de09', { locale: 'es-AR' }); // Reemplaza con tu clave pública
  }, []);

  // Crear la preferencia de MercadoPago
  const createPreference = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      setPreferenceId(data.preferenceId);
      setShowWallet(true);
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
    }
  };

  // Actualiza el estado de la orden y realiza el pedido
  const handlePlaceOrder = async () => {
    if (paymentMethod === 'cash') {
      onPlaceOrder(paymentMethod); // Si es efectivo, pasa el método de pago
    } else {
      await createPreference(); // Si es MercadoPago, crea la preferencia
    }
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
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
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
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Método de Pago</h3>
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'cash' | 'mercadopago')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Efectivo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mercadopago" id="mercadopago" />
              <Label htmlFor="mercadopago">Mercado Pago</Label>
            </div>
          </RadioGroup>
        </div>
        {showWallet && preferenceId && (
          <div className="mt-5">
            <Wallet initialization={{ preferenceId }} />
          </div>
        )}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Realizar Pedido
        </button>
      </div>
    </div>
  );
};
