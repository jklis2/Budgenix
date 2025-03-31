import React from 'react';
import { CategorySpendingProps, formatCurrency } from '@/constants/reportsData';

const CategorySpendingCard: React.FC<CategorySpendingProps> = ({
  categories,
  formattedTotalExpenses,
  selectedCategory,
  onCategoryChange
}) => {
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
        {categories
          .filter(category => selectedCategory === 'all' || category.category === selectedCategory)
          .map((category, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{category.category}</span>
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(category.amount)} ({category.percentage}%)
                </span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${category.color}-500 rounded-full`} 
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
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
