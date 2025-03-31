import React from 'react';

interface CategoryListItemProps {
  id: number;
  name: string;
  icon: string;
  color: string;
  budget: number;
  spent: number;
  transactions: number;
  isSelected: boolean;
  formatCurrency: (amount: number) => string;
  calculatePercentage: (spent: number, budget: number) => number;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export function CategoryListItem({
  id,
  name,
  icon,
  color,
  budget,
  spent,
  transactions,
  isSelected,
  formatCurrency,
  calculatePercentage,
  onSelect,
  onDelete
}: CategoryListItemProps) {
  const percentage = calculatePercentage(spent, budget);
  
  return (
    <tr 
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-indigo-50' : ''}`}
      onClick={() => onSelect(id)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full bg-${color}-100 flex items-center justify-center mr-3`}>
            <span className="text-lg">{icon}</span>
          </div>
          <div className="font-medium text-gray-800">{name}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
        {formatCurrency(budget)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
        {formatCurrency(spent)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
            <div 
              className={`h-2 rounded-full ${percentage > 100 ? 'bg-red-500' : `bg-${color}-500`}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <span className={`text-sm ${percentage > 100 ? 'text-red-600' : 'text-gray-600'}`}>
            {percentage}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
        {transactions}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button 
          className="text-gray-400 hover:text-red-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
