import React from 'react';
import { SubscriptionTipProps } from '@/constants/subscriptionsData';

const SubscriptionTipCard: React.FC<SubscriptionTipProps> = ({
  title,
  content,
  icon
}) => {
  // Function to render the appropriate icon based on the string identifier
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mt-1">
          {renderIcon(icon)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">{title}</h3>
          <p className="text-indigo-800">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTipCard;
