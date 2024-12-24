import React from 'react';

interface TableSelectorProps {
  value: number;
  onChange: (table: number) => void;
}

export const TableSelector: React.FC<TableSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="table" className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar Mesa
      </label>
      <select
        id="table"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            Mesa {num}
          </option>
        ))}
      </select>
    </div>
  );
};