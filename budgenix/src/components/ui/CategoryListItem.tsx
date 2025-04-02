import React from 'react';
import { CategoryIcon } from './CategoryIcon';

interface CategoryListItemProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
  spent?: number;
  transactions?: number;
  isSelected: boolean;
  isDefault?: boolean;
  isIncome?: boolean;
  formatCurrency?: (amount: number) => string;
  calculatePercentage?: (spent: number, budget: number) => number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function CategoryListItem({
  id,
  name,
  icon,
  color,
  budget = 0,
  spent = 0,
  transactions = 0,
  isSelected,
  isDefault = false,
  isIncome = false,
  formatCurrency = (amount) => `${amount} PLN`,
  calculatePercentage = (spent, budget) => Math.round((spent / budget) * 100),
  onSelect,
  onDelete,
  onEdit
}: CategoryListItemProps) {
  const percentage = budget > 0 ? calculatePercentage(spent, budget) : 0;
  
  return (
    <tr 
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-indigo-50' : ''}`}
      onClick={() => onSelect(id)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${color}20` }}>
            <CategoryIcon name={icon} color={color} size="small" />
          </div>
          <div className="font-medium text-gray-800 flex items-center">
            {name}
            {isIncome && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Przychód
              </span>
            )}
            {isDefault && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                Domyślna
              </span>
            )}
          </div>
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
              className="h-2 rounded-full"
              style={{ 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: percentage > 100 ? '#EF4444' : color
              }}
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
        <div className="flex justify-end space-x-2">
          {onEdit && (
            <button 
              className="text-gray-400 hover:text-indigo-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              disabled={isDefault}
              title={isDefault ? "Nie można edytować kategorii domyślnej" : "Edytuj kategorię"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <button 
            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDefault) onDelete(id);
            }}
            disabled={isDefault}
            title={isDefault ? "Nie można usunąć kategorii domyślnej" : "Usuń kategorię"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
