import { getToken, getUserId } from '@/lib/services/authService';

const API_URL = '/api/transactions/stats';

export interface PeriodData {
  period: string;
  income: number;
  expense: number;
  savings: number;
}

export interface ReportStats {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  savingsRate: number;
  timeStats: PeriodData[];
  categoryStats?: CategoryStat[];
}

export interface CategoryStat {
  categoryId: string;
  name: string;
  amount: number;
  percentage: number;
  color?: string;
  icon?: string;
}

export interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  color?: string;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  period?: 'month' | 'quarter' | 'year';
}

/**
 * Pobiera statystyki dla wybranego okresu
 */
export const getReportStats = async (filters: ReportFilters): Promise<ReportStats> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  // Budowanie URL z parametrami
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.period) params.append('period', filters.period);

  const url = `${API_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Błąd pobierania statystyk');
  }

  const data = await response.json();
  console.log('Raw API Response:', data);
  
  const overview = data.overview || {};
  
  // Przetwarzanie danych czasowych
  const timeStats: PeriodData[] = (data.timeStats || []).map((stat: { timePeriod: string; income: number; expense: number }) => ({
    period: stat.timePeriod,
    income: Number(stat.income) || 0,
    expense: Number(stat.expense) || 0,
    savings: (Number(stat.income) || 0) - (Number(stat.expense) || 0)
  }));

  const totalIncome = overview.totalIncome || 0;
  const totalExpense = overview.totalExpense || 0;
  const totalSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

  console.log('Total Income:', totalIncome, 'Total Expense:', totalExpense);
  console.log('Raw categoryStats from API:', data.categoryStats);

  // Przetwarzanie statystyk kategorii (tylko wydatki)
  const categoryStats: CategoryStat[] = (data.categoryStats || [])
    .filter((stat: { isIncome: boolean }) => stat.isIncome === false)
    .map((stat: { categoryId: string; name: string; totalAmount: number; color: string; icon: string }) => {
      const amount = Number(stat.totalAmount) || 0;
      const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
      console.log(`Processing category ${stat.name}: amount=${amount}, percentage=${percentage}`);
      return {
        categoryId: stat.categoryId,
        name: stat.name,
        amount,
        percentage,
        color: stat.color,
        icon: stat.icon
      };
    })
    .sort((a: CategoryStat, b: CategoryStat) => b.amount - a.amount);

  return {
    totalIncome,
    totalExpense,
    totalSavings,
    savingsRate,
    timeStats,
    categoryStats
  };
};

/**
 * Oblicza daty początku i końca dla wybranego okresu
 */
export const getPeriodDates = (periodType: 'month' | 'quarter' | 'year'): { startDate: string; endDate: string } => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0]; // Dzisiejsza data
  let startDate: Date;

  switch (periodType) {
    case 'month':
      // Ostatnie 6 miesięcy
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 5);
      startDate.setDate(1);
      break;
    case 'quarter':
      // Ostatnie 4 kwartały (12 miesięcy)
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 11);
      startDate.setDate(1);
      break;
    case 'year':
      // Ostatnie 3 lata
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 2);
      startDate.setMonth(0);
      startDate.setDate(1);
      break;
    default:
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 5);
      startDate.setDate(1);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate
  };
};

/**
 * Grupuje dane miesięczne w dane kwartalne
 */
export const groupByQuarter = (monthlyData: PeriodData[]): PeriodData[] => {
  const quarterMap = new Map<string, { income: number; expense: number; count: number }>();

  monthlyData.forEach(item => {
    // Format: YYYY-MM
    const [year, month] = item.period.split('-');
    const monthNum = parseInt(month);
    const quarter = Math.ceil(monthNum / 3);
    const quarterKey = `${year}-Q${quarter}`;

    const existing = quarterMap.get(quarterKey) || { income: 0, expense: 0, count: 0 };
    quarterMap.set(quarterKey, {
      income: existing.income + item.income,
      expense: existing.expense + item.expense,
      count: existing.count + 1
    });
  });

  return Array.from(quarterMap.entries())
    .map(([period, data]) => ({
      period,
      income: data.income,
      expense: data.expense,
      savings: data.income - data.expense
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
};

/**
 * Grupuje dane miesięczne w dane roczne
 */
export const groupByYear = (monthlyData: PeriodData[]): PeriodData[] => {
  const yearMap = new Map<string, { income: number; expense: number; count: number }>();

  monthlyData.forEach(item => {
    // Format: YYYY-MM
    const year = item.period.split('-')[0];

    const existing = yearMap.get(year) || { income: 0, expense: 0, count: 0 };
    yearMap.set(year, {
      income: existing.income + item.income,
      expense: existing.expense + item.expense,
      count: existing.count + 1
    });
  });

  return Array.from(yearMap.entries())
    .map(([period, data]) => ({
      period,
      income: data.income,
      expense: data.expense,
      savings: data.income - data.expense
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
};

/**
 * Formatuje walutę
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Zwraca nazwę okresu w zależności od typu
 */
export const getPeriodLabel = (periodType: 'month' | 'quarter' | 'year'): string => {
  switch (periodType) {
    case 'month':
      return 'Miesięczne';
    case 'quarter':
      return 'Kwartalne';
    case 'year':
      return 'Roczne';
    default:
      return 'Miesięczne';
  }
};

/**
 * Pobiera porównanie budżetu vs rzeczywiste wydatki dla wybranego okresu
 */
export const getBudgetComparison = async (filters: ReportFilters): Promise<BudgetComparison[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  try {
    // Pobierz ID użytkownika z tokenu
    const userId = getUserId();
    if (!userId) {
      throw new Error('Brak ID użytkownika');
    }

    // Pobierz aktywny budżet
    const activeBudgetResponse = await fetch(`/api/budgets/active?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!activeBudgetResponse.ok) {
      throw new Error('Błąd pobierania aktywnego budżetu');
    }

    const activeBudget = await activeBudgetResponse.json();

    // Pobierz statystyki budżetu
    const statsResponse = await fetch(`/api/budgets/${activeBudget.id}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!statsResponse.ok) {
      throw new Error('Błąd pobierania statystyk budżetu');
    }

    const stats = await statsResponse.json();

    // Dla okresów kwartalnych i rocznych, pobierz transakcje z wybranego okresu
    const dates = getPeriodDates(filters.period || 'month');
    const transactionsStatsResponse = await fetch(
      `/api/transactions/stats?startDate=${dates.startDate}&endDate=${dates.endDate}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!transactionsStatsResponse.ok) {
      throw new Error('Błąd pobierania statystyk transakcji');
    }

    const transactionsStats = await transactionsStatsResponse.json();

    // Mapowanie statystyk kategorii na format BudgetComparison
    const categorySpending: Record<string, number> = {};
    (transactionsStats.categoryStats || [])
      .filter((stat: { isIncome: boolean }) => stat.isIncome === false)
      .forEach((stat: { categoryId: string; totalAmount: number }) => {
        categorySpending[stat.categoryId] = Number(stat.totalAmount) || 0;
      });

    // Tworzenie porównania
    const comparisons: BudgetComparison[] = (stats.categories || []).map((cat: {
      categoryId: string;
      name: string;
      allocated: number;
      color: string;
    }) => {
      const actual = categorySpending[cat.categoryId] || 0;
      
      // Dla okresów dłuższych niż miesiąc, przeskaluj budżet
      let budgeted = cat.allocated;
      if (filters.period === 'quarter') {
        budgeted = cat.allocated * 3; // 3 miesiące
      } else if (filters.period === 'year') {
        budgeted = cat.allocated * 12; // 12 miesięcy
      }

      return {
        category: cat.name,
        budgeted,
        actual,
        variance: budgeted - actual,
        color: cat.color
      };
    });

    return comparisons;
  } catch (error) {
    console.error('Błąd pobierania porównania budżetu:', error);
    throw error;
  }
};
