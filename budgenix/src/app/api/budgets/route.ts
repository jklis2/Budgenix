import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// GET /api/budgets - Get all budgets with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('isActive');
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const filters: { userId: string; isActive?: boolean } = { userId };

    // Add isActive filter if provided
    if (isActive !== null) {
      filters.isActive = isActive === 'true';
    }

    const budgets = await prisma.budget.findMany({
      where: filters,
      orderBy: { startDate: 'desc' },
      include: {
        budgetItems: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, totalAmount, userId, budgetItems }: {
      name: string;
      startDate: string;
      endDate: string;
      totalAmount: number;
      userId: string;
      budgetItems?: Array<{ allocatedAmount: number; categoryId: string }>;
    } = body;

    // Validate required fields
    if (!name || !startDate || !endDate || !totalAmount || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, startDate, endDate, totalAmount, userId' },
        { status: 400 }
      );
    }

    // Create budget
    const budget = await prisma.budget.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalAmount,
        userId,
        isActive: true
      }
    });

    // Create budget items
    let budgetItemsData: Array<{
      allocatedAmount: number;
      budgetId: string;
      categoryId: string;
    }> = [];
    
    // If budget items are provided, use them
    if (budgetItems && Array.isArray(budgetItems) && budgetItems.length > 0) {
      budgetItemsData = budgetItems.map((item: { allocatedAmount: number; categoryId: string }) => ({
        allocatedAmount: item.allocatedAmount,
        budgetId: budget.id,
        categoryId: item.categoryId
      }));
    } 
    // Otherwise, create budget items for all user's expense categories
    else {
      // Get all user's expense categories
      const categories = await prisma.category.findMany({
        where: {
          userId,
          isIncome: false // Only include expense categories
        }
      });
      
      // If user has categories, create budget items for each
      if (categories.length > 0) {
        const defaultAllocation = 1000; // Default allocation per category
        budgetItemsData = categories.map(category => ({
          allocatedAmount: defaultAllocation,
          budgetId: budget.id,
          categoryId: category.id
        }));
      }
    }
    
    // Create budget items if we have any
    if (budgetItemsData.length > 0) {
      await prisma.budgetItem.createMany({
        data: budgetItemsData
      });
    }

    // Return the created budget with its items
    const createdBudget = await prisma.budget.findUnique({
      where: { id: budget.id },
      include: {
        budgetItems: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json(createdBudget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
