export interface MenuItem {
  foto: string;
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'drinks' | 'brunch';
}

export interface OrderItem {
  menu_item_id: number;
  quantity: number;
  price: number;
  name: string;
  id?: number;
  order_id?: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'completed';
  timestamp: string;
  total: number;
  status_table: 'finished' | 'during';
  method: string;
  updated_at: string;
}