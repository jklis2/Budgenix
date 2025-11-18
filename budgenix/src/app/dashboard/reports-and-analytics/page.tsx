"use client";
import { useState, useEffect } from 'react';
import ReportSummaryCard from '@/components/ui/ReportSummaryCard';
import FinancialTrendsChart from '@/components/ui/FinancialTrendsChart';
import CategorySpendingCard from '@/components/ui/CategorySpendingCard';
import BudgetComparisonTable from '@/components/ui/BudgetComparisonTable';
import InsightCard from '@/components/ui/InsightCard';
import ExportButton from '@/components/ui/ExportButton';
import { TipCard } from '@/components/ui/TipCard';
import { 
  getReportStats, 
  getPeriodDates, 
  groupByQuarter, 
  groupByYear,
  formatCurrency,
  getPeriodLabel,
  getBudgetComparison,
  generateFinancialInsights,
  PeriodData,
  CategoryStat,
  BudgetComparison,
  FinancialInsight
} from '@/services/reportsService';
import {
  exportToExcel,
  exportToCSV,
  exportToPDF,
  ReportData
} from '@/lib/exportReports';

interface ChartData extends PeriodData {
  month: string;
  amount: number;
}

export default function ReportsAndAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedChart, setSelectedChart] = useState('expenses');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stan dla rzeczywistych danych
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [chartDataExpenses, setChartDataExpenses] = useState<ChartData[]>([]);
  const [chartDataIncome, setChartDataIncome] = useState<ChartData[]>([]);
  const [chartDataSavings, setChartDataSavings] = useState<ChartData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [budgetComparisons, setBudgetComparisons] = useState<BudgetComparison[]>([]);
  const [financialInsights, setFinancialInsights] = useState<FinancialInsight[]>([]);

  // Pobieranie danych z API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const dates = getPeriodDates(selectedPeriod);
        const stats = await getReportStats({
          startDate: dates.startDate,
          endDate: dates.endDate,
          period: 'month' // Zawsze pobieramy dane miesięczne, a później grupujemy
        });

        // Ustawienie sum
        setTotalIncome(stats.totalIncome);
        setTotalExpenses(stats.totalExpense);
        setTotalSavings(stats.totalSavings);
        setSavingsRate(stats.savingsRate);

        // Grupowanie danych w zależności od wybranego okresu
        let processedData: PeriodData[] = stats.timeStats;
        
        if (selectedPeriod === 'quarter') {
          processedData = groupByQuarter(stats.timeStats);
        } else if (selectedPeriod === 'year') {
          processedData = groupByYear(stats.timeStats);
        }

        // Konwersja do formatu wymaganego przez wykresy
        const expensesData = processedData.map(item => ({
          ...item,
          month: item.period,
          amount: item.expense
        }));

        const incomeData = processedData.map(item => ({
          ...item,
          month: item.period,
          amount: item.income
        }));

        const savingsData = processedData.map(item => ({
          ...item,
          month: item.period,
          amount: item.savings
        }));

        setChartDataExpenses(expensesData);
        setChartDataIncome(incomeData);
        setChartDataSavings(savingsData);

        // Ustawienie statystyk kategorii
        if (stats.categoryStats) {
          console.log('Category Stats:', stats.categoryStats);
          setCategoryStats(stats.categoryStats);
        }

        // Pobieranie porównania budżetu
        const budgetData = await getBudgetComparison({
          startDate: dates.startDate,
          endDate: dates.endDate,
          period: selectedPeriod
        });
        console.log('Budget Comparisons:', budgetData);
        setBudgetComparisons(budgetData);

        // Generowanie spostrzeżeń finansowych
        const insights = generateFinancialInsights(stats, budgetData, selectedPeriod);
        console.log('Generated Insights:', insights);
        setFinancialInsights(insights);

      } catch (err) {
        console.error('Błąd pobierania danych:', err);
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania danych');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);
  
  // Get chart data based on selection
  const getChartData = () => {
    switch (selectedChart) {
      case 'expenses':
        return chartDataExpenses;
      case 'income':
        return chartDataIncome;
      case 'savings':
        return chartDataSavings;
      default:
        return chartDataExpenses;
    }
  };
  
  // Calculate max value for chart (use absolute values for negative amounts)
  const chartData = getChartData();
  const maxChartValue = chartData.length > 0 
    ? Math.max(...chartData.map(item => Math.abs(item.amount)), 1) 
    : 1000;
  
  // Pobierz nazwę okresu
  const periodLabel = getPeriodLabel(selectedPeriod);
  
  // Funkcje eksportu
  const handleExport = (type: 'excel' | 'csv' | 'pdf') => {
    const reportData: ReportData = {
      totalIncome,
      totalExpenses,
      totalSavings,
      savingsRate,
      periodLabel,
      timeStats: chartDataExpenses.map(item => ({
        period: item.month,
        income: chartDataIncome.find(i => i.month === item.month)?.amount || 0,
        expense: item.amount,
        savings: chartDataSavings.find(i => i.month === item.month)?.amount || 0
      })),
      categoryStats: categoryStats.map(cat => ({
        name: cat.name,
        amount: cat.amount,
        percentage: cat.percentage
      })),
      budgetComparisons: budgetComparisons.map(b => ({
        category: b.category,
        budgeted: b.budgeted,
        actual: b.actual,
        variance: b.variance
      }))
    };

    switch (type) {
      case 'excel':
        exportToExcel(reportData);
        break;
      case 'csv':
        exportToCSV(reportData);
        break;
      case 'pdf':
        exportToPDF(reportData);
        break;
    }
  };
  
  // Wyświetl komunikat o błędzie jeśli wystąpił
  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Błąd: {error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div id="reports-container" className="space-y-8">
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
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReportSummaryCard
            title={`${periodLabel} wydatki`}
            amount={totalExpenses}
            formattedAmount={formatCurrency(totalExpenses)}
            iconType="expense"
          />
          
          <ReportSummaryCard
            title={`${periodLabel} przychody`}
            amount={totalIncome}
            formattedAmount={formatCurrency(totalIncome)}
            iconType="income"
          />
          
          <ReportSummaryCard
            title={`${periodLabel} oszczędności`}
            amount={totalSavings}
            formattedAmount={formatCurrency(totalSavings)}
            iconType="savings"
            additionalInfo={`${savingsRate}% przychodu`}
          />
        </div>
      )}
      
      {/* Chart section */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      ) : (
        <FinancialTrendsChart
          chartData={chartData}
          maxValue={maxChartValue}
          selectedChart={selectedChart}
          onChartChange={setSelectedChart}
        />
      )}
      
      {/* Category spending */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <CategorySpendingCard
              categories={categoryStats.length > 0 ? categoryStats.map(cat => ({
                category: cat.name,
                amount: cat.amount,
                percentage: cat.percentage,
                color: cat.color || 'indigo'
              })) : []}
              totalExpenses={totalExpenses}
              formattedTotalExpenses={formatCurrency(totalExpenses)}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            <BudgetComparisonTable
              budgetItems={budgetComparisons}
              formattedTotalBudgeted={formatCurrency(budgetComparisons.reduce((sum, item) => sum + item.budgeted, 0))}
              formattedTotalActual={formatCurrency(budgetComparisons.reduce((sum, item) => sum + item.actual, 0))}
              formattedTotalVariance={formatCurrency(budgetComparisons.reduce((sum, item) => sum + item.variance, 0))}
            />
          </>
        )}
      </div>
      
      {/* Financial insights */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Spostrzeżenia finansowe</h2>
            <p className="text-sm text-gray-500 mt-1">
              Inteligentna analiza Twoich finansów
            </p>
          </div>
          {financialInsights.length > 0 && (
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
              {financialInsights.length} {financialInsights.length === 1 ? 'spostrzeżenie' : 'spostrzeżeń'}
            </span>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100 animate-pulse">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : financialInsights.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-gray-500">Brak spostrzeżeń do wyświetlenia</p>
            <p className="text-sm text-gray-400 mt-1">Dodaj więcej transakcji, aby uzyskać analizę finansową</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financialInsights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        )}
      </div>
      
      {/* Export options */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Eksportuj raport</h2>
          <p className="text-sm text-gray-500 mt-1">
            Pobierz swoje dane finansowe w wybranym formacie
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExportButton 
            type="pdf" 
            label="Eksport PDF"
            description="Profesjonalny format dokumentu"
            onClick={() => handleExport('pdf')}
            disabled={isLoading}
          />
          <ExportButton 
            type="excel" 
            label="Eksport Excel"
            description="Edytowalny arkusz kalkulacyjny"
            onClick={() => handleExport('excel')}
            disabled={isLoading}
          />
          <ExportButton 
            type="csv" 
            label="Eksport CSV"
            description="Surowe dane do importu"
            onClick={() => handleExport('csv')}
            disabled={isLoading}
          />
        </div>

        {/* Additional info */}
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-indigo-800">
              <span className="font-medium">Wskazówka:</span> Eksportowane raporty zawierają wszystkie dane z wybranego okresu. 
              Dla najlepszych wyników zalecamy format PDF dla prezentacji i Excel do dalszej analizy.
            </div>
          </div>
        </div>
      </div>
      
      {/* Financial tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TipCard
          title="💡 Wskazówka dnia"
          content="Regularne monitorowanie swoich finansów pomaga w podejmowaniu lepszych decyzji finansowych. Zaleca się przeglądanie swoich raportów finansowych co najmniej raz w miesiącu, aby śledzić postępy i identyfikować obszary wymagające poprawy."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
        />
        
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Poradnik zarządzania budżetem</h3>
              <p className="text-sm text-indigo-100 mb-4">
                Poznaj zasadę 50/30/20: przeznacz 50% przychodu na potrzeby, 30% na przyjemności i 20% na oszczędności. 
                To prosty sposób na zrównoważone finanse.
              </p>
              <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
                Dowiedz się więcej
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}