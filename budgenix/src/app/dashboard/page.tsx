"use client";
import { FinancialSummaryCard } from '@/components/ui/FinancialSummaryCard';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { financialSummaryData, quickActionsData, recentTransactions } from '@/constants/dashboardData';

export default function Dashboard() {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Icons for financial summary cards
  const getFinancialIcon = (color: string) => {
    const icons: Record<string, React.ReactNode> = {
      'text-emerald-600': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'text-blue-600': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'text-red-600': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'text-purple-600': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    };
    
    return icons[color] || null;
  };
  
  // Trend icons for financial summary cards
  const getTrendIcon = (trend: string, color: string) => {
    if (trend === 'up') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
  };
  
  // Icons for quick action cards
  const getQuickActionIcon = (index: number) => {
    const icons = [
      <svg key="add" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>,
      <svg key="budget" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>,
      <svg key="goal" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ];
    
    return icons[index] || icons[0];
  };
  
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Witaj w Budgenix</h1>
          <p className="text-gray-500 mt-1">Zarządzaj swoimi finansami w jednym miejscu</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
      
      {/* Financial summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialSummaryData.map((item) => (
          <FinancialSummaryCard
            key={item.id}
            title={item.title}
            value={item.isPercentage ? `${item.value}%` : formatCurrency(item.value)}
            icon={getFinancialIcon(item.iconColor)}
            trendIcon={getTrendIcon(item.trendIcon, item.trendColor)}
            trendText={item.trendText}
            trendColor={item.trendColor}
          />
        ))}
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Wydatki według kategorii</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-40 h-40 mx-auto bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-medium">
                Wykres kołowy
              </div>
              <p className="text-sm text-gray-500 mt-4">Wizualizacja wydatków według kategorii</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Przychody i wydatki</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-full h-40 mx-auto bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-medium">
                Wykres słupkowy
              </div>
              <p className="text-sm text-gray-500 mt-4">Porównanie przychodów i wydatków w czasie</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Ostatnie transakcje</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            Zobacz wszystkie
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 border-b border-gray-200">Nazwa</th>
                <th className="px-4 py-3 border-b border-gray-200">Kategoria</th>
                <th className="px-4 py-3 border-b border-gray-200">Data</th>
                <th className="px-4 py-3 border-b border-gray-200">Kwota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{transaction.title}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.amount > 0 ? 'text-emerald-600' : 'text-red-600'}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActionsData.map((action, index) => (
          <QuickActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={getQuickActionIcon(index)}
            buttonText={action.buttonText}
            gradientFrom={action.gradientFrom}
            gradientTo={action.gradientTo}
            textColor={action.textColor}
          />
        ))}
      </div>
    </div>
  );
}
