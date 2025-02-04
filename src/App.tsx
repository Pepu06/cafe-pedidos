import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { MenuItem, OrderItem } from './types';
import { MenuPage } from './pages/Menu';
import { KitchenPage } from './pages/Kitchen';
import { AdminPage } from './pages/Admin';
import { UtensilsCrossed } from 'lucide-react';
import { useOrders } from './hooks/useOrders';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { MozoPage } from './pages/Mozo';

function App() {
  const { orders, loading, createOrder, updateOrderStatus, updateTableStatus, fetchMenuItems } = useOrders();
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState(1);
  const [methodPayment, setMethodPayment] = useState('cash');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);  // Estado para los items del menú

  // Cargar los items del menú desde Supabase
  useEffect(() => {
    const fetchData = async () => {
      setMenuItems(await fetchMenuItems());
    };
    fetchData();
  }, []);

  // Categorizar los elementos del menú
  const categorizedMenuItems = {
    breakfast: menuItems.filter((item) => item.category === 'breakfast'),
    brunch: menuItems.filter((item) => item.category === 'brunch'),
    drinks: menuItems.filter((item) => item.category === 'drinks'),
  };

  const handleAddItem = (item: MenuItem) => {
    setCurrentOrder((prev) => {
      const existingItem = prev.find((i) => i.id === Number(item.id));
      if (existingItem) {
        return prev.map((i) =>
          i.id === Number(item.id) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: Number(item.id), quantity: 1, menu_item_id: Number(item.id) }];
    });
  };

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setCurrentOrder((prev) =>
      prev
        .map((item) =>
          item.id === Number(itemId)
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCurrentOrder((prev) => prev.filter((item) => item.id !== Number(itemId)));
  };

  const handlePlaceOrder = async () => {
    if (currentOrder.length === 0) return;

    toast.success('Pedido realizado!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
      transition: Bounce,
    });
    const success = await createOrder(tableNumber, currentOrder, methodPayment);
    if (success) {
      setCurrentOrder([]);
    }
  };

  const TableMenuPage = () => {
    const { tableNumber } = useParams<{ tableNumber: string }>();
    const tableNum = parseInt(tableNumber || '1', 10);
    setTableNumber(tableNum);

    return (
      <MenuPage
        menuItems={categorizedMenuItems}
        currentOrder={currentOrder}
        tableNumber={tableNum}
        onAddItem={handleAddItem}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        onTableChange={setTableNumber}
        onMethodPaymentChange={setMethodPayment}
        getStatusTable={async (tableNumber: number) => {
          const order = orders.find((order) => order.tableNumber === tableNumber && order.status_table === 'during');
          return order ? order.status_table : '';
        }}
      />
    );
  };

  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/mesa/:tableNumber" element={
              <div>
                <header className="bg-white shadow-sm mb-5">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center py-5">
                      <Link to="/" className="flex items-center gap-5">
                        <UtensilsCrossed className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-semibold text-gray-900">
                          Sistema de Pedidos
                        </h1>
                        <UtensilsCrossed className="h-8 w-8 text-blue-600" />
                      </Link>
                    </div>
                  </div>
                </header>
                <TableMenuPage />
              </div>
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
            <Route
              path="/admin"
              element={
                <AdminPage
                  orders={orders}
                  loading={loading}
                  onUpdateStatus={updateOrderStatus}
                />
              }
            />
            <Route
              path="/mozo"
              element={
                <MozoPage
                  orders={orders}
                  loading={loading}
                  onUpdateStatus={updateOrderStatus}
                  onUpdateTableStatus={updateTableStatus}
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
