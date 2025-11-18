// This file contains dummy data for the dashboard
// In the future, this data will come from a database

export const financialSummaryData = [
  {
    id: 1,
    title: 'Saldo konta',
    value: 12450.75,
    iconColor: 'text-emerald-600',
    trendIcon: 'up',
    trendText: '+12.5% od ostatniego miesiąca',
    trendColor: 'text-emerald-600'
  },
  {
    id: 2,
    title: 'Miesięczny przychód',
    value: 8500,
    iconColor: 'text-blue-600',
    trendIcon: 'up',
    trendText: 'Stabilny przychód',
    trendColor: 'text-blue-600'
  },
  {
    id: 3,
    title: 'Miesięczne wydatki',
    value: 5200.25,
    iconColor: 'text-red-600',
    trendIcon: 'down',
    trendText: '-5.2% od ostatniego miesiąca',
    trendColor: 'text-red-600'
  },
  {
    id: 4,
    title: 'Wskaźnik oszczędności',
    value: 38.8,
    isPercentage: true,
    iconColor: 'text-purple-600',
    trendIcon: 'up',
    trendText: 'Dobry poziom oszczędności',
    trendColor: 'text-purple-600'
  }
];

export const quickActionsData = [
  {
    id: 1,
    title: 'Dodaj transakcję',
    description: 'Szybko dodaj nowy przychód lub wydatek do swojego budżetu',
    buttonText: 'Dodaj teraz',
    gradientFrom: 'indigo-600',
    gradientTo: 'indigo-800',
    textColor: 'text-indigo-200'
  },
  {
    id: 2,
    title: 'Utwórz budżet',
    description: 'Zaplanuj swoje wydatki i kontroluj finanse z miesięcznym budżetem',
    buttonText: 'Zaplanuj budżet',
    gradientFrom: 'emerald-600',
    gradientTo: 'emerald-800',
    textColor: 'text-emerald-200'
  },
  {
    id: 3,
    title: 'Cel oszczędnościowy',
    description: 'Ustaw nowy cel oszczędnościowy i śledź swoje postępy',
    buttonText: 'Ustaw cel',
    gradientFrom: 'yellow-500',
    gradientTo: 'orange-600',
    textColor: 'text-yellow-100'
  }
];

export const recentTransactions = [
  { id: 1, title: 'Zakupy spożywcze', amount: -245.50, date: '2025-03-18', category: 'Żywność' },
  { id: 2, title: 'Wynagrodzenie', amount: 8500, date: '2025-03-15', category: 'Przychód' },
  { id: 3, title: 'Netflix', amount: -49, date: '2025-03-12', category: 'Subskrypcje' },
  { id: 4, title: 'Paliwo', amount: -320, date: '2025-03-10', category: 'Transport' },
  { id: 5, title: 'Restauracja', amount: -180, date: '2025-03-08', category: 'Rozrywka' },
];
