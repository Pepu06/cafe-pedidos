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

  async function countOrders() {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact' }); // 'exact' asegura un conteo preciso.
  
      if (error) throw error;
  
      return count || 0; // Devuelve el conteo o 0 si no hay órdenes.
    } catch (error) {
      console.error('Error counting orders:', error);
      return 0; // Retorna 0 en caso de error.
    }
  }

  async function listenToUpdates() {
    const { data: updates, error } = await supabase
      .from('orders')
      .select('updated_at');

    if (error) {
      console.error('Error fetching updates:', error);
      return [];
    }

    return updates.map(update => update.updated_at);
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

  async function createOrder(tableNumber: number, items: OrderItem[], methodPayment: string) {
    try {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            table_number: tableNumber,
            total,
            status: 'pending',
            method: methodPayment,
            status_table: 'during',
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
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }  

  async function updateTableStatus(order_id: string, status: 'finished' | 'during') {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status_table: status })
        .eq('id', order_id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating table status:', error);
      return false;
    }
  }

  async function fetchMenuItems() {
    try {
      const { data: menuItems, error } = await supabase
        .from('menu_items')
        .select('*');

      if (error) throw error;

      return menuItems;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }

  async function agregarTilde(orderId: string) {
    try {
      // Fetch the order items for the given order ID
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;

      // Update each order item to add a green check mark to the name
      const updates = orderItems.map(item => ({
        id: item.id,
        name: `${item.name} ✅`,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
      }));

      console.log('updates', updates);

      const { error: updateError } = await supabase
        .from('order_items')
        .upsert(updates, {
          onConflict: 'id', // Ensure updates instead of inserts
        });

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error adding check mark to order items:', error);
      return false;
    }
  }

  const modifyOrder = async (tableNumber: number, newItems: OrderItem[]) => {
    try {
      setLoading(true);
  
      // Validar que los nuevos items tengan un menu_item_id válido
      const validNewItems = newItems.filter(
        item => item.menu_item_id && item.quantity && item.price
      );
  
      if (validNewItems.length === 0) {
        console.error('No se encontraron nuevos items válidos para agregar.');
        return false;
      }
  
      // Buscar el pedido pendiente para esta mesa
      const { data: existingOrder, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('table_number', tableNumber)
        .eq('status_table', 'during')
        .single();
  
      if (orderError || !existingOrder) {
        console.error('No se encontró un pedido pendiente para esta mesa');
        return false;
      }
  
      const orderId = existingOrder.id;
  
      // Buscar los items existentes en order_items para este pedido
      const { data: existingItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
  
      if (itemsError) throw itemsError;
  
      // Crear un mapa para los items existentes
      const itemsMap = new Map(
        existingItems.map(item => [item.menu_item_id, item])
      );
  
      const updates: { id: number; quantity: number; menu_item_id: number, price: number, name:string  }[] = [];
      const inserts: { order_id: string; menu_item_id: number; quantity: number; price: number; name: string }[] = [];
  
      // Procesar los nuevos items
      validNewItems.forEach(newItem => {
        if (!newItem.menu_item_id) {
          console.error('Skipping item with null menu_item_id:', newItem);
          return; // Skip this item
        }
  
        const existingItem = itemsMap.get(newItem.menu_item_id);
  
        console.log('existingItem', existingItem);
        console.log('newItem', newItem);
          // Si es un nuevo item, agregarlo como nuevo registro
          inserts.push({
            order_id: orderId,
            menu_item_id: newItem.menu_item_id,
            quantity: newItem.quantity,
            price: newItem.price,
            name: newItem.name,
          });
      });
  
      // Realizar las actualizaciones en batch
      if (updates.length > 0) {
        const { error: updateError } = await supabase
          .from('order_items')
          .upsert(updates, {
            onConflict: 'id', // Asegurar que se actualicen en lugar de crear nuevos
          });
        if (updateError) throw updateError;
      }
  
      // Insertar nuevos items en batch
      if (inserts.length > 0) {
        const { error: insertError } = await supabase.from('order_items').insert(inserts);
        if (insertError) {
          console.error('Error al insertar nuevos items:', insertError);
          throw insertError;
        }
      }
  
      // Calcular el nuevo total basado en todos los items actualizados
      const updatedItems = [
        ...existingItems.map(item =>
          updates.find(u => u.id === item.id) ? { ...item, ...updates.find(u => u.id === item.id) } : item
        ),
        ...inserts,
      ];
  
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      // Actualizar el total del pedido en la tabla orders
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({
          total: newTotal,
          updated_at: new Date().toISOString(),
          status: 'pending',
        })
        .eq('id', orderId);
  
      if (updateOrderError) throw updateOrderError;
  
      // Actualizar el estado local
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, total: newTotal }
            : order
        )
      );
  
      return true;
    } catch (error) {
      console.error('Error al modificar el pedido:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  function transformOrders(rawOrders: any[]): Order[] {
    return rawOrders.map((order) => ({
      id: order.id,
      tableNumber: order.table_number,
      status: order.status,
      timestamp: order.created_at,
      total: order.total,
      status_table: order.status_table,
      method: order.method,
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
    updateTableStatus,
    modifyOrder,
    countOrders,
    listenToUpdates,
    agregarTilde,
    fetchMenuItems,
  };
}