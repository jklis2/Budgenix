import React from 'react';

interface FinancialSummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trendIcon: React.ReactNode;
  trendText: string;
  trendColor: string;
}

export function FinancialSummaryCard({
  title,
  value,
  icon,
  trendIcon,
  trendText,
  trendColor
}: FinancialSummaryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-full ${trendColor.replace('text-', 'bg-').replace('-600', '-100')} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className={`flex items-center text-xs ${trendColor}`}>
          {trendIcon}
          <span>{trendText}</span>
        </div>
      </div>
    </div>
  );
}
