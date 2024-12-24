import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { MenuItem, OrderItem } from './types';
import { menuItems } from './data/menuItems';
import { MenuPage } from './pages/Menu';
import { KitchenPage } from './pages/Kitchen';
import { UtensilsCrossed } from 'lucide-react';
import { useOrders } from './hooks/useOrders';

function App() {
  const { orders, loading, createOrder, updateOrderStatus } = useOrders();
  const [currentOrder, setCurrentOrder] = React.useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = React.useState(1);

  const categorizedMenuItems = {
    breakfast: menuItems.filter((item) => item.category === 'breakfast'),
    brunch: menuItems.filter((item) => item.category === 'brunch'),
    drinks: menuItems.filter((item) => item.category === 'drinks'),
  };

  const handleAddItem = (item: MenuItem) => {
    setCurrentOrder((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setCurrentOrder((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCurrentOrder((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handlePlaceOrder = async () => {
    if (currentOrder.length === 0) return;

    const success = await createOrder(tableNumber, currentOrder);
    if (success) {
      setCurrentOrder([]);
      setTableNumber((prev) => (prev % 20) + 1);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link to="/" className="flex items-center gap-2">
                <UtensilsCrossed className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Sistema de Pedidos
                </h1>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <MenuPage
                  menuItems={categorizedMenuItems}
                  currentOrder={currentOrder}
                  tableNumber={tableNumber}
                  onAddItem={handleAddItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onPlaceOrder={handlePlaceOrder}
                  onTableChange={setTableNumber}
                />
              }
            />
            <Route
              path="/cocina"
              element={
                <KitchenPage
                  orders={orders}
                  loading={loading}
                  onUpdateStatus={updateOrderStatus}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;