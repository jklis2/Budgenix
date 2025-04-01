// Definicje typów i funkcje pomocnicze dla kont

export interface Account {
  id: string;
  name: string;
  accountType: string;
  balance: number;
  currency: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'PLN') => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Account type options
export const accountTypes = [
  { value: 'Checking', label: 'Rachunek bieżący' },
  { value: 'Savings', label: 'Rachunek oszczędnościowy' },
  { value: 'Credit Card', label: 'Karta kredytowa' },
  { value: 'Cash', label: 'Gotówka' },
  { value: 'Investment', label: 'Konto inwestycyjne' },
  { value: 'Loan', label: 'Pożyczka' },
  { value: 'Other', label: 'Inne' }
];

// Currency options
export const currencyOptions = [
  { value: 'PLN', label: 'PLN - Polski złoty' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'USD', label: 'USD - Dolar amerykański' },
  { value: 'GBP', label: 'GBP - Funt brytyjski' },
  { value: 'CHF', label: 'CHF - Frank szwajcarski' }
];
