import React from 'react';

interface BudgetCategoryCardProps {
  name: string;
  spent: number;
  allocated: number;
  formatCurrency: (amount: number) => string;
}

// Funkcja zwracająca kolor paska postępu w zależności od procentu wykorzystania
function getProgressBarColor(percentage: number): string {
  if (percentage >= 90) {
    return '#EF4444'; // Czerwony (red-500) dla wysokiego wykorzystania (>=90%)
  } else if (percentage >= 60) {
    return '#F59E0B'; // Żółty (amber-500) dla średniego wykorzystania (60-89%)
  } else {
    return '#10B981'; // Zielony (green-500) dla niskiego wykorzystania (<60%)
  }
}

export function BudgetCategoryCard({
  name,
  spent,
  allocated,
  formatCurrency
}: BudgetCategoryCardProps) {
  // Zawsze używamy wartości bezwględnej spent do obliczeń (bo wydatki mogą być ujemne)
  const absoluteSpent = Math.abs(spent);
  const percentage = allocated > 0 ? Math.round((absoluteSpent / allocated) * 100) : 0;
  const remaining = allocated - absoluteSpent;
  
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: getProgressBarColor(percentage) }}
          ></div>
          <h3 className="font-medium text-gray-800">{name}</h3>
        </div>
        <div className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
          {formatCurrency(absoluteSpent)} / {formatCurrency(allocated)}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getProgressBarColor(percentage) 
          }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs">
          {percentage > 100 ? (
            <span className="text-red-600">Przekroczono o {percentage - 100}%</span>
          ) : percentage >= 90 ? (
            <span className="text-red-600">Wykorzystano {percentage}%</span>
          ) : percentage >= 60 ? (
            <span className="text-amber-600">Wykorzystano {percentage}%</span>
          ) : (
            <span className="text-emerald-600">Wykorzystano {percentage}%</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Pozostało: {formatCurrency(remaining)}
        </div>
      </div>
    </div>
  );
}
