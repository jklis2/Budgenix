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