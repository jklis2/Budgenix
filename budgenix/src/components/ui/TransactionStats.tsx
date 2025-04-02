import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/constants/transactionsData';
import { TransactionStats, TransactionFilters, getTransactionStats } from '@/lib/services/transactionService';

interface TransactionStatsProps {
  filters?: TransactionFilters;
}

const TransactionStatsComponent: React.FC<TransactionStatsProps> = ({ filters = {} }) => {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const statsData = await getTransactionStats(filters);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching transaction stats:', err);
        setError('Nie udało się pobrać statystyk transakcji');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Przychody */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Przychody</p>
            <h3 className="text-2xl font-bold mt-1 text-emerald-600">
              {formatCurrency(stats.totalIncome)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        {stats.incomeChange !== undefined && (
          <div className="mt-2 flex items-center">
            <span className={`text-xs font-medium ${stats.incomeChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.incomeChange >= 0 ? '+' : ''}{stats.incomeChange.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">w porównaniu do poprzedniego okresu</span>
          </div>
        )}
      </div>

      {/* Wydatki */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Wydatki</p>
            <h3 className="text-2xl font-bold mt-1 text-red-600">
              {formatCurrency(stats.totalExpense)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </div>
        </div>
        {stats.expenseChange !== undefined && (
          <div className="mt-2 flex items-center">
            <span className={`text-xs font-medium ${stats.expenseChange <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.expenseChange >= 0 ? '+' : ''}{stats.expenseChange.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">w porównaniu do poprzedniego okresu</span>
          </div>
        )}
      </div>

      {/* Bilans */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Bilans</p>
            <h3 className={`text-2xl font-bold mt-1 ${stats.balance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              {formatCurrency(stats.balance)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        {stats.balanceChange !== undefined && (
          <div className="mt-2 flex items-center">
            <span className={`text-xs font-medium ${stats.balanceChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.balanceChange >= 0 ? '+' : ''}{stats.balanceChange.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">w porównaniu do poprzedniego okresu</span>
          </div>
        )}
      </div>

      {/* Kategorie wydatków */}
      {stats.topExpenseCategories && stats.topExpenseCategories.length > 0 && (
        <div className="col-span-1 md:col-span-3 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Główne kategorie wydatków</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topExpenseCategories.map((category, index) => (
              <div key={index} className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(category.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (category.amount / stats.totalExpense) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((category.amount / stats.totalExpense) * 100).toFixed(1)}% wydatków
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kategorie przychodów */}
      {stats.topIncomeCategories && stats.topIncomeCategories.length > 0 && (
        <div className="col-span-1 md:col-span-3 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Główne źródła przychodów</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topIncomeCategories.map((category, index) => (
              <div key={index} className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(category.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (category.amount / stats.totalIncome) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((category.amount / stats.totalIncome) * 100).toFixed(1)}% przychodów
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionStatsComponent;
