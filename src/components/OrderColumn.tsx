import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Order } from '../types';
import { DraggableOrder } from './DraggableOrder';

interface OrderColumnProps {
  title: string;
  orders: Order[];
  droppableId: string;
  onComplete?: (orderId: string) => void;
}

export const OrderColumn: React.FC<OrderColumnProps> = ({
  title,
  orders,
  droppableId,
  onComplete,
}) => {
  return (
    <div className="flex-1 min-w-[350px] bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-4 min-h-[200px] max-h-[600px] overflow-y-auto ${snapshot.isDraggingOver ? 'bg-blue-50' : ''
              }`}
          >
            {orders.map((order, index) => (
              <DraggableOrder
                key={order.id}
                order={order}
                index={index}
                onComplete={onComplete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};