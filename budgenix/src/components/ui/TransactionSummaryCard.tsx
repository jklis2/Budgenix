import React from 'react';
import { TransactionSummaryCardProps } from '@/constants/transactionsData';

const TransactionSummaryCard: React.FC<TransactionSummaryCardProps> = ({
  title,
  amount,
  icon,
  colorClass,
  bgColorClass
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${colorClass}`}>{amount}</h3>
        </div>
        <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default TransactionSummaryCard;
