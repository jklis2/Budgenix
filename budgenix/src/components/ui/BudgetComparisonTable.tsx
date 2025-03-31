import React from 'react';
import { BudgetComparisonProps, formatCurrency } from '@/constants/reportsData';

const BudgetComparisonTable: React.FC<BudgetComparisonProps> = ({
  budgetItems,
  formattedTotalBudgeted,
  formattedTotalActual,
  formattedTotalVariance
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Budżet vs. Rzeczywiste wydatki</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="pb-3">Kategoria</th>
              <th className="pb-3 text-right">Budżet</th>
              <th className="pb-3 text-right">Wydatki</th>
              <th className="pb-3 text-right">Różnica</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {budgetItems.map((item, index) => (
              <tr key={index}>
                <td className="py-2 text-sm font-medium text-gray-800">{item.category}</td>
                <td className="py-2 text-sm text-gray-600 text-right">{formatCurrency(item.budgeted)}</td>
                <td className="py-2 text-sm text-gray-600 text-right">{formatCurrency(item.actual)}</td>
                <td className={`py-2 text-sm font-medium text-right ${
                  item.variance >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td className="pt-4 text-sm font-bold text-gray-800">Suma</td>
              <td className="pt-4 text-sm font-bold text-gray-800 text-right">
                {formattedTotalBudgeted}
              </td>
              <td className="pt-4 text-sm font-bold text-gray-800 text-right">
                {formattedTotalActual}
              </td>
              <td className="pt-4 text-sm font-bold text-emerald-600 text-right">
                {formattedTotalVariance}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BudgetComparisonTable;
