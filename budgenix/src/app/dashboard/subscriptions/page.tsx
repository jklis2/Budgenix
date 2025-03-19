"use client";
import { useState } from 'react';

export default function Subscriptions() {
  // Dummy data for demonstration
  const [subscriptions, setSubscriptions] = useState([
    { 
      id: 1, 
      name: 'Netflix', 
      amount: 49, 
      cycle: 'monthly', 
      nextPayment: '2025-04-05', 
      category: 'Rozrywka',
      logo: '🎬',
      color: 'red',
      active: true
    },
    { 
      id: 2, 
      name: 'Spotify Premium', 
      amount: 19.99, 
      cycle: 'monthly', 
      nextPayment: '2025-03-22', 
      category: 'Rozrywka',
      logo: '🎵',
      color: 'green',
      active: true
    },
    { 
      id: 3, 
      name: 'Microsoft 365', 
      amount: 29.99, 
      cycle: 'monthly', 
      nextPayment: '2025-04-10', 
      category: 'Praca',
      logo: '💼',
      color: 'blue',
      active: true
    },
    { 
      id: 4, 
      name: 'YouTube Premium', 
      amount: 25.99, 
      cycle: 'monthly', 
      nextPayment: '2025-03-28', 
      category: 'Rozrywka',
      logo: '📺',
      color: 'red',
      active: true
    },
    { 
      id: 5, 
      name: 'iCloud Storage', 
      amount: 14.99, 
      cycle: 'monthly', 
      nextPayment: '2025-04-02', 
      category: 'Technologia',
      logo: '☁️',
      color: 'blue',
      active: true
    },
    { 
      id: 6, 
      name: 'Siłownia', 
      amount: 99, 
      cycle: 'monthly', 
      nextPayment: '2025-04-01', 
      category: 'Zdrowie',
      logo: '💪',
      color: 'purple',
      active: true
    },
    { 
      id: 7, 
      name: 'Ubezpieczenie', 
      amount: 120, 
      cycle: 'monthly', 
      nextPayment: '2025-04-15', 
      category: 'Finanse',
      logo: '🛡️',
      color: 'indigo',
      active: true
    },
    { 
      id: 8, 
      name: 'HBO Max', 
      amount: 29.99, 
      cycle: 'monthly', 
      nextPayment: '2025-03-25', 
      category: 'Rozrywka',
      logo: '🎭',
      color: 'purple',
      active: false
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate days until next payment
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const nextPayment = new Date(dateString);
    const diffTime = nextPayment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get all unique categories
  const categories = ['all', ...new Set(subscriptions.map(s => s.category))];
  
  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || subscription.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && subscription.active) || 
      (filterStatus === 'inactive' && !subscription.active);
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Calculate totals
  const monthlyTotal = subscriptions
    .filter(s => s.active && s.cycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);
  
  const yearlyTotal = monthlyTotal * 12;
  
  // Toggle subscription status
  const toggleStatus = (id: number) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? {...sub, active: !sub.active} : sub
    ));
  };
  
  // Delete subscription
  const deleteSubscription = (id: number) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };
  
  // Sort by upcoming payments
  const upcomingPayments = [...subscriptions]
    .filter(s => s.active)
    .sort((a, b) => new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subskrypcje</h1>
          <p className="text-gray-500 mt-1">Zarządzaj swoimi cyklicznymi płatnościami</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nowa subskrypcja</span>
          </button>
        </div>
      </div>
      
      {/* Subscription summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Miesięczny koszt</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">{formatCurrency(monthlyTotal)}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Roczny koszt</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(yearlyTotal)}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Aktywne subskrypcje</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                {subscriptions.filter(s => s.active).length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming payments */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Nadchodzące płatności</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingPayments.map((subscription) => {
            const daysUntil = getDaysUntil(subscription.nextPayment);
            
            return (
              <div key={subscription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full bg-${subscription.color}-100 flex items-center justify-center mr-3`}>
                    <span className="text-xl">{subscription.logo}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{subscription.name}</h3>
                    <p className="text-sm text-gray-500">{subscription.category}</p>
                    <div className="mt-2 flex items-center">
                      <span className={`text-sm font-medium ${daysUntil <= 3 ? 'text-red-600' : daysUntil <= 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {daysUntil === 0 ? 'Dzisiaj' : 
                         daysUntil === 1 ? 'Jutro' : 
                         `Za ${daysUntil} dni`}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{formatCurrency(subscription.amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {upcomingPayments.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Brak nadchodzących płatności</h3>
              <p className="text-gray-500">Nie masz żadnych aktywnych subskrypcji z nadchodzącymi płatnościami.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Szukaj subskrypcji</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Wyszukaj subskrypcję..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-48">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
            <select
              id="category"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Wszystkie kategorie' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:w-48">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Wszystkie statusy</option>
              <option value="active">Aktywne</option>
              <option value="inactive">Nieaktywne</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Subscriptions list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Lista subskrypcji</h2>
        </div>
        
        {filteredSubscriptions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Brak subskrypcji</h3>
            <p className="text-gray-500">Nie znaleziono subskrypcji spełniających kryteria wyszukiwania.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-6 py-3 border-b border-gray-200">Nazwa</th>
                  <th className="px-6 py-3 border-b border-gray-200">Kategoria</th>
                  <th className="px-6 py-3 border-b border-gray-200">Następna płatność</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-right">Kwota</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-center">Status</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredSubscriptions.map((subscription) => {
                  const daysUntil = getDaysUntil(subscription.nextPayment);
                  
                  return (
                    <tr key={subscription.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full bg-${subscription.color}-100 flex items-center justify-center mr-3`}>
                            <span className="text-lg">{subscription.logo}</span>
                          </div>
                          <div className="font-medium text-gray-800">{subscription.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {subscription.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscription.active ? (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600">{formatDate(subscription.nextPayment)}</span>
                            <span className={`text-xs ${daysUntil <= 3 ? 'text-red-600' : daysUntil <= 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {daysUntil === 0 ? 'Dzisiaj' : 
                               daysUntil === 1 ? 'Jutro' : 
                               `Za ${daysUntil} dni`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-gray-700 font-medium">{formatCurrency(subscription.amount)}</span>
                        <span className="text-xs text-gray-500 block">miesięcznie</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => toggleStatus(subscription.id)}
                          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${subscription.active ? 'bg-emerald-500' : 'bg-gray-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${subscription.active ? 'translate-x-5' : 'translate-x-0'}`}></span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteSubscription(subscription.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Subscription tips */}
      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Wskazówka oszczędnościowa</h3>
            <p className="text-indigo-800">
              Regularnie przeglądaj swoje subskrypcje i zastanów się, czy wszystkie są Ci potrzebne. 
              Rezygnacja z jednej niepotrzebnej subskrypcji o wartości 30 zł miesięcznie pozwoli Ci zaoszczędzić 360 zł rocznie!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}