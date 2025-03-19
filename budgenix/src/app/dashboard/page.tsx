"use client";
import { useState } from 'react';

export default function Dashboard() {
  // Dummy data for demonstration
  const [currentBalance] = useState(12450.75);
  const [monthlyIncome] = useState(8500);
  const [monthlyExpenses] = useState(5200.25);
  const [savingsRate] = useState(38.8);
  
  const recentTransactions = [
    { id: 1, title: 'Zakupy spożywcze', amount: -245.50, date: '2025-03-18', category: 'Żywność' },
    { id: 2, title: 'Wynagrodzenie', amount: 8500, date: '2025-03-15', category: 'Przychód' },
    { id: 3, title: 'Netflix', amount: -49, date: '2025-03-12', category: 'Subskrypcje' },
    { id: 4, title: 'Paliwo', amount: -320, date: '2025-03-10', category: 'Transport' },
    { id: 5, title: 'Restauracja', amount: -180, date: '2025-03-08', category: 'Rozrywka' },
  ];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
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
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Saldo konta</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(currentBalance)}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>+12.5% od ostatniego miesiąca</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Miesięczny przychód</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(monthlyIncome)}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Stabilny przychód</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Miesięczne wydatki</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(monthlyExpenses)}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <span>-5.2% od ostatniego miesiąca</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Wskaźnik oszczędności</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{savingsRate}%</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Dobry poziom oszczędności</span>
            </div>
          </div>
        </div>
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
                <th className="px-4 py-3 border-b border-gray-200 text-right">Kwota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{transaction.title}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('pl-PL')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className={transaction.amount >= 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
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
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Dodaj transakcję</h3>
          </div>
          <p className="text-indigo-200 mb-4">Szybko dodaj nowy przychód lub wydatek do swojego budżetu</p>
          <button className="w-full bg-white text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
            Dodaj teraz
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Utwórz budżet</h3>
          </div>
          <p className="text-emerald-200 mb-4">Zaplanuj swoje wydatki i kontroluj finanse z miesięcznym budżetem</p>
          <button className="w-full bg-white text-emerald-700 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
            Zaplanuj budżet
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Cel oszczędnościowy</h3>
          </div>
          <p className="text-amber-200 mb-4">Ustaw nowy cel oszczędnościowy i śledź swoje postępy</p>
          <button className="w-full bg-white text-amber-700 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors">
            Ustaw cel
          </button>
        </div>
      </div>
    </div>
  );
}
