import React from 'react';

interface ExportButtonProps {
  type: 'pdf' | 'excel' | 'csv' | 'image';
  label: string;
  description?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  type, 
  label, 
  description,
  disabled = false,
  onClick 
}) => {
  const getConfig = () => {
    switch (type) {
      case 'pdf':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ),
          gradient: 'from-red-500 to-red-600',
          hoverGradient: 'hover:from-red-600 hover:to-red-700',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          description: description || 'Profesjonalny format dokumentu'
        };
      case 'excel':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ),
          gradient: 'from-emerald-500 to-emerald-600',
          hoverGradient: 'hover:from-emerald-600 hover:to-emerald-700',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700',
          description: description || 'Edytowalny arkusz kalkulacyjny'
        };
      case 'csv':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          gradient: 'from-blue-500 to-blue-600',
          hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          description: description || 'Surowe dane do importu'
        };
      case 'image':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          gradient: 'from-purple-500 to-purple-600',
          hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          description: description || 'Zrzut ekranu wykresów'
        };
      default:
        return {
          icon: null,
          gradient: 'from-gray-500 to-gray-600',
          hoverGradient: 'hover:from-gray-600 hover:to-gray-700',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          description: ''
        };
    }
  };

  const config = getConfig();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative overflow-hidden rounded-xl border-2 border-transparent
        transition-all duration-300 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105 cursor-pointer'}
      `}
    >
      {/* Background gradient (visible on hover) */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 
        ${disabled ? '' : 'group-hover:opacity-100'} transition-opacity duration-300
      `}></div>
      
      {/* Content */}
      <div className={`
        relative px-6 py-4 ${config.bgColor} 
        ${disabled ? '' : 'group-hover:bg-transparent'} transition-colors duration-300
      `}>
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={`
            flex-shrink-0 ${config.textColor}
            ${disabled ? '' : 'group-hover:text-white'} transition-colors duration-300
          `}>
            {config.icon}
          </div>
          
          {/* Text */}
          <div className="flex-1 text-left">
            <div className={`
              font-semibold ${config.textColor}
              ${disabled ? '' : 'group-hover:text-white'} transition-colors duration-300
            `}>
              {label}
            </div>
            <div className={`
              text-xs mt-0.5 ${config.textColor} opacity-70
              ${disabled ? '' : 'group-hover:text-white group-hover:opacity-90'} transition-all duration-300
            `}>
              {config.description}
            </div>
          </div>
          
          {/* Arrow icon */}
          <div className={`
            flex-shrink-0 opacity-0 transform translate-x-2
            ${disabled ? '' : 'group-hover:opacity-100 group-hover:translate-x-0'}
            transition-all duration-300 text-white
          `}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ExportButton;
