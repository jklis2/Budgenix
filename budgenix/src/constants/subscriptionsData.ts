// Subscription data for the subscriptions page
// This simulates data that would come from a database

export interface Subscription {
  id: number;
  name: string;
  amount: number;
  cycle: string;
  nextPayment: string;
  category: string;
  logo: string;
  color: string;
  active: boolean;
  accountId?: string;
}

export const subscriptions: Subscription[] = [
  { 
    id: 1, 
    name: 'Netflix', 
    amount: 49, 
    cycle: 'monthly', 
    nextPayment: '2025-04-05', 
    category: 'Rozrywka',
    logo: '🎬',
    color: 'red',
    active: true
  },
  { 
    id: 2, 
    name: 'Spotify Premium', 
    amount: 19.99, 
    cycle: 'monthly', 
    nextPayment: '2025-03-22', 
    category: 'Rozrywka',
    logo: '🎵',
    color: 'green',
    active: true
  },
  { 
    id: 3, 
    name: 'Microsoft 365', 
    amount: 29.99, 
    cycle: 'monthly', 
    nextPayment: '2025-04-10', 
    category: 'Praca',
    logo: '💼',
    color: 'blue',
    active: true
  },
  { 
    id: 4, 
    name: 'YouTube Premium', 
    amount: 25.99, 
    cycle: 'monthly', 
    nextPayment: '2025-03-28', 
    category: 'Rozrywka',
    logo: '📺',
    color: 'red',
    active: true
  },
  { 
    id: 5, 
    name: 'iCloud Storage', 
    amount: 14.99, 
    cycle: 'monthly', 
    nextPayment: '2025-04-02', 
    category: 'Technologia',
    logo: '☁️',
    color: 'blue',
    active: true
  },
  { 
    id: 6, 
    name: 'Siłownia', 
    amount: 99, 
    cycle: 'monthly', 
    nextPayment: '2025-04-01', 
    category: 'Zdrowie',
    logo: '💪',
    color: 'purple',
    active: true
  },
  { 
    id: 7, 
    name: 'Ubezpieczenie', 
    amount: 120, 
    cycle: 'monthly', 
    nextPayment: '2025-04-15', 
    category: 'Finanse',
    logo: '🛡️',
    color: 'indigo',
    active: true
  },
  { 
    id: 8, 
    name: 'HBO Max', 
    amount: 29.99, 
    cycle: 'monthly', 
    nextPayment: '2025-03-25', 
    category: 'Rozrywka',
    logo: '🎭',
    color: 'purple',
    active: false
  }
];

export interface SubscriptionSummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
}

export interface UpcomingPaymentCardProps {
  subscription: Subscription;
  daysUntil: number;
  formattedAmount: string;
}

export interface SubscriptionTipProps {
  title: string;
  content: string;
  icon: string;
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
  const nextPayment = new Date(dateString);
  const diffTime = nextPayment.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const subscriptionTips = [
  {
    title: "Wskazówka oszczędnościowa",
    content: "Regularnie przeglądaj swoje subskrypcje i zastanów się, czy wszystkie są Ci potrzebne. Rezygnacja z jednej niepotrzebnej subskrypcji o wartości 30 zł miesięcznie pozwoli Ci zaoszczędzić 360 zł rocznie!",
    icon: "info"
  }
];
