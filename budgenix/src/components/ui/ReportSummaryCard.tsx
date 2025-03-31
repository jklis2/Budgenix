import React from 'react';
import { FinancialSummaryProps } from '@/constants/reportsData';

const ReportSummaryCard: React.FC<FinancialSummaryProps> = ({
  title,
  formattedAmount,
  iconType,
  additionalInfo
}) => {
  const getIconColor = () => {
    switch (iconType) {
      case 'expense':
        return 'text-red-600';
      case 'income':
        return 'text-emerald-600';
      case 'savings':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBackgroundColor = () => {
    switch (iconType) {
      case 'expense':
        return 'bg-red-100';
      case 'income':
        return 'bg-emerald-100';
      case 'savings':
        return 'bg-indigo-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getIcon = () => {
    switch (iconType) {
      case 'expense':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      case 'income':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case 'savings':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className={`text-2xl font-bold ${getIconColor()} mt-1`}>{formattedAmount}</h3>
          {additionalInfo && <p className="text-sm text-gray-500 mt-1">{additionalInfo}</p>}
        </div>
        <div className={`w-10 h-10 rounded-full ${getBackgroundColor()} flex items-center justify-center`}>
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryCard;
