import React from 'react';
import { Subscription } from '@/constants/subscriptionsData';
import SubscriptionListItem from './SubscriptionListItem';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  onToggleStatus,
  onDelete
}) => {
  if (subscriptions.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Brak subskrypcji</h3>
        <p className="text-gray-500">Nie znaleziono subskrypcji spełniających kryteria wyszukiwania.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            <th className="px-6 py-3 border-b border-gray-200">Nazwa</th>
            <th className="px-6 py-3 border-b border-gray-200">Koszt</th>
            <th className="px-6 py-3 border-b border-gray-200">Następna płatność</th>
            <th className="px-6 py-3 border-b border-gray-200 text-right">Status</th>
            <th className="px-6 py-3 border-b border-gray-200 text-right">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {subscriptions.map((subscription) => (
            <SubscriptionListItem 
              key={subscription.id}
              subscription={subscription}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable;
