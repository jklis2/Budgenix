// Dane dla strony kont
// W przyszłości te dane będą pobierane z bazy danych

export interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
  currency: string;
  lastTransaction: string;
  isDefault: boolean;
  color: string;
}

export const accountsData: Account[] = [
  {
    id: 1,
    name: 'Konto osobiste',
    type: 'Rachunek bieżący',
    balance: 8450.75,
    currency: 'PLN',
    lastTransaction: '2025-03-28',
    isDefault: true,
    color: 'indigo'
  },
  {
    id: 2,
    name: 'Konto oszczędnościowe',
    type: 'Rachunek oszczędnościowy',
    balance: 15200.50,
    currency: 'PLN',
    lastTransaction: '2025-03-15',
    isDefault: false,
    color: 'emerald'
  },
  {
    id: 3,
    name: 'Karta kredytowa',
    type: 'Karta kredytowa',
    balance: -1250.30,
    currency: 'PLN',
    lastTransaction: '2025-03-25',
    isDefault: false,
    color: 'red'
  },
  {
    id: 4,
    name: 'Konto walutowe',
    type: 'Rachunek walutowy',
    balance: 2500.00,
    currency: 'EUR',
    lastTransaction: '2025-03-10',
    isDefault: false,
    color: 'blue'
  }
];

export const accountSummary = {
  totalBalance: accountsData.reduce((sum, account) => sum + account.balance, 0),
  totalAccounts: accountsData.length,
  totalMonthlyInflow: 9850.00,
  totalMonthlyOutflow: 5200.25
};

export const accountActions = [
  {
    id: 1,
    title: 'Dodaj nowe konto',
    description: 'Dodaj nowe konto bankowe lub kartę kredytową do swojego profilu',
    buttonText: 'Dodaj konto',
    gradientFrom: 'indigo-600',
    gradientTo: 'indigo-800',
    textColor: 'text-indigo-200',
    icon: 'add'
  },
  {
    id: 2,
    title: 'Przenieś środki',
    description: 'Wykonaj przelew pomiędzy swoimi kontami',
    buttonText: 'Wykonaj przelew',
    gradientFrom: 'emerald-600',
    gradientTo: 'emerald-800',
    textColor: 'text-emerald-200',
    icon: 'transfer'
  }
];

export const recentAccountActivity = [
  { id: 1, accountId: 1, description: 'Wpływ wynagrodzenia', amount: 8500, date: '2025-03-28' },
  { id: 2, accountId: 1, description: 'Zakupy spożywcze', amount: -245.50, date: '2025-03-27' },
  { id: 3, accountId: 2, description: 'Wpłata na konto oszczędnościowe', amount: 1000, date: '2025-03-15' },
  { id: 4, accountId: 3, description: 'Zakupy online', amount: -450.30, date: '2025-03-25' },
  { id: 5, accountId: 4, description: 'Wymiana waluty', amount: 500, date: '2025-03-10' }
];

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'PLN') => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to format date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
