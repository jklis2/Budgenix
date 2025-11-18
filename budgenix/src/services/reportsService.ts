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

export interface FinancialInsight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  icon: string;
  priority: number; // 1-5, gdzie 5 to najważniejsze
  category: 'savings' | 'expenses' | 'budget' | 'trends' | 'categories';
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

/**
 * Generuje spostrzeżenia finansowe na podstawie danych
 */
export const generateFinancialInsights = (
  stats: ReportStats,
  budgetComparisons: BudgetComparison[],
  periodType: 'month' | 'quarter' | 'year'
): FinancialInsight[] => {
  const insights: FinancialInsight[] = [];
  
  // 1. Analiza oszczędności
  if (stats.savingsRate > 0) {
    if (stats.savingsRate >= 30) {
      insights.push({
        title: 'Świetna stopa oszczędności! 🎉',
        description: `Oszczędzasz ${stats.savingsRate}% swoich przychodów. To wynik powyżej zalecanych 20%. Kontynuuj dobrą pracę!`,
        type: 'positive',
        icon: '💰',
        priority: 5,
        category: 'savings'
      });
    } else if (stats.savingsRate >= 20) {
      insights.push({
        title: 'Dobra stopa oszczędności',
        description: `Oszczędzasz ${stats.savingsRate}% przychodów. To zdrowa stopa oszczędności zgodna z rekomendacjami finansowymi.`,
        type: 'positive',
        icon: '📈',
        priority: 4,
        category: 'savings'
      });
    } else if (stats.savingsRate >= 10) {
      insights.push({
        title: 'Potencjał do zwiększenia oszczędności',
        description: `Obecnie oszczędzasz ${stats.savingsRate}% przychodów. Rozważ zwiększenie do 20% dla lepszej stabilności finansowej.`,
        type: 'neutral',
        icon: '💡',
        priority: 3,
        category: 'savings'
      });
    } else {
      insights.push({
        title: 'Niska stopa oszczędności',
        description: `Oszczędzasz tylko ${stats.savingsRate}% przychodów. Spróbuj znaleźć obszary do optymalizacji wydatków.`,
        type: 'warning',
        icon: '⚠️',
        priority: 5,
        category: 'savings'
      });
    }
  } else {
    insights.push({
      title: 'Wydatki przekraczają przychody',
      description: `Wydajesz więcej niż zarabiasz (${Math.abs(stats.savingsRate)}% deficytu). Wymaga to natychmiastowej uwagi!`,
      type: 'negative',
      icon: '🚨',
      priority: 5,
      category: 'savings'
    });
  }

  // 2. Analiza trendów
  if (stats.timeStats && stats.timeStats.length >= 2) {
    const recentPeriods = stats.timeStats.slice(-3);
    const olderPeriods = stats.timeStats.slice(0, -3);
    
    if (recentPeriods.length >= 2 && olderPeriods.length >= 2) {
      const recentAvgExpense = recentPeriods.reduce((sum, p) => sum + p.expense, 0) / recentPeriods.length;
      const olderAvgExpense = olderPeriods.reduce((sum, p) => sum + p.expense, 0) / olderPeriods.length;
      const expenseChange = ((recentAvgExpense - olderAvgExpense) / olderAvgExpense) * 100;

      if (expenseChange > 15) {
        insights.push({
          title: 'Rosnące wydatki - uwaga!',
          description: `Twoje wydatki wzrosły o ${expenseChange.toFixed(1)}% w ostatnich okresach. Przeanalizuj, co się zmieniło.`,
          type: 'warning',
          icon: '📊',
          priority: 4,
          category: 'trends'
        });
      } else if (expenseChange < -10) {
        insights.push({
          title: 'Spadające wydatki - świetnie!',
          description: `Twoje wydatki spadły o ${Math.abs(expenseChange).toFixed(1)}%. Dobra optymalizacja budżetu!`,
          type: 'positive',
          icon: '📉',
          priority: 4,
          category: 'trends'
        });
      }

      // Analiza przychodów
      const recentAvgIncome = recentPeriods.reduce((sum, p) => sum + p.income, 0) / recentPeriods.length;
      const olderAvgIncome = olderPeriods.reduce((sum, p) => sum + p.income, 0) / olderPeriods.length;
      const incomeChange = ((recentAvgIncome - olderAvgIncome) / olderAvgIncome) * 100;

      if (incomeChange > 10) {
        insights.push({
          title: 'Rosnące przychody! 🎯',
          description: `Twoje przychody wzrosły o ${incomeChange.toFixed(1)}%. Rozważ zwiększenie stopy oszczędności.`,
          type: 'positive',
          icon: '💵',
          priority: 4,
          category: 'trends'
        });
      } else if (incomeChange < -10) {
        insights.push({
          title: 'Spadające przychody',
          description: `Twoje przychody spadły o ${Math.abs(incomeChange).toFixed(1)}%. Może czas poszukać dodatkowych źródeł dochodu?`,
          type: 'warning',
          icon: '📉',
          priority: 5,
          category: 'trends'
        });
      }
    }
  }

  // 3. Analiza kategorii wydatków
  if (stats.categoryStats && stats.categoryStats.length > 0) {
    const topCategory = stats.categoryStats[0];
    
    if (topCategory.percentage > 50) {
      insights.push({
        title: 'Koncentracja wydatków',
        description: `Kategoria "${topCategory.name}" stanowi ${topCategory.percentage}% wszystkich wydatków. Rozważ dywersyfikację lub optymalizację.`,
        type: 'neutral',
        icon: '🎯',
        priority: 3,
        category: 'categories'
      });
    }

    // Znajdź małe wydatki, które się sumują
    const smallCategories = stats.categoryStats.filter(cat => cat.percentage < 10 && cat.percentage > 2);
    if (smallCategories.length >= 3) {
      const smallTotal = smallCategories.reduce((sum, cat) => sum + cat.percentage, 0);
      if (smallTotal > 20) {
        insights.push({
          title: 'Drobne wydatki się sumują',
          description: `Masz ${smallCategories.length} kategorii wydatków poniżej 10%, które łącznie stanowią ${smallTotal.toFixed(0)}% budżetu. Warto je przeanalizować.`,
          type: 'neutral',
          icon: '🔍',
          priority: 3,
          category: 'categories'
        });
      }
    }
  }

  // 4. Analiza budżetu
  if (budgetComparisons && budgetComparisons.length > 0) {
    const overBudget = budgetComparisons.filter(b => b.variance < 0);
    const underBudget = budgetComparisons.filter(b => b.variance > 0);
    
    if (overBudget.length > 0) {
      const totalOverBudget = Math.abs(overBudget.reduce((sum, b) => sum + b.variance, 0));
      const worstCategory = overBudget.reduce((worst, current) => 
        current.variance < worst.variance ? current : worst
      );
      
      insights.push({
        title: 'Przekroczenie budżetu',
        description: `Kategoria "${worstCategory.category}" przekroczyła budżet o ${formatCurrency(Math.abs(worstCategory.variance))}. Łącznie przekroczono budżet o ${formatCurrency(totalOverBudget)}.`,
        type: 'negative',
        icon: '⚠️',
        priority: 5,
        category: 'budget'
      });
    }
    
    if (underBudget.length >= budgetComparisons.length * 0.7) {
      insights.push({
        title: 'Doskonałe zarządzanie budżetem! 🏆',
        description: `Utrzymujesz się w budżecie w ${underBudget.length} z ${budgetComparisons.length} kategorii. Świetna kontrola wydatków!`,
        type: 'positive',
        icon: '🎖️',
        priority: 4,
        category: 'budget'
      });
    }

    // Najlepsza optymalizacja
    const bestSaving = underBudget.reduce((best, current) => 
      current.variance > best.variance ? current : best
    , underBudget[0] || { variance: 0, category: '' });
    
    if (bestSaving && bestSaving.variance > 100) {
      insights.push({
        title: 'Najlepsza optymalizacja',
        description: `Zaoszczędziłeś ${formatCurrency(bestSaving.variance)} w kategorii "${bestSaving.category}". Dobra robota!`,
        type: 'positive',
        icon: '🌟',
        priority: 3,
        category: 'budget'
      });
    }
  }

  // 5. Porady ogólne
  const expenseToIncomeRatio = stats.totalIncome > 0 ? (stats.totalExpense / stats.totalIncome) * 100 : 100;
  
  if (expenseToIncomeRatio >= 90 && expenseToIncomeRatio < 100) {
    insights.push({
      title: 'Niewielki margines bezpieczeństwa',
      description: `Wydajesz ${expenseToIncomeRatio.toFixed(0)}% swoich przychodów. Stwórz fundusz awaryjny na nieprzewidziane wydatki.`,
      type: 'warning',
      icon: '🛡️',
      priority: 4,
      category: 'savings'
    });
  }

  // 6. Porady dotyczące okresu
  if (periodType === 'month') {
    const avgMonthlyExpense = stats.totalExpense;
    const emergencyFund = avgMonthlyExpense * 6;
    
    insights.push({
      title: 'Fundusz awaryjny',
      description: `Zalecany fundusz awaryjny dla Twoich miesięcznych wydatków to ${formatCurrency(emergencyFund)} (6 miesięcy wydatków).`,
      type: 'neutral',
      icon: '🏦',
      priority: 2,
      category: 'savings'
    });
  }

  // Sortowanie według priorytetu
  return insights.sort((a, b) => b.priority - a.priority);
};
