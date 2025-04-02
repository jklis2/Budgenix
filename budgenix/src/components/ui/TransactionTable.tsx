import React from 'react';
import { formatCurrency, formatDate, getCategoryColor } from '@/constants/transactionsData';
import { Transaction } from '@/lib/services/transactionService';

interface TransactionTableProps {
  transactions: Transaction[];
  selectedTransaction: string | null;
  setSelectedTransaction: (id: string) => void;
  totalCount: number;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  selectedTransaction,
  setSelectedTransaction,
  totalCount,
  onEdit,
  onDelete,
  isLoading = false,
  onPageChange,
  currentPage = 1,
  totalPages = 1
}) => {
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Ładowanie transakcji</h3>
        <p className="text-gray-500">Proszę czekać, trwa pobieranie danych...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Brak transakcji</h3>
        <p className="text-gray-500">Nie znaleziono transakcji spełniających kryteria wyszukiwania.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="px-6 py-3 border-b border-gray-200">Nazwa</th>
              <th className="px-6 py-3 border-b border-gray-200">Kategoria</th>
              <th className="px-6 py-3 border-b border-gray-200">Konto</th>
              <th className="px-6 py-3 border-b border-gray-200">Data</th>
              <th className="px-6 py-3 border-b border-gray-200 text-right">Kwota</th>
              <th className="px-6 py-3 border-b border-gray-200 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactions.map((transaction) => (
              <tr 
                key={transaction.id}
                className={`hover:bg-gray-50 transition-colors ${selectedTransaction === transaction.id ? 'bg-indigo-50' : ''}`}
                onClick={() => setSelectedTransaction(transaction.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-800">{transaction.title}</div>
                  <div className="text-xs text-gray-500">{transaction.paymentMethod}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.category && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category.name, transaction.category.isIncome)}`}>
                      {transaction.category.name}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.account?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={transaction.amount >= 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end space-x-2">
                    {onEdit && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(transaction);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(transaction);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Pokazano <span className="font-medium">{transactions.length}</span> z <span className="font-medium">{totalCount}</span> transakcji
        </div>
        {totalPages > 1 && (
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              onClick={() => onPageChange && currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Poprzednia
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Pokazujemy maksymalnie 5 stron, z aktualną stroną pośrodku, jeśli to możliwe
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
                    onClick={() => onPageChange && onPageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button 
              className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              onClick={() => onPageChange && currentPage < totalPages && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Następna
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionTable;
