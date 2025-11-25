import { Budget, BudgetItem, Category } from '@prisma/client';
import { buildApiUrl } from '../lib/utils/apiUrl';

// Types for Budget with related items
export interface BudgetWithItems extends Budget {
  budgetItems: (BudgetItem & {
    category: Category;
  })[];
}

// Types for Budget Statistics
export interface BudgetSummary {
  currentMonth: string;
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  spentPercentage: number;
}

export interface CategoryStat {
  id: string;
  categoryId: string;
  name: string;
  color: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface BudgetStats {
  summary: BudgetSummary;
  categories: CategoryStat[];
}

// Budget Service Functions

/**
 * Get all budgets for a user with optional filtering
 */
export async function getBudgets(userId: string, isActive?: boolean): Promise<BudgetWithItems[]> {
  try {
    const queryParams = new URLSearchParams({ userId });
    
    if (isActive !== undefined) {
      queryParams.append('isActive', isActive.toString());
    }
    
    const response = await fetch(buildApiUrl(`/api/budgets?${queryParams.toString()}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch budgets');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getBudgets:', error);
    throw error;
  }
}

/**
 * Get a specific budget by ID
 */
export async function getBudget(id: string): Promise<BudgetWithItems> {
  try {
    const response = await fetch(buildApiUrl(`/api/budgets/${id}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch budget');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getBudget:', error);
    throw error;
  }
}

/**
 * Get the active budget for a user
 */
export async function getActiveBudget(userId: string): Promise<BudgetWithItems> {
  try {
    const response = await fetch(buildApiUrl(`/api/budgets/active?userId=${userId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch active budget');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getActiveBudget:', error);
    throw error;
  }
}

/**
 * Create a new budget
 */
export async function createBudget(budgetData: {
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  totalAmount: number;
  userId: string;
  budgetItems?: { allocatedAmount: number; categoryId: string }[];
}): Promise<BudgetWithItems> {
  try {
    const response = await fetch(buildApiUrl('/api/budgets'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(budgetData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create budget');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createBudget:', error);
    throw error;
  }
}

/**
 * Update an existing budget
 */
export async function updateBudget(id: string, budgetData: {
  name?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  totalAmount?: number;
  isActive?: boolean;
}): Promise<BudgetWithItems> {
  try {
    const response = await fetch(buildApiUrl(`/api/budgets/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(budgetData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update budget');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateBudget:', error);
    throw error;
  }
}

/**
 * Delete a budget
 */
export async function deleteBudget(id: string): Promise<{ message: string }> {
  try {
    const response = await fetch(buildApiUrl(`/api/budgets/${id}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete budget');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteBudget:', error);
    throw error;
  }
}

/**
 * Get statistics for a budget
 */
export async function getBudgetStats(id: string): Promise<BudgetStats> {
  try {
    const response = await fetch(buildApiUrl(`/api/budgets/${id}/stats`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch budget statistics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getBudgetStats:', error);
    throw error;
  }
}

/**
 * Get all budget items for a budget
 */
export async function getBudgetItems(budgetId: string): Promise<(BudgetItem & { category: Category })[]> {
  try {
    const response = await fetch(buildApiUrl(`/api/budgets/${budgetId}/items`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch budget items');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getBudgetItems:', error);
    throw error;
  }
}

/**
 * Create a new budget item
 */
export async function createBudgetItem(budgetId: string, itemData: {
  allocatedAmount: number;
  categoryId: string;
}): Promise<BudgetItem & { category: Category }> {
  try {
    const response = await fetch(buildApiUrl(`/api/budgets/${budgetId}/items`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create budget item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createBudgetItem:', error);
    throw error;
  }
}

/**
 * Update an existing budget item
 */
export async function updateBudgetItem(budgetId: string, itemId: string, itemData: {
  allocatedAmount?: number;
  categoryId?: string;
}): Promise<BudgetItem & { category: Category }> {
  try {
    const response = await fetch(buildApiUrl(`/api/budgets/${budgetId}/items/${itemId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update budget item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateBudgetItem:', error);
    throw error;
  }
}

/**
 * Delete a budget item
 */
export async function deleteBudgetItem(budgetId: string, itemId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(buildApiUrl(`/api/budgets/${budgetId}/items/${itemId}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete budget item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteBudgetItem:', error);
    throw error;
  }
}
