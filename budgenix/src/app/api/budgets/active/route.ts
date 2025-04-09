import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// Funkcja do obsługi aktywnego budżetu dla danego użytkownika
async function handleActiveBudget(userId: string) {
  // Try to find an active budget
  let activeBudget = await prisma.budget.findFirst({
    where: {
      userId,
      isActive: true,
      endDate: {
        gte: new Date()
      }
    },
    include: {
      budgetItems: {
        include: {
          category: true
        }
      }
    },
    orderBy: {
      startDate: 'desc'
    }
  });
  
  // Logowanie dla celów diagnostycznych
  console.log(`Szukanie aktywnego budżetu dla użytkownika ${userId}:`, activeBudget ? 'Znaleziono' : 'Nie znaleziono');

  // If no active budget exists, create one
  if (!activeBudget) {
    // Get all user categories
    const categories = await prisma.category.findMany({
      where: {
        userId,
        isIncome: false // Only include expense categories
      }
    });

    // If no categories exist, create a default category
    if (categories.length === 0) {
      // Create a default category
      const defaultCategory = await prisma.category.create({
        data: {
          name: 'Inne wydatki',
          icon: 'tag',
          color: 'indigo',
          isIncome: false,
          isDefault: true,
          userId
        }
      });
      
      categories.push(defaultCategory);
    }

    // Calculate dates for the current month
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month

    // Create a new budget
    const newBudget = await prisma.budget.create({
      data: {
        name: `Budżet ${startDate.toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}`,
        startDate,
        endDate,
        totalAmount: 0, // Will be updated after creating budget items
        isActive: true,
        userId
      }
    });

    // Create budget items for each category with default allocation
    const defaultAllocation = 1000; // Default allocation per category
    const budgetItemsData = categories.map(category => ({
      allocatedAmount: defaultAllocation,
      budgetId: newBudget.id,
      categoryId: category.id
    }));

    await prisma.budgetItem.createMany({
      data: budgetItemsData
    });

    // Update the total budget amount
    const totalAmount = defaultAllocation * categories.length;
    await prisma.budget.update({
      where: { id: newBudget.id },
      data: { totalAmount }
    });

    // Get the newly created budget with its items
    activeBudget = await prisma.budget.findUnique({
      where: { id: newBudget.id },
      include: {
        budgetItems: {
          include: {
            category: true
          }
        }
      }
    });
  }

  return NextResponse.json(activeBudget);
}

// GET /api/budgets/active - Get the active budget or create one if it doesn't exist
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Najpierw sprawdź, czy użytkownik istnieje
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log(`Użytkownik o ID ${userId} nie istnieje w bazie danych`);
      // Sprawdź, czy istnieje jakikolwiek użytkownik (dla celów testowych)
      const testUser = await prisma.user.findFirst();
      if (testUser) {
        console.log(`Znaleziono użytkownika testowego o ID: ${testUser.id}`);
        // Użyjemy ID testowego użytkownika
        return await handleActiveBudget(testUser.id);
      } else {
        return NextResponse.json({ error: 'Użytkownik nie istnieje' }, { status: 404 });
      }
    }
    
    // Obsłuż aktywny budżet dla znalezionego użytkownika
    return await handleActiveBudget(userId);
  } catch (error) {
    console.error('Error fetching active budget:', error);
    return NextResponse.json({ error: 'Failed to fetch active budget' }, { status: 500 });
  }
}
