import React from 'react';

interface FinancialInsight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  icon: string;
  priority?: number;
  category?: string;
}

interface InsightCardProps {
  insight: FinancialInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getBackgroundColor = () => {
    switch (insight.type) {
      case 'positive':
        return 'bg-emerald-50 border-emerald-100';
      case 'negative':
        return 'bg-red-50 border-red-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'neutral':
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  const getTitleColor = () => {
    switch (insight.type) {
      case 'positive':
        return 'text-emerald-800';
      case 'negative':
        return 'text-red-800';
      case 'warning':
        return 'text-amber-800';
      case 'neutral':
      default:
        return 'text-blue-800';
    }
  };

  const getDescriptionColor = () => {
    switch (insight.type) {
      case 'positive':
        return 'text-emerald-700';
      case 'negative':
        return 'text-red-700';
      case 'warning':
        return 'text-amber-700';
      case 'neutral':
      default:
        return 'text-blue-700';
    }
  };

  const getPriorityBadge = () => {
    if (!insight.priority || insight.priority < 4) return null;
    
    return (
      <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
        insight.priority === 5 
          ? 'bg-red-100 text-red-700' 
          : 'bg-orange-100 text-orange-700'
      }`}>
        {insight.priority === 5 ? 'Pilne' : 'Ważne'}
      </span>
    );
  };

  return (
    <div className={`p-4 rounded-lg border ${getBackgroundColor()} transition-all hover:shadow-md`}>
      <div className="flex items-start">
        <div className="text-2xl mr-3 flex-shrink-0">{insight.icon}</div>
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className={`font-semibold ${getTitleColor()}`}>
              {insight.title}
            </h3>
            {getPriorityBadge()}
          </div>
          <p className={`text-sm mt-1.5 leading-relaxed ${getDescriptionColor()}`}>
            {insight.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
