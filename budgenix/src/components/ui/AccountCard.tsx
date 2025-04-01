import React from 'react';
import { Account, formatCurrency } from '@/constants/accountsData';
import { FaEdit } from 'react-icons/fa';

interface AccountCardProps {
  account: Account;
  onClick: () => void;
  onEdit?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onClick, onEdit }) => {
  const getColorClasses = (accountType: string) => {
    const colorMap: Record<string, { bg: string, text: string, border: string }> = {
      'Checking': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
      'Savings': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
      'Credit Card': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
      'Cash': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
      'Investment': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
      'Loan': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
      'Other': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' },
    };
    
    return colorMap[accountType] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
  };
  
  const colorClasses = getColorClasses(account.accountType);
  
  const handleEditClick = (e: React.MouseEvent) => {
    if (onEdit) {
      e.stopPropagation();
      onEdit();
    }
  };
  
  return (
    <div 
      className={`${colorClasses.bg} rounded-xl shadow-sm p-6 border ${colorClasses.border} cursor-pointer transition-transform hover:scale-[1.02] relative`}
      onClick={onClick}
    >
      {onEdit && (
        <button 
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          onClick={handleEditClick}
        >
          <FaEdit size={16} />
        </button>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`font-semibold ${colorClasses.text}`}>{account.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{account.accountType}</p>
        </div>
        <div className="flex items-center">
          {account.isDefault && (
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-6">
              Domyślne
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500">Saldo</p>
        <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {formatCurrency(account.balance, account.currency)}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Ostatnia aktualizacja</p>
        <p className="text-sm text-gray-700">{new Date(account.updatedAt).toLocaleDateString('pl-PL')}</p>
      </div>
    </div>
  );
};
