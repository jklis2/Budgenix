import React from 'react';

interface CategoryStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
}

export function CategoryStatCard({
  title,
  value,
  icon,
  bgColor = "bg-white",
  iconBgColor,
  textColor
}: CategoryStatCardProps) {
  return (
    <div className={`${bgColor} rounded-xl shadow-sm p-6 border border-gray-100`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className={`text-2xl font-bold ${textColor} mt-1`}>
            {value}
          </h3>
        </div>
        <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
