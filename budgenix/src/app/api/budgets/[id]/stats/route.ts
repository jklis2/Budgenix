import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// GET /api/budgets/[id]/stats - Get statistics for a specific budget
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // W Next.js 14+ parametry dynamicznych tras powinny być oczekiwane przed użyciem
    const { id } = await Promise.resolve(params);

    // Check if budget exists
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        budgetItems: {
          include: {
            category: true
          }
        }
      }
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // POPRAWKA: Pobieramy transakcje z BIEŻĄCEGO MIESIĄCA zamiast okresu budżetu dla spójności
    const now = new Date();
    // Ustawiamy godzinę na początek dnia (00:00:00) aby uniknąć problemów ze strefą czasową
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    // Ustawiamy godzinę na koniec dnia (23:59:59) aby uwzględnić cały ostatni dzień
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Get all transactions within the CURRENT MONTH for this user
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: budget.userId,
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        },
        category: {
          isIncome: false // Only include expenses
        }
      },
      include: {
        category: true
      }
    });

    // Calculate spent amount per category - UŻYWAMY Math.abs() dla spójności
    const categorySpending: Record<string, number> = {};
    transactions.forEach(transaction => {
      const categoryId = transaction.categoryId;
      if (!categorySpending[categoryId]) {
        categorySpending[categoryId] = 0;
      }
      // Zawsze używamy wartości bezwzględnej
      categorySpending[categoryId] += Math.abs(transaction.amount);
    });

    // Calculate total spent and remaining amounts - UŻYWAMY Math.abs() dla spójności
    const totalSpent = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const remainingAmount = budget.totalAmount - totalSpent;
    const spentPercentage = Math.round((totalSpent / budget.totalAmount) * 100);

    // Prepare category statistics
    const categoryStats = budget.budgetItems.map(item => {
      const spent = categorySpending[item.categoryId] || 0;
      const percentage = item.allocatedAmount > 0 
        ? Math.round((spent / item.allocatedAmount) * 100) 
        : 0;
      
      return {
        id: item.id,
        categoryId: item.categoryId,
        name: item.category.name,
        color: item.category.color,
        allocated: item.allocatedAmount,
        spent,
        remaining: item.allocatedAmount - spent,
        percentage
      };
    });

    // Prepare budget summary - POPRAWKA: Pokazujemy bieżący miesiąc
    const currentMonth = now.toLocaleString('pl-PL', { month: 'long', year: 'numeric' });

    const stats = {
      summary: {
        currentMonth,
        totalBudget: budget.totalAmount,
        spentAmount: totalSpent,
        remainingAmount,
        spentPercentage
      },
      categories: categoryStats
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching budget statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch budget statistics' }, { status: 500 });
  }
}
