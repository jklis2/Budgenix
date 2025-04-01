import React from 'react';

interface AccountSummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconBgColor,
  textColor
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-sm p-6 border border-gray-100`}>
      <div className="flex items-center">
        <div className={`${iconBgColor} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-semibold ${textColor} mt-1`}>{value}</p>
        </div>
      </div>
    </div>
  );
};
