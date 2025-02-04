import React from 'react';
import { MenuItem, OrderItem } from '../types';
import { MenuSection } from '../components/MenuSection';
import { OrderSummary } from '../components/OrderSummary';
import { useOrders } from '../hooks/useOrders';
import { toast } from 'react-toastify';

interface MenuPageProps {
  menuItems: {
    breakfast: MenuItem[];
    brunch: MenuItem[];
    drinks: MenuItem[];
  };
  currentOrder: OrderItem[];
  tableNumber: number;
  onAddItem: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: () => void;
  onTableChange: (table: number) => void;
  onMethodPaymentChange: (paymentMethod: 'cash' | 'qr' | 'tarjeta') => void;
  getStatusTable: (tableNumber: number) => Promise<string>;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  menuItems,
  currentOrder,
  tableNumber,
  onAddItem,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onMethodPaymentChange,
  getStatusTable,
}) => {
  const { modifyOrder } = useOrders();

  const handleModifyOrder = async (items: OrderItem[]) => {
    const success = await modifyOrder(tableNumber, items);
    if (success) {
      toast.success('Pedido modificado exitosamente!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      // Limpiar el pedido actual después de modificar exitosamente
      currentOrder.forEach(item => {
        if (item.id) {
          onRemoveItem(item.id.toString());
        }
      });
    } else {
      toast.error('Error al modificar el pedido', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <MenuSection
          title="Desayunos"
          items={menuItems.breakfast}
          onAddItem={onAddItem}
        />
        <MenuSection
          title="Brunch"
          items={menuItems.brunch}
          onAddItem={onAddItem}
        />
        <MenuSection
          title="Bebidas"
          items={menuItems.drinks}
          onAddItem={onAddItem}
        />
      </div>
      <div className="lg:sticky lg:top-8">
        <OrderSummary
          items={currentOrder}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onPlaceOrder={onPlaceOrder}
          tableNumber={tableNumber}
          onMethodPaymentChange={onMethodPaymentChange}
          onModifyOrder={handleModifyOrder}
          getStatusTable={getStatusTable}
        />
      </div>
    </div>
  );
};