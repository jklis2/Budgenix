import React from 'react';

interface BudgetCategoryCardProps {
  name: string;
  spent: number;
  allocated: number;
  color: string;
  formatCurrency: (amount: number) => string;
}

export function BudgetCategoryCard({
  name,
  spent,
  allocated,
  color,
  formatCurrency
}: BudgetCategoryCardProps) {
  // Calculate percentage
  const percentage = Math.round((spent / allocated) * 100);
  
  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full bg-${color}-500 mr-2`}></div>
          <h3 className="font-medium text-gray-800">{name}</h3>
        </div>
        <div className="text-sm text-gray-500">
          {formatCurrency(spent)} / {formatCurrency(allocated)}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-${color}-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-gray-500">
          {percentage > 100 ? (
            <span className="text-red-600">Przekroczono o {percentage - 100}%</span>
          ) : (
            <span>Wykorzystano {percentage}%</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Pozostało: {formatCurrency(allocated - spent)}
        </div>
      </div>
    </div>
  );
}
