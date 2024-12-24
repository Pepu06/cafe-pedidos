export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'drinks' | 'brunch';
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'completed';
  timestamp: string;
  total: number;
}