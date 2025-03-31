import React from 'react';
import { ChartProps } from '@/constants/reportsData';

const FinancialTrendsChart: React.FC<ChartProps> = ({
  chartData,
  maxValue,
  selectedChart,
  onChartChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Trendy finansowe</h2>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              selectedChart === 'expenses' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChartChange('expenses')}
          >
            Wydatki
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              selectedChart === 'income' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChartChange('income')}
          >
            Przychody
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              selectedChart === 'savings' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChartChange('savings')}
          >
            Oszczędności
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <div className="flex h-full items-end space-x-2">
          {chartData.map((item, index) => {
            const height = (item.amount / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t-lg ${
                    selectedChart === 'expenses' ? 'bg-red-500' : 
                    selectedChart === 'income' ? 'bg-emerald-500' : 
                    'bg-indigo-500'
                  }`} 
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2 w-full text-center truncate">
                  {item.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-8">
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
