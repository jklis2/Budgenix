import React from 'react';
import { formatCurrency, formatDate } from '@/constants/transactionsData';
import { Transaction } from '@/lib/services/transactionService';

interface TransactionListItemProps {
  transaction: Transaction;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({
  transaction,
  isSelected,
  onSelect
}) => {
  return (
    <tr 
      className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50' : ''}`}
      onClick={() => onSelect(transaction.id)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-800">{transaction.title}</div>
        <div className="text-xs text-gray-500">{transaction.paymentMethod}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {transaction.category?.name ?? 'Brak kategorii'}
        </span>
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
        <button className="text-indigo-600 hover:text-indigo-900 font-medium">
          Szczegóły
        </button>
      </td>
    </tr>
  );
};

export default TransactionListItem;
