"use client";
import { useState } from 'react';
import { AccountSummaryCard } from '@/components/ui/AccountSummaryCard';
import { AccountCard } from '@/components/ui/AccountCard';
import { AccountDetailsModal } from '@/components/ui/AccountDetailsModal';
import { QuickActionCard } from '@/components/ui/QuickActionCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { accountsData, accountSummary, accountActions, formatCurrency } from '@/constants/accountsData';

export default function Accounts() {
  // State
  const [accounts] = useState(accountsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  
  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get selected account
  const selectedAccount = accounts.find(account => account.id === selectedAccountId);
  
  // Handle account selection
  const handleAccountClick = (id: number) => {
    setSelectedAccountId(id);
  };
  
  // Close modal
  const closeModal = () => {
    setSelectedAccountId(null);
  };
  
  // Icons for summary cards
  const balanceIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  const accountsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
  
  const inflowIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
    </svg>
  );
  
  const outflowIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
    </svg>
  );
  
  // Icons for quick action cards
  const getActionIcon = (iconType: string) => {
    const icons: Record<string, React.ReactNode> = {
      'add': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      'transfer': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    };
    
    return icons[iconType] || null;
  };
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Konta</h1>
          <p className="text-gray-500 mt-1">Zarządzaj swoimi kontami i śledź salda</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nowe konto</span>
          </button>
        </div>
      </div>
      
      {/* Accounts overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AccountSummaryCard
          title="Łączne saldo"
          value={formatCurrency(accountSummary.totalBalance)}
          icon={balanceIcon}
          bgColor="bg-white"
          iconBgColor="bg-indigo-100"
          textColor="text-indigo-600"
        />
        
        <AccountSummaryCard
          title="Aktywne konta"
          value={accountSummary.totalAccounts}
          icon={accountsIcon}
          bgColor="bg-white"
          iconBgColor="bg-emerald-100"
          textColor="text-emerald-600"
        />
        
        <AccountSummaryCard
          title="Miesięczne wpływy"
          value={formatCurrency(accountSummary.totalMonthlyInflow)}
          icon={inflowIcon}
          bgColor="bg-white"
          iconBgColor="bg-green-100"
          textColor="text-green-600"
        />
        
        <AccountSummaryCard
          title="Miesięczne wydatki"
          value={formatCurrency(accountSummary.totalMonthlyOutflow)}
          icon={outflowIcon}
          bgColor="bg-white"
          iconBgColor="bg-red-100"
          textColor="text-red-600"
        />
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <SearchBar
              id="search-accounts"
              label="Szukaj kont"
              placeholder="Wyszukaj po nazwie lub typie konta..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </div>
      </div>
      
      {/* Accounts grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Twoje konta</h2>
        
        {filteredAccounts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Brak kont</h3>
            <p className="text-gray-500">Nie znaleziono żadnych kont pasujących do kryteriów wyszukiwania.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map(account => (
              <AccountCard
                key={account.id}
                account={account}
                onClick={handleAccountClick}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Szybkie akcje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accountActions.map(action => (
            <QuickActionCard
              key={action.id}
              title={action.title}
              description={action.description}
              icon={getActionIcon(action.icon)}
              buttonText={action.buttonText}
              gradientFrom={action.gradientFrom}
              gradientTo={action.gradientTo}
              textColor={action.textColor}
            />
          ))}
        </div>
      </div>
      
      {/* Account details modal */}
      {selectedAccountId && (
        <AccountDetailsModal
          account={selectedAccount || null}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
