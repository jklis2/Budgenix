// Reports and analytics data for the reports-and-analytics page
// This simulates data that would come from a database

export interface FinancialData {
  month: string;
  amount: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface BudgetVsActual {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
}

export interface FinancialInsight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface FinancialSummaryProps {
  title: string;
  amount: number;
  formattedAmount: string;
  iconType: 'expense' | 'income' | 'savings';
  additionalInfo?: string;
}

export interface ChartProps {
  chartData: FinancialData[];
  maxValue: number;
  selectedChart: string;
  onChartChange: (chart: string) => void;
}

export interface CategorySpendingProps {
  categories: CategorySpending[];
  totalExpenses: number;
  formattedTotalExpenses: string;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export interface BudgetComparisonProps {
  budgetItems: BudgetVsActual[];
  formattedTotalBudgeted: string;
  formattedTotalActual: string;
  formattedTotalVariance: string;
}

export interface InsightCardProps {
  insight: FinancialInsight;
}

export interface ExportButtonProps {
  type: 'pdf' | 'excel' | 'csv' | 'image';
  label: string;
}

// Monthly expense data
export const monthlyExpenses: FinancialData[] = [
  { month: 'Styczeń', amount: 4250.75 },
  { month: 'Luty', amount: 3980.20 },
  { month: 'Marzec', amount: 4520.50 },
  { month: 'Kwiecień', amount: 4120.30 },
  { month: 'Maj', amount: 3890.45 },
  { month: 'Czerwiec', amount: 4350.60 },
];

// Monthly income data
export const monthlyIncome: FinancialData[] = [
  { month: 'Styczeń', amount: 6500.00 },
  { month: 'Luty', amount: 6500.00 },
  { month: 'Marzec', amount: 7200.00 },
  { month: 'Kwiecień', amount: 6800.00 },
  { month: 'Maj', amount: 6500.00 },
  { month: 'Czerwiec', amount: 7500.00 },
];

// Monthly savings data
export const monthlySavings: FinancialData[] = monthlyIncome.map((income, index) => ({
  month: income.month,
  amount: income.amount - monthlyExpenses[index].amount
}));

// Category spending
export const categorySpending: CategorySpending[] = [
  { category: 'Mieszkanie', amount: 1800, percentage: 40, color: 'indigo' },
  { category: 'Żywność', amount: 1200, percentage: 26, color: 'emerald' },
  { category: 'Transport', amount: 600, percentage: 13, color: 'blue' },
  { category: 'Rozrywka', amount: 450, percentage: 10, color: 'purple' },
  { category: 'Subskrypcje', amount: 250, percentage: 6, color: 'amber' },
  { category: 'Inne', amount: 220.50, percentage: 5, color: 'gray' },
];

// Budget vs Actual
export const budgetVsActual: BudgetVsActual[] = [
  { category: 'Mieszkanie', budgeted: 2000, actual: 1800, variance: 200 },
  { category: 'Żywność', budgeted: 1500, actual: 1200, variance: 300 },
  { category: 'Transport', budgeted: 800, actual: 600, variance: 200 },
  { category: 'Rozrywka', budgeted: 400, actual: 450, variance: -50 },
  { category: 'Subskrypcje', budgeted: 200, actual: 250, variance: -50 },
  { category: 'Inne', budgeted: 300, actual: 220.50, variance: 79.50 },
];

// Financial insights
export const financialInsights: FinancialInsight[] = [
  {
    title: 'Oszczędności rosną',
    description: 'Twoje oszczędności wzrosły o 15% w porównaniu do poprzedniego miesiąca.',
    type: 'positive',
    icon: '📈'
  },
  {
    title: 'Wydatki na rozrywkę przekroczyły budżet',
    description: 'Wydatki na rozrywkę przekroczyły zaplanowany budżet o 50 zł.',
    type: 'negative',
    icon: '⚠️'
  },
  {
    title: 'Optymalizacja subskrypcji',
    description: 'Rozważ przegląd swoich subskrypcji, które stanowią 6% miesięcznych wydatków.',
    type: 'neutral',
    icon: '💡'
  },
  {
    title: 'Cel oszczędnościowy na wakacje',
    description: 'Jesteś na dobrej drodze do osiągnięcia celu oszczędnościowego na wakacje.',
    type: 'positive',
    icon: '🏖️'
  }
];

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2
  }).format(amount);
};

// Calculate total expenses
export const calculateTotalExpenses = () => {
  return categorySpending.reduce((sum, category) => sum + category.amount, 0);
};

// Calculate total income
export const calculateTotalIncome = () => {
  return monthlyIncome[monthlyIncome.length - 1].amount;
};

// Calculate total savings
export const calculateTotalSavings = () => {
  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  return totalIncome - totalExpenses;
};

// Calculate savings rate
export const calculateSavingsRate = () => {
  const totalIncome = calculateTotalIncome();
  const totalSavings = calculateTotalSavings();
  return Math.round((totalSavings / totalIncome) * 100);
};

// Calculate max value for chart
export const calculateMaxChartValue = (data: FinancialData[]) => {
  return Math.max(...data.map(item => item.amount));
};
