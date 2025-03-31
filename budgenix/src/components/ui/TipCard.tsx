import React from 'react';

interface TipCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  titleColor?: string;
  contentColor?: string;
}

export function TipCard({
  title,
  content,
  icon,
  bgColor = "bg-indigo-50",
  borderColor = "border-indigo-100",
  titleColor = "text-indigo-900",
  contentColor = "text-indigo-800"
}: TipCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-6 border ${borderColor}`}>
      <div className="flex items-start">
        {icon && (
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mt-1">
            {icon}
          </div>
        )}
        <div>
          <h3 className={`text-lg font-semibold ${titleColor} mb-2`}>{title}</h3>
          <p className={contentColor}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
