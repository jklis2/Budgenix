"use client";
import { useState } from 'react';
import { 
  subscriptions as initialSubscriptions, 
  formatCurrency, 
  getDaysUntil, 
  subscriptionTips 
} from '@/constants/subscriptionsData';
import SubscriptionSummaryCard from '@/components/ui/SubscriptionSummaryCard';
import UpcomingPaymentCard from '@/components/ui/UpcomingPaymentCard';
import SubscriptionTable from '@/components/ui/SubscriptionTable';
import SubscriptionTipCard from '@/components/ui/SubscriptionTipCard';
import { SearchBar } from '@/components/ui/SearchBar';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
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
  
  // Summary cards data
  const summaryCards = [
    {
      title: 'Miesięczny koszt',
      value: formatCurrency(monthlyTotal),
      colorClass: 'text-indigo-600',
      bgColorClass: 'bg-indigo-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Roczny koszt',
      value: formatCurrency(yearlyTotal),
      colorClass: 'text-red-600',
      bgColorClass: 'bg-red-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Aktywne subskrypcje',
      value: subscriptions.filter(s => s.active).length.toString(),
      colorClass: 'text-emerald-600',
      bgColorClass: 'bg-emerald-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];
  
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
        {summaryCards.map((card, index) => (
          <SubscriptionSummaryCard
            key={index}
            title={card.title}
            value={card.value}
            colorClass={card.colorClass}
            bgColorClass={card.bgColorClass}
            icon={card.icon}
          />
        ))}
      </div>
      
      {/* Upcoming payments */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Nadchodzące płatności</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingPayments.map((subscription) => (
            <UpcomingPaymentCard
              key={subscription.id}
              subscription={subscription}
              daysUntil={getDaysUntil(subscription.nextPayment)}
              formattedAmount={formatCurrency(subscription.amount)}
            />
          ))}
          
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
            <SearchBar
              id="subscription-search"
              label="Szukaj subskrypcji"
              placeholder="Wyszukaj po nazwie..."
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
            />
          </div>
          
          <div className="md:w-64">
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
          
          <div className="md:w-64">
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
        
        <SubscriptionTable
          subscriptions={filteredSubscriptions}
          onToggleStatus={toggleStatus}
          onDelete={deleteSubscription}
        />
      </div>
      
      {/* Subscription tips */}
      {subscriptionTips.map((tip, index) => (
        <SubscriptionTipCard
          key={index}
          title={tip.title}
          content={tip.content}
          icon={tip.icon}
        />
      ))}
    </div>
  );
}