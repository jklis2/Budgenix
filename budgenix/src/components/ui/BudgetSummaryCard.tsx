import React from 'react';

interface BudgetSummaryCardProps {
  title: string;
  value: string;
  bgColor: string;
  textColor: string;
}

export function BudgetSummaryCard({
  title,
  value,
  bgColor,
  textColor
}: BudgetSummaryCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-4`}>
      <div className={`text-sm ${textColor} font-medium mb-1`}>{title}</div>
      <div className={`text-2xl font-bold ${textColor.replace('700', '900')}`}>{value}</div>
    </div>
  );
}
