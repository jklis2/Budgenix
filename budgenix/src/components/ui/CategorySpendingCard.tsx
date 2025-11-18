import React from 'react';
import { CategorySpendingProps, formatCurrency } from '@/constants/reportsData';

const CategorySpendingCard: React.FC<CategorySpendingProps> = ({
  categories,
  formattedTotalExpenses,
  selectedCategory,
  onCategoryChange
}) => {
  // Mapa kolorów dla kategorii
  const colorMap: Record<string, string> = {
    'indigo': '#6366f1',
    'emerald': '#10b981',
    'blue': '#3b82f6',
    'purple': '#a855f7',
    'amber': '#f59e0b',
    'gray': '#6b7280',
    'red': '#ef4444',
    'green': '#22c55e',
    'yellow': '#eab308',
    'pink': '#ec4899',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Wydatki według kategorii</h2>
        <select 
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">Wszystkie kategorie</option>
          {categories.map((category, index) => (
            <option key={index} value={category.category}>{category.category}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Brak danych o wydatkach dla wybranego okresu.</p>
            <p className="text-xs mt-2">Dodaj transakcje aby zobaczyć statystyki.</p>
          </div>
        ) : (
          categories
            .filter(category => selectedCategory === 'all' || category.category === selectedCategory)
            .map((category, index) => {
              // Oblicz rzeczywisty procent wypełnienia paska (max 100%)
              const barWidth = Math.min(Math.abs(category.percentage), 100);
              const bgColor = colorMap[category.color] || colorMap['indigo'];
              
              // Sprawdź czy dane są prawidłowe
              if (category.amount < 0) {
                console.warn(`Nieprawidłowa wartość dla kategorii ${category.category}: ${category.amount}`);
              }
              
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(Math.abs(category.amount))} ({Math.abs(category.percentage)}%)
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${barWidth}%`,
                        backgroundColor: bgColor
                      }}
                    ></div>
                  </div>
                </div>
              );
            })
        )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Suma wydatków</span>
          <span className="text-sm font-bold text-gray-800">{formattedTotalExpenses}</span>
        </div>
      </div>
    </div>
  );
};

export default CategorySpendingCard;
