import { getToken } from './authService';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isIncome: boolean;
}

export interface CategoryWithStats extends Category {
  budget?: number;
  spent?: number;
  transactions?: number;
  percentage?: number;
}

export interface CategoryCreateInput {
  name: string;
  icon: string;
  color: string;
  isIncome?: boolean;
  isDefault?: boolean;
}

export interface CategoryUpdateInput {
  name?: string;
  icon?: string;
  color?: string;
  isIncome?: boolean;
}

const API_URL = '/api/categories';

// Pobieranie wszystkich kategorii
export const getCategories = async (): Promise<Category[]> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Brak autoryzacji');
  }
  
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Błąd pobierania kategorii');
  }
  
  return response.json();
};

// Pobieranie pojedynczej kategorii
export const getCategory = async (id: string): Promise<Category> => {
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
    throw new Error('Błąd pobierania kategorii');
  }
  
  return response.json();
};

// Tworzenie nowej kategorii
export const createCategory = async (data: CategoryCreateInput): Promise<Category> => {
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
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Błąd tworzenia kategorii');
  }
  
  return response.json();
};

// Aktualizacja kategorii
export const updateCategory = async (id: string, data: CategoryUpdateInput): Promise<Category> => {
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
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Błąd aktualizacji kategorii');
  }
  
  return response.json();
};

// Usuwanie kategorii
export const deleteCategory = async (id: string): Promise<void> => {
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
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Błąd usuwania kategorii');
  }
};
