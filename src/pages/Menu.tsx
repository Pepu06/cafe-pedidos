import React from 'react';
import { MenuItem, OrderItem } from '../types';
import { MenuSection } from '../components/MenuSection';
import { OrderSummary } from '../components/OrderSummary';
import { TableSelector } from '../components/TableSelector';

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
}

export const MenuPage: React.FC<MenuPageProps> = ({
  menuItems,
  currentOrder,
  tableNumber,
  onAddItem,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onTableChange,
}) => {
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
        <TableSelector value={tableNumber} onChange={onTableChange} />
        <OrderSummary
          items={currentOrder}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onPlaceOrder={onPlaceOrder}
          tableNumber={tableNumber}
        />
      </div>
    </div>
  );
};