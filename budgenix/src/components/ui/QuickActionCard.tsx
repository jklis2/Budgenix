import React from 'react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick?: () => void;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
}

export function QuickActionCard({
  title,
  description,
  icon,
  buttonText,
  onClick,
  gradientFrom,
  gradientTo,
  textColor
}: QuickActionCardProps) {
  return (
    <div className={`bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-xl shadow-sm p-6 text-white`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className={`${textColor} mb-4`}>{description}</p>
      <button 
        onClick={onClick}
        className={`w-full bg-white text-${gradientFrom.replace('from-', '')} py-2 rounded-lg font-medium hover:bg-${gradientFrom.replace('from-', '')}-50 transition-colors`}
      >
        {buttonText}
      </button>
    </div>
  );
}
