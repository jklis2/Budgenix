"use client";
import { useState } from 'react';
import { 
  monthlyExpenses,
  monthlyIncome,
  monthlySavings,
  categorySpending,
  budgetVsActual,
  financialInsights,
  formatCurrency,
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateTotalSavings,
  calculateSavingsRate,
  calculateMaxChartValue
} from '@/constants/reportsData';
import ReportSummaryCard from '@/components/ui/ReportSummaryCard';
import FinancialTrendsChart from '@/components/ui/FinancialTrendsChart';
import CategorySpendingCard from '@/components/ui/CategorySpendingCard';
import BudgetComparisonTable from '@/components/ui/BudgetComparisonTable';
import InsightCard from '@/components/ui/InsightCard';
import ExportButton from '@/components/ui/ExportButton';
import { TipCard } from '@/components/ui/TipCard';

export default function ReportsAndAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedChart, setSelectedChart] = useState('expenses');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Calculate financial metrics
  const totalExpenses = calculateTotalExpenses();
  const totalIncome = calculateTotalIncome();
  const totalSavings = calculateTotalSavings();
  const savingsRate = calculateSavingsRate();
  
  // Get chart data based on selection
  const getChartData = () => {
    switch (selectedChart) {
      case 'expenses':
        return monthlyExpenses;
      case 'income':
        return monthlyIncome;
      case 'savings':
        return monthlySavings;
      default:
        return monthlyExpenses;
    }
  };
  
  // Calculate max value for chart
  const chartData = getChartData();
  const maxChartValue = calculateMaxChartValue(chartData);
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Raporty i analizy</h1>
          <p className="text-gray-500 mt-1">Monitoruj swoje finanse i analizuj trendy wydatków</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedPeriod('month')}
          >
            Miesięcznie
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === 'quarter' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedPeriod('quarter')}
          >
            Kwartalnie
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod === 'year' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedPeriod('year')}
          >
            Rocznie
          </button>
        </div>
      </div>
      
      {/* Financial summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportSummaryCard
          title="Miesięczne wydatki"
          amount={totalExpenses}
          formattedAmount={formatCurrency(totalExpenses)}
          iconType="expense"
        />
        
        <ReportSummaryCard
          title="Miesięczne przychody"
          amount={totalIncome}
          formattedAmount={formatCurrency(totalIncome)}
          iconType="income"
        />
        
        <ReportSummaryCard
          title="Miesięczne oszczędności"
          amount={totalSavings}
          formattedAmount={formatCurrency(totalSavings)}
          iconType="savings"
          additionalInfo={`${savingsRate}% przychodu`}
        />
      </div>
      
      {/* Chart section */}
      <FinancialTrendsChart
        chartData={chartData}
        maxValue={maxChartValue}
        selectedChart={selectedChart}
        onChartChange={setSelectedChart}
      />
      
      {/* Category spending */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategorySpendingCard
          categories={categorySpending}
          totalExpenses={totalExpenses}
          formattedTotalExpenses={formatCurrency(totalExpenses)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <BudgetComparisonTable
          budgetItems={budgetVsActual}
          formattedTotalBudgeted={formatCurrency(budgetVsActual.reduce((sum, item) => sum + item.budgeted, 0))}
          formattedTotalActual={formatCurrency(budgetVsActual.reduce((sum, item) => sum + item.actual, 0))}
          formattedTotalVariance={formatCurrency(budgetVsActual.reduce((sum, item) => sum + item.variance, 0))}
        />
      </div>
      
      {/* Financial insights */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Spostrzeżenia finansowe</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {financialInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      </div>
      
      {/* Export options */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Eksportuj raport</h2>
        
        <div className="flex flex-wrap gap-4">
          <ExportButton type="pdf" label="PDF" />
          <ExportButton type="excel" label="Excel" />
          <ExportButton type="csv" label="CSV" />
          <ExportButton type="image" label="Obraz" />
        </div>
      </div>
      
      {/* Financial tips */}
      <TipCard
        title="Wskazówka finansowa"
        content="Regularne monitorowanie swoich finansów pomaga w podejmowaniu lepszych decyzji finansowych. Zaleca się przeglądanie swoich raportów finansowych co najmniej raz w miesiącu, aby śledzić postępy i identyfikować obszary wymagające poprawy."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
}