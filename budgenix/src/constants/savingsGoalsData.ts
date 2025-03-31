// Savings goals data for the savings-goals page
// This simulates data that would come from a database

export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  contributions: { date: string; amount: number }[];
}

export const savingsGoals: SavingsGoal[] = [
  {
    id: 1,
    name: 'Wakacje w Grecji',
    targetAmount: 8000,
    currentAmount: 4500,
    deadline: '2025-07-15',
    icon: '🏖️',
    color: 'blue',
    description: 'Wakacje all-inclusive dla całej rodziny',
    priority: 'high',
    contributions: [
      { date: '2025-01-15', amount: 1000 },
      { date: '2025-02-15', amount: 1500 },
      { date: '2025-03-15', amount: 2000 },
    ]
  },
  {
    id: 2,
    name: 'Nowy laptop',
    targetAmount: 5000,
    currentAmount: 2800,
    deadline: '2025-05-01',
    icon: '💻',
    color: 'purple',
    description: 'MacBook Pro do pracy i nauki',
    priority: 'medium',
    contributions: [
      { date: '2025-01-10', amount: 1000 },
      { date: '2025-02-10', amount: 800 },
      { date: '2025-03-10', amount: 1000 },
    ]
  },
  {
    id: 3,
    name: 'Fundusz awaryjny',
    targetAmount: 15000,
    currentAmount: 7500,
    deadline: '2025-12-31',
    icon: '🛡️',
    color: 'emerald',
    description: 'Zabezpieczenie na nieprzewidziane wydatki',
    priority: 'high',
    contributions: [
      { date: '2025-01-05', amount: 2500 },
      { date: '2025-02-05', amount: 2500 },
      { date: '2025-03-05', amount: 2500 },
    ]
  },
  {
    id: 4,
    name: 'Nowy samochód',
    targetAmount: 50000,
    currentAmount: 12000,
    deadline: '2026-06-30',
    icon: '🚗',
    color: 'red',
    description: 'Wymiana starego samochodu na nowszy model',
    priority: 'medium',
    contributions: [
      { date: '2025-01-20', amount: 4000 },
      { date: '2025-02-20', amount: 4000 },
      { date: '2025-03-20', amount: 4000 },
    ]
  },
  {
    id: 5,
    name: 'Remont mieszkania',
    targetAmount: 20000,
    currentAmount: 5000,
    deadline: '2025-09-01',
    icon: '🏠',
    color: 'amber',
    description: 'Odświeżenie kuchni i łazienki',
    priority: 'low',
    contributions: [
      { date: '2025-01-25', amount: 2000 },
      { date: '2025-02-25', amount: 1500 },
      { date: '2025-03-25', amount: 1500 },
    ]
  }
];

export interface SavingsProgressCardProps {
  totalSaved: number;
  totalTarget: number;
  progress: number;
  remainingAmount: number;
}

export interface SavingsGoalCardProps {
  goal: SavingsGoal;
  progress: number;
  daysUntil: number;
  monthlyContribution: number;
  formattedCurrentAmount: string;
  formattedTargetAmount: string;
  formattedDeadline: string;
  formattedMonthlyContribution: string;
  onDelete: (id: number) => void;
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getDaysUntil = (dateString: string) => {
  const today = new Date();
  const deadline = new Date(dateString);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calculateProgress = (current: number, target: number) => {
  return Math.min(Math.round((current / target) * 100), 100);
};

export const calculateMonthlyContribution = (goal: SavingsGoal) => {
  const today = new Date();
  const deadline = new Date(goal.deadline);
  const diffMonths = (deadline.getFullYear() - today.getFullYear()) * 12 + 
                     (deadline.getMonth() - today.getMonth());
  
  if (diffMonths <= 0) return 0;
  
  const remaining = goal.targetAmount - goal.currentAmount;
  return remaining / diffMonths;
};
