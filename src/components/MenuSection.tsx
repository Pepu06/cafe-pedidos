import React from 'react';
import { MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ title, items, onAddItem }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  ${item.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => onAddItem(item)}
                className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};