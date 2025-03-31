"use client";
import { useState } from 'react';
import { transactions, formatCurrency, transactionTips } from '@/constants/transactionsData';
import TransactionSummaryCard from '@/components/ui/TransactionSummaryCard';
import TransactionTable from '@/components/ui/TransactionTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { TipCard } from '@/components/ui/TipCard';

export default function Transactions() {
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Get all unique categories
  const categories = ['all', ...new Set(transactions.map(t => t.category))];
  
  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Calculate totals
  const income = filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenses = filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = income - expenses;
  
  // Transaction summary cards data
  const summaryCards = [
    {
      title: 'Przychody',
      amount: formatCurrency(income),
      colorClass: 'text-emerald-600',
      bgColorClass: 'bg-emerald-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      title: 'Wydatki',
      amount: formatCurrency(expenses),
      colorClass: 'text-red-600',
      bgColorClass: 'bg-red-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      )
    },
    {
      title: 'Bilans',
      amount: formatCurrency(balance),
      colorClass: balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColorClass: 'bg-blue-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    }
  ];
  
  // Function to render the appropriate icon based on the string identifier
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'download':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transakcje</h1>
          <p className="text-gray-500 mt-1">Przeglądaj i zarządzaj swoimi transakcjami</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nowa transakcja</span>
          </button>
        </div>
      </div>
      
      {/* Transaction summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <TransactionSummaryCard
            key={index}
            title={card.title}
            amount={card.amount}
            colorClass={card.colorClass}
            bgColorClass={card.bgColorClass}
            icon={card.icon}
          />
        ))}
      </div>
      
      {/* Filters and search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <SearchBar
              id="transaction-search"
              label="Szukaj transakcji"
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
          
          <div className="md:w-48 flex items-end">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Więcej filtrów</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Transactions list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Historia transakcji</h2>
        </div>
        
        <TransactionTable
          transactions={filteredTransactions}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          totalCount={transactions.length}
        />
      </div>
      
      {/* Export options */}
      {transactionTips.map((tip, index) => (
        <TipCard
          key={index}
          title={tip.title}
          content={tip.description}
          icon={renderIcon(tip.icon)}
          bgColor={tip.bgColorClass}
          borderColor={tip.borderColorClass}
          titleColor={tip.textColorClass}
          contentColor={tip.descriptionColorClass}
        />
      ))}
    </div>
  );
}