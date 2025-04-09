import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// GET /api/budgets/[id]/items - Get all items for a specific budget
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // W Next.js 14+ parametry dynamicznych tras powinny być oczekiwane przed użyciem
    const { id } = await Promise.resolve(params);

    // Check if budget exists
    const budget = await prisma.budget.findUnique({
      where: { id }
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // Get budget items
    const budgetItems = await prisma.budgetItem.findMany({
      where: { budgetId: id },
      include: {
        category: true
      }
    });

    return NextResponse.json(budgetItems);
  } catch (error) {
    console.error('Error fetching budget items:', error);
    return NextResponse.json({ error: 'Failed to fetch budget items' }, { status: 500 });
  }
}

// POST /api/budgets/[id]/items - Create a new budget item
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // W Next.js 14+ parametry dynamicznych tras powinny być oczekiwane przed użyciem
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const { allocatedAmount, categoryId }: {
      allocatedAmount: number;
      categoryId: string;
    } = body;

    // Validate required fields
    if (!allocatedAmount || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: allocatedAmount, categoryId' },
        { status: 400 }
      );
    }

    // Check if budget exists
    const budget = await prisma.budget.findUnique({
      where: { id }
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if a budget item already exists for this category in this budget
    const existingBudgetItem = await prisma.budgetItem.findFirst({
      where: {
        budgetId: id,
        categoryId
      }
    });

    if (existingBudgetItem) {
      return NextResponse.json(
        { error: 'A budget item for this category already exists in this budget' },
        { status: 400 }
      );
    }

    // Create budget item
    const budgetItem = await prisma.budgetItem.create({
      data: {
        allocatedAmount,
        budgetId: id,
        categoryId
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(budgetItem, { status: 201 });
  } catch (error) {
    console.error('Error creating budget item:', error);
    return NextResponse.json({ error: 'Failed to create budget item' }, { status: 500 });
  }
}
