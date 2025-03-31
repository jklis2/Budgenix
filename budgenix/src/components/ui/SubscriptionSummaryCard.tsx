import React from 'react';
import { SubscriptionSummaryCardProps } from '@/constants/subscriptionsData';

const SubscriptionSummaryCard: React.FC<SubscriptionSummaryCardProps> = ({
  title,
  value,
  icon,
  colorClass,
  bgColorClass
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSummaryCard;
