import React, { useState } from 'react';
import { ChartProps } from '@/constants/reportsData';

// Formatowanie okresu (miesiąc/kwartał/rok)
const formatPeriodLabel = (period: string): string => {
  // Format YYYY-MM (miesiąc)
  if (period.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = period.split('-');
    const monthNames = [
      'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
      'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }
  
  // Format YYYY-QX (kwartał)
  if (period.match(/^\d{4}-Q\d$/)) {
    return period;
  }
  
  // Format YYYY (rok)
  if (period.match(/^\d{4}$/)) {
    return period;
  }
  
  return period;
};

// Formatowanie kwoty
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Skrócone formatowanie kwoty
const formatShortCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M zł`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k zł`;
  }
  return `${amount.toFixed(0)} zł`;
};

const FinancialTrendsChart: React.FC<ChartProps> = ({
  chartData,
  maxValue,
  selectedChart,
  onChartChange
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Obliczanie średniej wartości
  const averageAmount = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.amount, 0) / chartData.length 
    : 0;
  
  // Znajdowanie najwyższej i najniższej wartości
  const maxAmount = chartData.length > 0 ? Math.max(...chartData.map(item => item.amount)) : 0;
  const minAmount = chartData.length > 0 ? Math.min(...chartData.map(item => item.amount)) : 0;
  
  // Kolory w zależności od wybranego wykresu
  const getColor = () => {
    switch (selectedChart) {
      case 'expenses':
        return {
          primary: 'bg-red-500',
          hover: 'bg-red-600',
          light: 'bg-red-100',
          text: 'text-red-600'
        };
      case 'income':
        return {
          primary: 'bg-emerald-500',
          hover: 'bg-emerald-600',
          light: 'bg-emerald-100',
          text: 'text-emerald-600'
        };
      case 'savings':
        return {
          primary: 'bg-indigo-500',
          hover: 'bg-indigo-600',
          light: 'bg-indigo-100',
          text: 'text-indigo-600'
        };
      default:
        return {
          primary: 'bg-gray-500',
          hover: 'bg-gray-600',
          light: 'bg-gray-100',
          text: 'text-gray-600'
        };
    }
  };
  
  const colors = getColor();
  
  // Tytuł w zależności od wybranego wykresu
  const getChartTitle = () => {
    switch (selectedChart) {
      case 'expenses':
        return 'Wydatki';
      case 'income':
        return 'Przychody';
      case 'savings':
        return 'Oszczędności';
      default:
        return 'Wydatki';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Trendy finansowe</h2>
          <p className="text-sm text-gray-500 mt-1">
            {getChartTitle()} w wybranym okresie
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              selectedChart === 'expenses' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChartChange('expenses')}
          >
            Wydatki
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              selectedChart === 'income' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChartChange('income')}
          >
            Przychody
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              selectedChart === 'savings' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChartChange('savings')}
          >
            Oszczędności
          </button>
        </div>
      </div>
      
      {/* Statystyki podsumowania */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">Średnia</p>
            <p className={`text-lg font-semibold ${colors.text}`}>
              {formatShortCurrency(averageAmount)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Maksimum</p>
            <p className={`text-lg font-semibold ${colors.text}`}>
              {formatShortCurrency(maxAmount)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Minimum</p>
            <p className={`text-lg font-semibold ${colors.text}`}>
              {formatShortCurrency(minAmount)}
            </p>
          </div>
        </div>
      )}
      
      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">Brak danych do wyświetlenia</p>
            <p className="text-sm text-gray-400 mt-1">Dodaj transakcje, aby zobaczyć trendy</p>
          </div>
        </div>
      ) : (
        <div className="relative h-80">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <span className="text-xs text-gray-400 mr-2 w-16 text-right">
                  {formatShortCurrency((maxValue / 4) * (4 - i))}
                </span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
            ))}
          </div>
          
          {/* Line Chart with SVG */}
          <div className="absolute inset-0 pl-20 pr-2 pb-8 pt-2">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 1000 300" 
              preserveAspectRatio="none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Gradient for area under line */}
                <linearGradient id={`gradient-${selectedChart}`} x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="0%" 
                    stopColor={
                      selectedChart === 'expenses' ? '#ef4444' : 
                      selectedChart === 'income' ? '#10b981' : 
                      '#6366f1'
                    } 
                    stopOpacity="0.3" 
                  />
                  <stop 
                    offset="100%" 
                    stopColor={
                      selectedChart === 'expenses' ? '#ef4444' : 
                      selectedChart === 'income' ? '#10b981' : 
                      '#6366f1'
                    } 
                    stopOpacity="0.05" 
                  />
                </linearGradient>
              </defs>
              
              {/* Area under the line */}
              <path
                d={(() => {
                  const width = 1000;
                  const height = 300;
                  const step = width / (chartData.length - 1 || 1);
                  
                  let path = chartData.map((item, index) => {
                    const x = index * step;
                    const y = height - (Math.abs(item.amount) / maxValue) * height;
                    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ');
                  
                  // Close the path at the bottom
                  const lastX = (chartData.length - 1) * step;
                  path += ` L ${lastX},${height} L 0,${height} Z`;
                  
                  return path;
                })()}
                fill={`url(#gradient-${selectedChart})`}
              />
              
              {/* Line */}
              <path
                d={chartData.map((item, index) => {
                  const width = 1000;
                  const height = 300;
                  const step = width / (chartData.length - 1 || 1);
                  const x = index * step;
                  const y = height - (Math.abs(item.amount) / maxValue) * height;
                  return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke={
                  selectedChart === 'expenses' ? '#ef4444' : 
                  selectedChart === 'income' ? '#10b981' : 
                  '#6366f1'
                }
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
              
              {/* Points on the line */}
              {chartData.map((item, index) => {
                const width = 1000;
                const height = 300;
                const step = width / (chartData.length - 1 || 1);
                const x = index * step;
                const y = height - (Math.abs(item.amount) / maxValue) * height;
                
                return (
                  <g key={index}>
                    {/* Outer circle for hover effect */}
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="white"
                      stroke={
                        selectedChart === 'expenses' ? '#ef4444' : 
                        selectedChart === 'income' ? '#10b981' : 
                        '#6366f1'
                      }
                      strokeWidth="3"
                      className="transition-all duration-300 cursor-pointer hover:r-10"
                      style={{ 
                        filter: hoveredIndex === index ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                        transform: hoveredIndex === index ? 'scale(1.3)' : 'scale(1)',
                        transformOrigin: `${x}px ${y}px`
                      }}
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Interactive overlay for hover */}
            <div className="absolute inset-0 flex items-stretch">
              {chartData.map((item, index) => {
                const isHovered = hoveredIndex === index;
                
                return (
                  <div 
                    key={index}
                    className="flex-1 relative cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                        <div className="font-semibold">{formatPeriodLabel(item.month)}</div>
                        <div className="mt-1">{formatCurrency(item.amount)}</div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Label */}
                    <div className="absolute -bottom-8 left-0 right-0 text-xs text-gray-600 text-center truncate">
                      {formatPeriodLabel(item.month)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Wydatki</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Przychody</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Oszczędności</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialTrendsChart;
