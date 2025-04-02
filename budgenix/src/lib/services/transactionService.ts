import { getToken } from './authService';

const API_URL = '/api/transactions';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isIncome: boolean;
}

export interface Account {
  id: string;
  name: string;
  accountType: string;
  currency: string;
  balance: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: Date | string;
  description?: string;
  paymentMethod: string;
  isRecurring: boolean;
  categoryId: string;
  accountId: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: Category;
  account?: Account;
}

export interface TransactionCreateInput {
  title: string;
  amount: number;
  date: Date | string;
  description?: string;
  paymentMethod: string;
  isRecurring?: boolean;
  categoryId: string;
  accountId: string;
}

export interface TransactionUpdateInput {
  title?: string;
  amount?: number;
  date?: Date | string;
  description?: string;
  paymentMethod?: string;
  isRecurring?: boolean;
  categoryId?: string;
  accountId?: string;
}

export interface TransactionFilters {
  categoryId?: string;
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  paymentMethod?: string;
  isIncome?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeChange?: number;
  expenseChange?: number;
  balanceChange?: number;
  topExpenseCategories?: Array<{
    id: string;
    name: string;
    amount: number;
    percentage: number;
  }>;
  topIncomeCategories?: Array<{
    id: string;
    name: string;
    amount: number;
    percentage: number;
  }>;
  timeStats?: Array<{
    period: string;
    income: number;
    expense: number;
  }>;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  totalCount: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalPages?: number;
  currentPage?: number;
}

// Pobieranie wszystkich transakcji z możliwością filtrowania
export const getTransactions = async (filters?: TransactionFilters): Promise<TransactionsResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  // Budowanie URL z parametrami
  let url = API_URL;
  if (filters) {
    const params = new URLSearchParams();
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.accountId) params.append('accountId', filters.accountId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.search) params.append('search', filters.search);
    if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
    if (filters.isIncome !== undefined) params.append('isIncome', String(filters.isIncome));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.offset) params.append('offset', String(filters.offset));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.pageSize) params.append('pageSize', String(filters.pageSize));

    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Błąd pobierania transakcji');
  }

  return response.json();
};

// Pobieranie pojedynczej transakcji
export const getTransaction = async (id: string): Promise<Transaction> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Błąd pobierania transakcji');
  }

  return response.json();
};

// Tworzenie nowej transakcji
export const createTransaction = async (data: TransactionCreateInput): Promise<Transaction> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Błąd tworzenia transakcji');
  }

  return response.json();
};

// Aktualizacja transakcji
export const updateTransaction = async (id: string, data: TransactionUpdateInput): Promise<Transaction> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Błąd aktualizacji transakcji');
  }

  return response.json();
};

// Usuwanie transakcji
export const deleteTransaction = async (id: string): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Błąd usuwania transakcji');
  }
};

// Pobieranie statystyk transakcji
export const getTransactionStats = async (filters?: TransactionFilters): Promise<TransactionStats> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  // Budowanie URL z parametrami
  let url = `${API_URL}/stats`;
  if (filters) {
    const params = new URLSearchParams();
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.accountId) params.append('accountId', filters.accountId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.isIncome !== undefined) params.append('isIncome', filters.isIncome.toString());

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Wystąpił błąd podczas pobierania statystyk transakcji');
  }

  return await response.json();
};

// Pobieranie wszystkich kategorii
export const getCategories = async (): Promise<Category[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  const response = await fetch('/api/categories', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Wystąpił błąd podczas pobierania kategorii');
  }

  return await response.json();
};

// Pobieranie wszystkich kont
export const getAccounts = async (): Promise<Account[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Brak autoryzacji');
  }

  const response = await fetch('/api/accounts', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Wystąpił błąd podczas pobierania kont');
  }

  return await response.json();
};
