import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Order } from '../types';
import { OrderColumn } from './OrderColumn';

interface KitchenViewProps {
  orders: Order[];
  loading: boolean;
  onUpdateStatus: (orderId: string, status: 'pending' | 'preparing' | 'completed') => void;
}

export const KitchenView: React.FC<KitchenViewProps> = ({
  orders,
  loading,
  onUpdateStatus,
}) => {
  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const preparingOrders = orders.filter((order) => order.status === 'preparing');

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.droppableId === 'preparing') {
      onUpdateStatus(draggableId, 'preparing');
    } else if (destination.droppableId === 'pending') {
      onUpdateStatus(draggableId, 'pending');
    }

    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const handleComplete = (orderId: string) => {
    onUpdateStatus(orderId, 'completed');
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Cargando pedidos...</p>
      </div>
    );
  }

  if (pendingOrders.length === 0 && preparingOrders.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-600">No hay pedidos pendientes</h2>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-8 p-6 overflow-x-auto">
        <OrderColumn
          title="Pedidos Pendientes"
          orders={pendingOrders}
          droppableId="pending"
        />
        <OrderColumn
          title="En Preparación"
          orders={preparingOrders}
          droppableId="preparing"
          onComplete={handleComplete}
        />
      </div>
    </DragDropContext>
  );
};