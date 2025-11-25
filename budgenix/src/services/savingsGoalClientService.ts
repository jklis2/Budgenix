import { SavingsGoal } from '@prisma/client';
import { buildApiUrl } from '@/lib/utils/apiUrl';

export interface SavingsGoalWithContributions extends SavingsGoal {
  contributions: SavingsGoalContribution[];
}

export interface SavingsGoalContribution {
  id: string;
  amount: number;
  date: string;
  accountId: string;
  savingsGoalId: string;
  createdAt: string;
  updatedAt: string;
  accountName?: string;
}

export interface SavingsGoalStats {
  totalSaved: number;
  totalTarget: number;
  progress: number;
  remainingAmount: number;
}

export interface CreateSavingsGoalDto {
  name: string;
  targetAmount: number;
  startDate: Date | string;
  targetDate: Date | string;
  icon?: string;
  color?: string;
  userId: string;
}

export interface UpdateSavingsGoalDto {
  name?: string;
  targetAmount?: number;
  startDate?: Date | string;
  targetDate?: Date | string;
  isCompleted?: boolean;
  icon?: string;
  color?: string;
  userId: string;
}

export interface CreateContributionDto {
  amount: number;
  accountId: string;
  date?: Date | string;
  userId: string;
}

// Get all savings goals for a user
export const getSavingsGoals = async (userId: string, isCompleted?: boolean): Promise<SavingsGoalWithContributions[]> => {
  try {
    let url = buildApiUrl(`/api/savings-goals?userId=${userId}`);
    if (isCompleted !== undefined) {
      url += `&isCompleted=${isCompleted}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch savings goals');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    throw error;
  }
};

// Get a single savings goal by ID
export const getSavingsGoal = async (goalId: string, userId: string): Promise<SavingsGoalWithContributions> => {
  try {
    const response = await fetch(buildApiUrl(`/api/savings-goals/${goalId}?userId=${userId}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch savings goal');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching savings goal:', error);
    throw error;
  }
};

// Create a new savings goal
export const createSavingsGoal = async (data: CreateSavingsGoalDto): Promise<SavingsGoal> => {
  try {
    const response = await fetch(buildApiUrl('/api/savings-goals'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create savings goal');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating savings goal:', error);
    throw error;
  }
};

// Update an existing savings goal
export const updateSavingsGoal = async (goalId: string, data: UpdateSavingsGoalDto): Promise<SavingsGoal> => {
  try {
    const response = await fetch(buildApiUrl(`/api/savings-goals/${goalId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update savings goal');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating savings goal:', error);
    throw error;
  }
};

// Delete a savings goal
export const deleteSavingsGoal = async (goalId: string, userId: string): Promise<void> => {
  try {
    const response = await fetch(buildApiUrl(`/api/savings-goals/${goalId}?userId=${userId}`), {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete savings goal');
    }
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    throw error;
  }
};

// Add a contribution to a savings goal
export const addContribution = async (goalId: string, data: CreateContributionDto): Promise<SavingsGoalContribution> => {
  try {
    const response = await fetch(buildApiUrl(`/api/savings-goals/${goalId}/contributions`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add contribution');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding contribution:', error);
    throw error;
  }
};

// Remove a contribution from a savings goal
export const removeContribution = async (goalId: string, contributionId: string, userId: string): Promise<void> => {
  try {
    const response = await fetch(buildApiUrl(`/api/savings-goals/${goalId}/contributions/${contributionId}?userId=${userId}`), {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove contribution');
    }
  } catch (error) {
    console.error('Error removing contribution:', error);
    throw error;
  }
};

// Get statistics for all savings goals
export const getSavingsGoalStats = async (userId: string): Promise<SavingsGoalStats> => {
  try {
    const response = await fetch(buildApiUrl(`/api/savings-goals/stats?userId=${userId}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch savings goal statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching savings goal stats:', error);
    throw error;
  }
};

// Helper functions
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

export const calculateMonthlyContribution = (goal: SavingsGoalWithContributions) => {
  const today = new Date();
  const deadline = new Date(goal.targetDate);
  const diffMonths = (deadline.getFullYear() - today.getFullYear()) * 12 + 
                     (deadline.getMonth() - today.getMonth());
  
  if (diffMonths <= 0) return 0;
  
  const remaining = goal.targetAmount - goal.currentAmount;
  return remaining / diffMonths;
};
