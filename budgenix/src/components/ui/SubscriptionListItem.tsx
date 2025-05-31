import React from 'react';
import { formatCurrency, formatDate } from '@/constants/subscriptionsData';

// Lokalny interfejs Subscription, który używa string jako typ dla id
interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: string;
  nextPayment: string;
  category: string;
  logo: string;
  color: string;
  active: boolean;
  accountId?: string;
}

interface SubscriptionListItemProps {
  subscription: Subscription;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const SubscriptionListItem: React.FC<SubscriptionListItemProps> = ({
  subscription,
  onToggleStatus,
  onDelete
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full bg-${subscription.color}-100 flex items-center justify-center mr-3`}>
            <span className="text-lg">{subscription.logo}</span>
          </div>
          <div>
            <div className="font-medium text-gray-800">{subscription.name}</div>
            <div className="text-xs text-gray-500">{subscription.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatCurrency(subscription.amount)}
        <div className="text-xs text-gray-400">{subscription.cycle}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(subscription.nextPayment)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscription.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
          {subscription.active ? 'Aktywna' : 'Nieaktywna'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={() => onToggleStatus(subscription.id)} 
          className="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          {subscription.active ? 'Dezaktywuj' : 'Aktywuj'}
        </button>
        <button 
          onClick={() => onDelete(subscription.id)} 
          className="text-red-600 hover:text-red-900"
        >
          Usuń
        </button>
      </td>
    </tr>
  );
};

export default SubscriptionListItem;
