import React from 'react';
import { Account, formatCurrency, formatDate, recentAccountActivity } from '@/constants/accountsData';

interface AccountDetailsModalProps {
  account: Account | null;
  onClose: () => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ account, onClose }) => {
  if (!account) return null;
  
  // Filter activities for this account
  const accountActivities = recentAccountActivity.filter(activity => activity.accountId === account.id);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Szczegóły konta</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Account details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Nazwa konta</h3>
              <p className="text-lg font-semibold text-gray-800">{account.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Typ konta</h3>
              <p className="text-lg font-semibold text-gray-800">{account.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Saldo</h3>
              <p className={`text-lg font-semibold ${account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(account.balance, account.currency)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Ostatnia transakcja</h3>
              <p className="text-lg font-semibold text-gray-800">{formatDate(account.lastTransaction)}</p>
            </div>
          </div>
          
          {/* Balance chart placeholder */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Historia salda</h3>
            <div className="h-40 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center text-white">
              Wykres salda
            </div>
          </div>
          
          {/* Recent transactions */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Ostatnie transakcje</h3>
            {accountActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Brak ostatnich transakcji</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opis</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Kwota</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accountActivities.map((activity) => (
                      <tr key={activity.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(activity.date)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{activity.description}</td>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right ${activity.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatCurrency(activity.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Zamknij
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Edytuj konto
          </button>
        </div>
      </div>
    </div>
  );
};
