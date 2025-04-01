import React from 'react';
import { Account, formatCurrency, formatDate } from '@/constants/accountsData';

interface AccountCardProps {
  account: Account;
  onClick: (id: number) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onClick }) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, text: string, border: string }> = {
      'indigo': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
      'emerald': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
      'red': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
      'blue': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
      'amber': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
      'purple': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
    };
    
    return colorMap[color] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
  };
  
  const colorClasses = getColorClasses(account.color);
  
  return (
    <div 
      className={`${colorClasses.bg} rounded-xl shadow-sm p-6 border ${colorClasses.border} cursor-pointer transition-transform hover:scale-[1.02]`}
      onClick={() => onClick(account.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`font-semibold ${colorClasses.text}`}>{account.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{account.type}</p>
        </div>
        {account.isDefault && (
          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
            Domyślne
          </span>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500">Saldo</p>
        <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {formatCurrency(account.balance, account.currency)}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Ostatnia transakcja</p>
        <p className="text-sm text-gray-700">{formatDate(account.lastTransaction)}</p>
      </div>
    </div>
  );
};
