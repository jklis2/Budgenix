import React from 'react';
import { UpcomingPaymentCardProps } from '@/constants/subscriptionsData';

const UpcomingPaymentCard: React.FC<UpcomingPaymentCardProps> = ({
  subscription,
  daysUntil,
  formattedAmount
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className={`w-10 h-10 rounded-full bg-${subscription.color}-100 flex items-center justify-center mr-3`}>
          <span className="text-xl">{subscription.logo}</span>
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{subscription.name}</h3>
          <p className="text-sm text-gray-500">{subscription.category}</p>
          <div className="mt-2 flex items-center">
            <span className={`text-sm font-medium ${daysUntil <= 3 ? 'text-red-600' : daysUntil <= 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {daysUntil === 0 ? 'Dzisiaj' : 
               daysUntil === 1 ? 'Jutro' : 
               `Za ${daysUntil} dni`}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-600">{formattedAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingPaymentCard;
