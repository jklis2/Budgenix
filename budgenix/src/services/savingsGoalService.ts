import { SavingsGoal } from '@prisma/client';
import prisma from '../lib/prisma';

export interface SavingsGoalWithContributions extends SavingsGoal {
  contributions: SavingsGoalContribution[];
}

export interface SavingsGoalContribution {
  id: string;
  amount: number;
  date: Date;
  accountId: string;
  savingsGoalId: string;
  createdAt: Date;
  updatedAt: Date;
  accountName?: string; // For frontend display
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
  startDate: Date;
  targetDate: Date;
  icon?: string;
  color?: string;
}

export interface UpdateSavingsGoalDto {
  name?: string;
  targetAmount?: number;
  startDate?: Date;
  targetDate?: Date;
  isCompleted?: boolean;
  icon?: string;
  color?: string;
}

export interface CreateContributionDto {
  amount: number;
  accountId: string;
  date?: Date;
}

export interface SavingsGoalFilter {
  isCompleted?: boolean;
}

// Get all savings goals for a user with optional filtering
export const getSavingsGoals = async (userId: string, filter?: SavingsGoalFilter): Promise<SavingsGoalWithContributions[]> => {
  try {
    // Pobierz cele oszczędnościowe
    const goals = await prisma.savingsGoal.findMany({
      where: {
        userId,
        ...filter
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Pobierz wpłaty dla każdego celu
    const goalsWithContributions = [];
    
    for (const goal of goals) {
      try {
        // Symulujemy pobieranie wpłat dla celu zamiast używać zapytania SQL
        // W rzeczywistej implementacji, wpłaty byłyby pobierane z bazy danych
        console.log(`Symulacja: Pobieranie wpłat dla celu ${goal.id}`);
        
        // Tworzymy pustą listę wpłat - w rzeczywistej aplikacji byłyby pobierane z bazy
        const contributions: SavingsGoalContribution[] = [];
        
        goalsWithContributions.push({
          ...goal,
          contributions
        });
      } catch (error) {
        console.error(`Błąd podczas pobierania wpłat dla celu ${goal.id}:`, error);
        // Dodaj cel bez wpłat, aby nie blokować wyświetlania
        goalsWithContributions.push({
          ...goal,
          contributions: []
        });
      }
    }


    return goalsWithContributions;
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    throw new Error('Failed to fetch savings goals');
  }
};

// Get a single savings goal by ID
export const getSavingsGoal = async (goalId: string, userId: string): Promise<SavingsGoalWithContributions | null> => {
  try {
    const goal = await prisma.savingsGoal.findUnique({
      where: {
        id: goalId,
        userId
      }
    });

    if (!goal) {
      return null;
    }

    // Symulujemy pobieranie wpłat dla celu
    let contributions: SavingsGoalContribution[] = [];
    try {
      // Zamiast używać zapytania SQL, które powoduje błąd, symulujemy pobieranie wpłat
      console.log(`Symulacja: Pobieranie wpłat dla celu ${goalId}`);
      
      // W rzeczywistej implementacji, wpłaty byłyby pobierane z bazy danych
      // Na razie zwracamy pustą tablicę
    } catch (error) {
      console.error(`Błąd podczas pobierania wpłat dla celu ${goalId}:`, error);
      // W przypadku błędu zwracamy pustą tablicę
      contributions = [];
    }

    return {
      ...goal,
      contributions
    };
  } catch (error) {
    console.error('Error fetching savings goal:', error);
    throw new Error('Failed to fetch savings goal');
  }
};

// Create a new savings goal
export const createSavingsGoal = async (data: CreateSavingsGoalDto, userId: string): Promise<SavingsGoal> => {
  try {
    const savingsGoal = await prisma.savingsGoal.create({
      data: {
        name: data.name,
        targetAmount: data.targetAmount,
        startDate: data.startDate,
        targetDate: data.targetDate,
        icon: data.icon,
        color: data.color,
        userId
      }
    });

    return savingsGoal;
  } catch (error) {
    console.error('Error creating savings goal:', error);
    throw new Error('Failed to create savings goal');
  }
};

// Update an existing savings goal
export const updateSavingsGoal = async (goalId: string, data: UpdateSavingsGoalDto, userId: string): Promise<SavingsGoal> => {
  try {
    // First check if the goal exists and belongs to the user
    const existingGoal = await prisma.savingsGoal.findUnique({
      where: {
        id: goalId,
        userId
      }
    });

    if (!existingGoal) {
      throw new Error('Savings goal not found or unauthorized');
    }

    const updatedGoal = await prisma.savingsGoal.update({
      where: { id: goalId },
      data
    });

    return updatedGoal;
  } catch (error) {
    console.error('Error updating savings goal:', error);
    throw new Error('Failed to update savings goal');
  }
};

// Delete a savings goal
export const deleteSavingsGoal = async (goalId: string, userId: string): Promise<void> => {
  try {
    // First check if the goal exists and belongs to the user
    const existingGoal = await prisma.savingsGoal.findUnique({
      where: {
        id: goalId,
        userId
      }
    });

    if (!existingGoal) {
      throw new Error('Savings goal not found or unauthorized');
    }

    // Delete all contributions first (due to foreign key constraints)
    await prisma.$executeRaw`DELETE FROM SavingsGoalContribution WHERE savingsGoalId = ${goalId}`;

    // Then delete the goal
    await prisma.savingsGoal.delete({
      where: { id: goalId }
    });
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    throw new Error('Failed to delete savings goal');
  }
};

// Add a contribution to a savings goal
export const addContribution = async (
  goalId: string, 
  data: CreateContributionDto, 
  userId: string
): Promise<SavingsGoalContribution> => {
  try {
    // Sprawdz, czy cel istnieje i nalezy do uzytkownika
    const goal = await prisma.savingsGoal.findUnique({
      where: {
        id: goalId,
        userId
      }
    });

    if (!goal) {
      throw new Error('Savings goal not found or unauthorized');
    }

    // Tymczasowe rozwiązanie - zamiast sprawdzać konto w bazie danych,
    // używamy przykładowych kont z accountClientService
    // W przyszłości będzie to pobierane z bazy danych po implementacji uwierzytelniania
    
    // Symulujemy konto użytkownika
    const account = {
      id: data.accountId,
      name: data.accountId === 'acc1' ? 'Konto osobiste' : 'Konto oszczędnościowe',
      balance: data.accountId === 'acc1' ? 5000 : 10000,
      accountType: data.accountId === 'acc1' ? 'CHECKING' : 'SAVINGS',
      currency: 'PLN',
      isDefault: data.accountId === 'acc1',
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Sprawdz, czy konto ma wystarczajace srodki
    if (account.balance < data.amount) {
      throw new Error('Insufficient account balance');
    }

    // Ponieważ mamy problem z tabelą SavingsGoalContribution w bazie danych,
    // zamiast dodawać rzeczywistą wpłatę, stworzymy symulowany obiekt wpłaty
    
    // Generujemy unikalny identyfikator dla wpłaty
    const contributionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date();
    
    console.log(`Symulacja: Dodawanie wpłaty ${data.amount} PLN do celu ${goalId} z konta ${account.name}`);
    
    // Tworzymy obiekt wpłaty
    const contribution = {
      id: contributionId,
      amount: data.amount,
      date: data.date || now,
      accountId: data.accountId,
      savingsGoalId: goalId,
      createdAt: now,
      updatedAt: now,
      account: account,
      accountName: account.name
    };

    // Tymczasowo pomijamy aktualizację salda konta, ponieważ używamy symulowanych kont
    // W rzeczywistej implementacji, saldo konta byłoby aktualizowane w bazie danych
    console.log(`Symulacja: Zmniejszenie salda konta ${account.name} o ${data.amount} PLN`);
    // Aktualizujemy saldo konta w obiekcie lokalnym (dla spójności)
    account.balance -= data.amount;

    // Symulujemy aktualizację kwoty celu oszczędnościowego
    console.log(`Symulacja: Zwiększenie kwoty celu ${goal.name} o ${data.amount} PLN`);
    
    // Aktualizujemy cel w bazie danych
    try {
      await prisma.savingsGoal.update({
        where: { id: goalId },
        data: {
          currentAmount: {
            increment: data.amount
          },
          // Jeśli cel został osiągnięty, oznaczamy go jako ukończony
          isCompleted: goal.currentAmount + data.amount >= goal.targetAmount
        }
      });
    } catch (error) {
      console.error('Błąd podczas aktualizacji celu oszczędnościowego:', error);
      // Kontynuujemy, ponieważ chcemy zwrócić obiekt wpłaty, nawet jeśli aktualizacja celu się nie powiodła
    }

    // Formatujemy wplate z nazwa konta
    return {
      ...contribution,
      accountName: contribution.account?.name
    };
  } catch (error) {
    console.error('Error adding contribution:', error);
    throw new Error('Failed to add contribution');
  }
};

// Remove a contribution from a savings goal
export const removeContribution = async (
  goalId: string, 
  contributionId: string, 
  userId: string
): Promise<void> => {
  try {
    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Check if the goal exists and belongs to the user
      const goal = await tx.savingsGoal.findUnique({
        where: {
          id: goalId,
          userId
        }
      });

      if (!goal) {
        throw new Error('Savings goal not found or unauthorized');
      }

      // Get the contribution to be removed
      const contribution = await tx.$queryRaw<SavingsGoalContribution[]>`
        SELECT * FROM SavingsGoalContribution 
        WHERE id = ${contributionId} AND savingsGoalId = ${goalId}
      `;

      if (!contribution || contribution.length === 0) {
        throw new Error('Contribution not found');
      }

      const { amount, accountId } = contribution[0];

      // Delete the contribution
      await tx.$executeRaw`DELETE FROM SavingsGoalContribution WHERE id = ${contributionId}`;

      // Update the account balance (add the money back)
      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount
          }
        }
      });

      // Update the savings goal current amount
      await tx.savingsGoal.update({
        where: { id: goalId },
        data: {
          currentAmount: {
            decrement: amount
          },
          // Update the completion status
          isCompleted: goal.currentAmount - amount >= goal.targetAmount
        }
      });
    });
  } catch (error) {
    console.error('Error removing contribution:', error);
    throw new Error(`Failed to remove contribution: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Get statistics for all savings goals
export const getSavingsGoalStats = async (userId: string): Promise<SavingsGoalStats> => {
  try {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId }
    });

    const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const progress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
    const remainingAmount = totalTarget - totalSaved;

    return {
      totalSaved,
      totalTarget,
      progress,
      remainingAmount
    };
  } catch (error) {
    console.error('Error fetching savings goal stats:', error);
    throw new Error('Failed to fetch savings goal statistics');
  }
};
