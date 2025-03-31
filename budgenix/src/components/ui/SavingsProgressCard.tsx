import React from 'react';
import { SavingsProgressCardProps, formatCurrency } from '@/constants/savingsGoalsData';

const SavingsProgressCard: React.FC<SavingsProgressCardProps> = ({
  totalSaved,
  totalTarget,
  progress,
  remainingAmount
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ogólny postęp oszczędzania</h2>
          <div className="flex items-center mb-2">
            <div className="flex-grow">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <span className="ml-4 text-lg font-semibold text-indigo-600">{progress}%</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Zaoszczędzono: {formatCurrency(totalSaved)}</span>
            <span>Cel: {formatCurrency(totalTarget)}</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <div className="text-4xl mb-2">💰</div>
          <p className="text-center text-indigo-800 font-medium">
            Pozostało do zaoszczędzenia:
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {formatCurrency(remainingAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavingsProgressCard;
