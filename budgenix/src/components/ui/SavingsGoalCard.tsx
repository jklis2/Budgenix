import React from 'react';
import { SavingsGoalCardProps } from '@/constants/savingsGoalsData';

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  goal,
  progress,
  daysUntil,
  formattedCurrentAmount,
  formattedTargetAmount,
  formattedDeadline,
  formattedMonthlyContribution,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full bg-${goal.color}-100 flex items-center justify-center mr-4`}>
              <span className="text-2xl">{goal.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
              <p className="text-sm text-gray-500">{goal.description}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="text-indigo-600 hover:text-indigo-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              className="text-red-600 hover:text-red-900"
              onClick={() => onDelete(goal.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Postęp</span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                progress < 30 ? 'bg-red-500' : 
                progress < 70 ? 'bg-amber-500' : 
                'bg-emerald-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Zaoszczędzono</p>
            <p className="text-lg font-semibold text-gray-800">{formattedCurrentAmount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Cel</p>
            <p className="text-lg font-semibold text-gray-800">{formattedTargetAmount}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Termin</p>
            <p className="text-sm font-medium text-gray-800">{formattedDeadline}</p>
            <p className={`text-xs ${
              daysUntil < 30 ? 'text-red-600' : 
              daysUntil < 90 ? 'text-amber-600' : 
              'text-emerald-600'
            }`}>
              {daysUntil > 0 ? `Pozostało ${daysUntil} dni` : 'Termin minął'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Miesięczna wpłata</p>
            <p className="text-sm font-medium text-gray-800">{formattedMonthlyContribution}</p>
            <p className="text-xs text-gray-500">aby osiągnąć cel na czas</p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          goal.priority === 'high' ? 'bg-red-100 text-red-800' : 
          goal.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
          'bg-emerald-100 text-emerald-800'
        }`}>
          {goal.priority === 'high' ? 'Wysoki priorytet' : 
           goal.priority === 'medium' ? 'Średni priorytet' : 
           'Niski priorytet'}
        </span>
        
        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Dodaj wpłatę</span>
        </button>
      </div>
    </div>
  );
};

export default SavingsGoalCard;
