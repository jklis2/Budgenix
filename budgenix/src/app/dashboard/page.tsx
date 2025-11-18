"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FinancialSummaryCard } from '@/components/ui/FinancialSummaryCard';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { quickActionsData } from '@/constants/dashboardData';
import { getTransactions, getTransactionStats, getAccounts, Transaction, TransactionStats, Account } from '@/lib/services/transactionService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current month dates
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // POPRAWKA: Formatowanie lokalne zamiast UTC
        const formatLocalDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // Fetch data in parallel
        const [transactionsData, statsData, accountsData] = await Promise.all([
          getTransactions({ 
            limit: 5, 
            sortBy: 'date', 
            sortOrder: 'desc' 
          }),
          getTransactionStats({
            dateFrom: formatLocalDate(firstDay),
            dateTo: formatLocalDate(lastDay)
          }),
          getAccounts()
        ]);

        setTransactions(transactionsData.transactions || []);
        setStats(statsData);
        setAccounts(accountsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Nie udało się pobrać danych');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate financial summary data
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyIncome = stats?.totalIncome || 0;
  const monthlyExpense = stats?.totalExpense || 0;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome * 100) : 0;

  const financialSummaryData = [
    {
      id: 1,
      title: 'Saldo konta',
      value: totalBalance,
      iconColor: 'text-emerald-600',
      trendIcon: 'up',
      trendText: 'Suma wszystkich kont',
      trendColor: 'text-emerald-600'
    },
    {
      id: 2,
      title: 'Miesięczny przychód',
      value: monthlyIncome,
      iconColor: 'text-blue-600',
      trendIcon: 'up',
      trendText: stats?.incomeChange ? `${stats.incomeChange > 0 ? '+' : ''}${stats.incomeChange.toFixed(1)}% od ostatniego miesiąca` : 'Bieżący miesiąc',
      trendColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Miesięczne wydatki',
      value: monthlyExpense,
      iconColor: 'text-red-600',
      trendIcon: 'down',
      trendText: stats?.expenseChange ? `${stats.expenseChange > 0 ? '+' : ''}${stats.expenseChange.toFixed(1)}% od ostatniego miesiąca` : 'Bieżący miesiąc',
      trendColor: 'text-red-600'
    },
    {
      id: 4,
      title: 'Wskaźnik oszczędności',
      value: savingsRate,
      isPercentage: true,
      iconColor: 'text-purple-600',
      trendIcon: savingsRate > 20 ? 'up' : 'down',
      trendText: savingsRate > 20 ? 'Dobry poziom oszczędności' : 'Zwiększ oszczędności',
      trendColor: savingsRate > 20 ? 'text-purple-600' : 'text-orange-600'
    }
  ];

  // Prepare chart data with category colors
  // Używamy wartości bezwzględnych i bierzemy tylko kategorie z realnymi wydatkami (> 0)
  const rawTopExpenses = stats?.topExpenseCategories || [];
  const topExpenses = rawTopExpenses
    .map((cat) => ({
      ...cat,
      amount: Math.abs(cat.amount ?? 0),
    }))
    .filter((cat) => cat.amount > 0);

  const totalExpenses = topExpenses.reduce((sum, cat) => sum + cat.amount, 0);
  
  // Distinct colors for each category - GWARANTOWANE różne kolory
  const CHART_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];
  
  const categoryChartData = topExpenses.map((cat) => ({
    name: cat.name,
    value: cat.amount,
    percentage: totalExpenses > 0 ? (cat.amount / totalExpenses * 100) : 0,
  }));

  // Agregowane dane dla wykresu słupkowego - tylko 2 słupki
  const timeChartData = [
    {
      name: 'Przychody',
      Kwota: monthlyIncome
    },
    {
      name: 'Wydatki',
      Kwota: monthlyExpense
    }
  ];

  
  // Brak etykiet procentowych na samym wykresie – czyściej, wartości w tooltipie
  const renderCustomLabel = () => null;

  // Render center content for donut chart
  const renderCenterContent = () => {
    return (
      <g>
        {/* Kwota podniesiona bliżej górnej części środka koła */}
        <text
          x="50%"
          y="43%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: '24px', fontWeight: 'bold', fill: '#1f2937' }}
        >
          {formatCurrency(totalExpenses)}
        </text>
        {/* Podpis tuż pod kwotą */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: '14px', fill: '#6b7280' }}
        >
          Całkowite wydatki
        </text>
      </g>
    );
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Wydatki według kategorii</h3>
            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
              {categoryChartData.length} {categoryChartData.length === 1 ? 'kategoria' : 'kategorii'}
            </div>
          </div>
          <div className="h-80">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={110}
                    innerRadius={65}
                    dataKey="value"
                    paddingAngle={2}
                    isAnimationActive={false}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  {renderCenterContent()}
                  <Tooltip 
                    formatter={(value: number | string) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '10px 14px'
                    }}
                    labelStyle={{ fontWeight: '600', color: '#1f2937' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      fontSize: '13px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500">Brak danych do wyświetlenia</p>
                  <p className="text-gray-400 text-sm mt-1">Dodaj transakcje, aby zobaczyć wykres</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Przychody i wydatki</h3>
            <div className="text-sm text-gray-500">
              Bieżący miesiąc
            </div>
          </div>
          <div className="h-80">
            {monthlyIncome > 0 || monthlyExpense > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={timeChartData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#4b5563', fontSize: 14 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    tick={{ fill: '#4b5563', fontSize: 13 }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number | string) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '10px 14px'
                    }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  />
                  <Bar 
                    dataKey="Kwota" 
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={120}
                    isAnimationActive={false}
                  >
                    {timeChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Przychody' ? '#22c55e' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500">Brak danych do wyświetlenia</p>
                  <p className="text-gray-400 text-sm mt-1">Dodaj transakcje, aby zobaczyć wykres</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Ostatnie transakcje</h3>
          <button 
            onClick={() => router.push('/dashboard/transactions')}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Zobacz wszystkie
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {transactions.length > 0 ? (
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
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-800">{transaction.title}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {transaction.category?.name || 'Brak kategorii'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('pl-PL')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.category?.isIncome ? 'text-emerald-600' : 'text-red-600'}>
                        {transaction.category?.isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Brak transakcji do wyświetlenia</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActionsData.map((action, index) => {
          // Docelowa ścieżka w zależności od akcji
          const getTargetPath = () => {
            switch (action.id) {
              case 1:
                // Dodaj transakcję
                return '/dashboard/transactions';
              case 2:
                // Utwórz budżet
                return '/dashboard/budget';
              case 3:
                // Cel oszczędnościowy
                return '/dashboard/savings-goals';
              default:
                return '/dashboard';
            }
          };

          return (
            <QuickActionCard
              key={action.id}
              title={action.title}
              description={action.description}
              icon={getQuickActionIcon(index)}
              buttonText={action.buttonText}
              gradientFrom={action.gradientFrom}
              gradientTo={action.gradientTo}
              textColor={action.textColor}
              onClick={() => router.push(getTargetPath())}
            />
          );
        })}
      </div>
    </div>
  );
}
