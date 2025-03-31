import React from 'react';
import { InsightCardProps } from '@/constants/reportsData';

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getBackgroundColor = () => {
    switch (insight.type) {
      case 'positive':
        return 'bg-emerald-50 border-emerald-100';
      case 'negative':
        return 'bg-red-50 border-red-100';
      case 'neutral':
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const getTitleColor = () => {
    switch (insight.type) {
      case 'positive':
        return 'text-emerald-800';
      case 'negative':
        return 'text-red-800';
      case 'neutral':
      default:
        return 'text-gray-800';
    }
  };

  const getDescriptionColor = () => {
    switch (insight.type) {
      case 'positive':
        return 'text-emerald-700';
      case 'negative':
        return 'text-red-700';
      case 'neutral':
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getBackgroundColor()}`}>
      <div className="flex items-start">
        <div className="text-2xl mr-3">{insight.icon}</div>
        <div>
          <h3 className={`font-medium ${getTitleColor()}`}>
            {insight.title}
          </h3>
          <p className={`text-sm mt-1 ${getDescriptionColor()}`}>
            {insight.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
