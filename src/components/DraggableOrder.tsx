import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Order } from '../types';
import { OrderCard } from './OrderCard';

interface DraggableOrderProps {
  order: Order;
  index: number;
  onComplete?: (orderId: string) => void;
}

export const DraggableOrder: React.FC<DraggableOrderProps> = ({
  order,
  index,
  onComplete,
}) => {
  return (
    <Draggable draggableId={order.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <OrderCard
            order={order}
            isDragging={snapshot.isDragging}
            onComplete={onComplete ? () => onComplete(order.id) : undefined}
          />
        </div>
      )}
    </Draggable>
  );
};