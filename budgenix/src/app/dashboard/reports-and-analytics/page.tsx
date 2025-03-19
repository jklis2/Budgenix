"use client";
import { useState } from 'react';

export default function ReportsAndAnalytics() {
  // Dummy data for demonstration
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedChart, setSelectedChart] = useState('expenses');
  
  // Monthly expense data
  const monthlyExpenses = [
    { month: 'Styczeń', amount: 4250.75 },
    { month: 'Luty', amount: 3980.20 },
    { month: 'Marzec', amount: 4520.50 },
    { month: 'Kwiecień', amount: 4120.30 },
    { month: 'Maj', amount: 3890.45 },
    { month: 'Czerwiec', amount: 4350.60 },
  ];
  
  // Monthly income data
  const monthlyIncome = [
    { month: 'Styczeń', amount: 6500.00 },
    { month: 'Luty', amount: 6500.00 },
    { month: 'Marzec', amount: 7200.00 },
    { month: 'Kwiecień', amount: 6800.00 },
    { month: 'Maj', amount: 6500.00 },
    { month: 'Czerwiec', amount: 7500.00 },
  ];
  
  // Monthly savings data
  const monthlySavings = monthlyIncome.map((income, index) => ({
    month: income.month,
    amount: income.amount - monthlyExpenses[index].amount
  }));
  
  // Category spending
  const categorySpending = [
    { category: 'Mieszkanie', amount: 1800, percentage: 40, color: 'indigo' },
    { category: 'Żywność', amount: 1200, percentage: 26, color: 'emerald' },
    { category: 'Transport', amount: 600, percentage: 13, color: 'blue' },
    { category: 'Rozrywka', amount: 450, percentage: 10, color: 'purple' },
    { category: 'Subskrypcje', amount: 250, percentage: 6, color: 'amber' },
    { category: 'Inne', amount: 220.50, percentage: 5, color: 'gray' },
  ];
  
  // Budget vs Actual
  const budgetVsActual = [
    { category: 'Mieszkanie', budgeted: 2000, actual: 1800, variance: 200 },
    { category: 'Żywność', budgeted: 1500, actual: 1200, variance: 300 },
    { category: 'Transport', budgeted: 800, actual: 600, variance: 200 },
    { category: 'Rozrywka', budgeted: 400, actual: 450, variance: -50 },
    { category: 'Subskrypcje', budgeted: 200, actual: 250, variance: -50 },
    { category: 'Inne', budgeted: 300, actual: 220.50, variance: 79.50 },
  ];
  
  // Financial insights
  const financialInsights = [
    {
      title: 'Oszczędności rosną',
      description: 'Twoje oszczędności wzrosły o 15% w porównaniu do poprzedniego miesiąca.',
      type: 'positive',
      icon: '📈'
    },
    {
      title: 'Wydatki na rozrywkę przekroczyły budżet',
      description: 'Wydatki na rozrywkę przekroczyły zaplanowany budżet o 50 zł.',
      type: 'negative',
      icon: '⚠️'
    },
    {
      title: 'Optymalizacja subskrypcji',
      description: 'Rozważ przegląd swoich subskrypcji, które stanowią 6% miesięcznych wydatków.',
      type: 'neutral',
      icon: '💡'
    },
    {
      title: 'Cel oszczędnościowy na wakacje',
      description: 'Jesteś na dobrej drodze do osiągnięcia celu oszczędnościowego na wakacje.',
      type: 'positive',
      icon: '🏖️'
    }
  ];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate total expenses
  const totalExpenses = categorySpending.reduce((sum, category) => sum + category.amount, 0);
  
  // Calculate total income
  const totalIncome = monthlyIncome[monthlyIncome.length - 1].amount;
  
  // Calculate total savings
  const totalSavings = totalIncome - totalExpenses;
  
  // Calculate savings rate
  const savingsRate = Math.round((totalSavings / totalIncome) * 100);
  
  // Get chart data based on selection
  const getChartData = () => {
    switch (selectedChart) {
      case 'expenses':
        return monthlyExpenses;
      case 'income':
        return monthlyIncome;
      case 'savings':
        return monthlySavings;
      default:
        return monthlyExpenses;
    }
  };
  
  // Calculate max value for chart
  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map(item => item.amount));
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Raporty i analizy</h1>
          <p className="text-gray-500 mt-1">Monitoruj swoje finanse i analizuj trendy wydatków</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedPeriod('month')}
          >
            Miesięcznie
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === 'quarter' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedPeriod('quarter')}
          >
            Kwartalnie
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === 'year' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedPeriod('year')}
          >
            Rocznie
          </button>
        </div>
      </div>
      
      {/* Financial summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Miesięczne wydatki</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalExpenses)}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Miesięczne przychody</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalIncome)}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Miesięczne oszczędności</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">{formatCurrency(totalSavings)}</h3>
              <p className="text-sm text-gray-500 mt-1">{savingsRate}% przychodu</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Trendy finansowe</h2>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedChart === 'expenses' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedChart('expenses')}
            >
              Wydatki
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedChart === 'income' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedChart('income')}
            >
              Przychody
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedChart === 'savings' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedChart('savings')}
            >
              Oszczędności
            </button>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-64">
          <div className="flex h-full items-end space-x-2">
            {chartData.map((item, index) => {
              const height = (item.amount / maxChartValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-t-lg ${
                      selectedChart === 'expenses' ? 'bg-red-500' : 
                      selectedChart === 'income' ? 'bg-emerald-500' : 
                      'bg-indigo-500'
                    }`} 
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2 w-full text-center truncate">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Wydatki</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Przychody</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Oszczędności</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category spending */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Wydatki według kategorii</h2>
            <select 
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Wszystkie kategorie</option>
              {categorySpending.map((category, index) => (
                <option key={index} value={category.category}>{category.category}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-4">
            {categorySpending
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
              <span className="text-sm font-bold text-gray-800">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
        </div>
        
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
                {budgetVsActual.map((item, index) => (
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
                    {formatCurrency(budgetVsActual.reduce((sum, item) => sum + item.budgeted, 0))}
                  </td>
                  <td className="pt-4 text-sm font-bold text-gray-800 text-right">
                    {formatCurrency(budgetVsActual.reduce((sum, item) => sum + item.actual, 0))}
                  </td>
                  <td className="pt-4 text-sm font-bold text-emerald-600 text-right">
                    {formatCurrency(budgetVsActual.reduce((sum, item) => sum + item.variance, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      {/* Financial insights */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Spostrzeżenia finansowe</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {financialInsights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                insight.type === 'positive' ? 'bg-emerald-50 border-emerald-100' : 
                insight.type === 'negative' ? 'bg-red-50 border-red-100' : 
                'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-3">{insight.icon}</div>
                <div>
                  <h3 className={`font-medium ${
                    insight.type === 'positive' ? 'text-emerald-800' : 
                    insight.type === 'negative' ? 'text-red-800' : 
                    'text-gray-800'
                  }`}>
                    {insight.title}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    insight.type === 'positive' ? 'text-emerald-700' : 
                    insight.type === 'negative' ? 'text-red-700' : 
                    'text-gray-600'
                  }`}>
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Export options */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Eksportuj raport</h2>
        
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>PDF</span>
          </button>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>Excel</span>
          </button>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>CSV</span>
          </button>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Obraz</span>
          </button>
        </div>
      </div>
      
      {/* Financial tips */}
      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Wskazówka finansowa</h3>
            <p className="text-indigo-800">
              Regularne monitorowanie swoich finansów pomaga w podejmowaniu lepszych decyzji finansowych.
              Zaleca się przeglądanie swoich raportów finansowych co najmniej raz w miesiącu, aby śledzić postępy 
              i identyfikować obszary wymagające poprawy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}