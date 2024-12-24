import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderItem } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    subscribeToOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(transformOrders(orders));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToOrders() {
    const subscription = supabase
      .channel('orders_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  async function createOrder(tableNumber: number, items: OrderItem[]) {
    try {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            table_number: tableNumber,
            total,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      return false;
    }
  }

  async function updateOrderStatus(orderId: string, status: 'pending' | 'preparing' | 'completed') {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  function transformOrders(rawOrders: any[]): Order[] {
    return rawOrders.map((order) => ({
      id: order.id,
      tableNumber: order.table_number,
      status: order.status,
      timestamp: order.created_at,
      total: order.total,
      items: order.order_items.map((item: any) => ({
        id: item.menu_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }));
  }

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
  };
}