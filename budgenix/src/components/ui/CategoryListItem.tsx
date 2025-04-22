import React from 'react';
import { CategoryIcon } from './CategoryIcon';

export interface CategoryListItemProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
  spent?: number;
  percentage?: number;
  transactions?: number;
  isSelected?: boolean;
  isDefault?: boolean;
  isIncome?: boolean;
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function CategoryListItem({
  id,
  name,
  icon,
  color,
  budget = 0,
  spent = 0,
  percentage = 0,
  transactions = 0,
  isSelected = false,
  isDefault = false,
  isIncome = false,
  onClick,
  onDelete,
  onEdit
}: CategoryListItemProps) {
  // Funkcja do formatowania waluty
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Funkcja do określania koloru wskaźnika procentowego
  const getPercentageColor = (percentage: number) => {
    if (percentage > 100) return '#EF4444'; // czerwony
    if (percentage > 80) return '#F59E0B'; // żółty
    return '#10B981'; // zielony
  };

  return (
    <tr 
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-indigo-50' : ''}`}
      onClick={() => onClick && onClick(id)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex justify-center items-center w-8 h-8 rounded-md mr-3" style={{ backgroundColor: `${color}25` }}>
            <CategoryIcon name={icon} color={color} />
          </div>
          <div>
            <div className="font-medium text-gray-800">{name}</div>
            {isDefault && (
              <span className="px-2 py-0.5 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">Domyślna</span>
            )}
            {isIncome && (
              <span className="px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full ml-1">Przychód</span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{formatCurrency(budget)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{formatCurrency(spent)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px] mr-2">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${Math.min(100, percentage)}%`,
                backgroundColor: getPercentageColor(percentage)
              }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{percentage}%</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
        {transactions}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end space-x-1">
          {onEdit && (
            <button 
              className="text-gray-400 hover:text-indigo-600 transition-colors"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEdit(id);
              }}
              title="Edytuj kategorię"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button 
              className="text-gray-400 hover:text-red-600 transition-colors"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDelete(id);
              }}
              disabled={isDefault}
              title={isDefault ? "Nie można usunąć kategorii domyślnej" : "Usuń kategorię"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
