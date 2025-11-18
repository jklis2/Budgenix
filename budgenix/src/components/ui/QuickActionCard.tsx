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
  // Map gradient strings to full Tailwind classes (required for purging)
  const getGradientClass = () => {
    if (gradientFrom === 'indigo-600' && gradientTo === 'indigo-800') {
      return 'bg-gradient-to-br from-indigo-600 to-indigo-800';
    } else if (gradientFrom === 'emerald-600' && gradientTo === 'emerald-800') {
      return 'bg-gradient-to-br from-emerald-600 to-emerald-800';
    } else if (gradientFrom === 'yellow-500' && gradientTo === 'orange-600') {
      return 'bg-gradient-to-br from-yellow-500 to-orange-600';
    }
    return 'bg-gradient-to-br from-gray-600 to-gray-800';
  };

  const getButtonClasses = () => {
    if (gradientFrom.includes('indigo')) {
      return 'text-indigo-600 hover:bg-indigo-50';
    } else if (gradientFrom.includes('emerald')) {
      return 'text-emerald-600 hover:bg-emerald-50';
    } else if (gradientFrom.includes('yellow')) {
      return 'text-yellow-600 hover:bg-yellow-50';
    }
    return 'text-gray-800 hover:bg-gray-50';
  };
  
  return (
    <div className={`${getGradientClass()} rounded-xl shadow-sm p-6 text-white`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className={`${textColor} mb-4`}>{description}</p>
      <button 
        onClick={onClick}
        className={`w-full bg-white ${getButtonClasses()} py-2 rounded-lg font-medium transition-colors`}
      >
        {buttonText}
      </button>
    </div>
  );
}
