import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// GET /api/budgets/[id]/items/[itemId] - Get a specific budget item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    // W Next.js 14+ parametry dynamicznych tras powinny być oczekiwane przed użyciem
    const { id, itemId } = await Promise.resolve(params);

    // Check if budget exists
    const budget = await prisma.budget.findUnique({
      where: { id }
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // Get budget item
    const budgetItem = await prisma.budgetItem.findUnique({
      where: { id: itemId },
      include: {
        category: true
      }
    });

    if (!budgetItem || budgetItem.budgetId !== id) {
      return NextResponse.json({ error: 'Budget item not found' }, { status: 404 });
    }

    return NextResponse.json(budgetItem);
  } catch (error) {
    console.error('Error fetching budget item:', error);
    return NextResponse.json({ error: 'Failed to fetch budget item' }, { status: 500 });
  }
}

// PUT /api/budgets/[id]/items/[itemId] - Update a budget item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    // W Next.js 14+ parametry dynamicznych tras powinny być oczekiwane przed użyciem
    const { id, itemId } = await Promise.resolve(params);
    const body = await request.json();
    const { allocatedAmount, categoryId } = body;

    // Check if budget exists
    const budget = await prisma.budget.findUnique({
      where: { id }
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // Check if budget item exists
    const existingBudgetItem = await prisma.budgetItem.findUnique({
      where: { id: itemId }
    });

    if (!existingBudgetItem || existingBudgetItem.budgetId !== id) {
      return NextResponse.json({ error: 'Budget item not found' }, { status: 404 });
    }

    // If changing category, check if it exists and if there's already a budget item for that category
    if (categoryId && categoryId !== existingBudgetItem.categoryId) {
      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      // Check if a budget item already exists for this category in this budget
      const duplicateBudgetItem = await prisma.budgetItem.findFirst({
        where: {
          budgetId: id,
          categoryId,
          id: { not: itemId } // Exclude the current item
        }
      });

      if (duplicateBudgetItem) {
        return NextResponse.json(
          { error: 'A budget item for this category already exists in this budget' },
          { status: 400 }
        );
      }
    }

    // Update budget item
    const updatedBudgetItem = await prisma.budgetItem.update({
      where: { id: itemId },
      data: {
        allocatedAmount: allocatedAmount !== undefined ? allocatedAmount : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(updatedBudgetItem);
  } catch (error) {
    console.error('Error updating budget item:', error);
    return NextResponse.json({ error: 'Failed to update budget item' }, { status: 500 });
  }
}

// DELETE /api/budgets/[id]/items/[itemId] - Delete a budget item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    // W Next.js 14+ parametry dynamicznych tras powinny być oczekiwane przed użyciem
    const { id, itemId } = await Promise.resolve(params);

    // Check if budget exists
    const budget = await prisma.budget.findUnique({
      where: { id }
    });

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // Check if budget item exists
    const existingBudgetItem = await prisma.budgetItem.findUnique({
      where: { id: itemId }
    });

    if (!existingBudgetItem || existingBudgetItem.budgetId !== id) {
      return NextResponse.json({ error: 'Budget item not found' }, { status: 404 });
    }

    // Delete the budget item
    await prisma.budgetItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget item:', error);
    return NextResponse.json({ error: 'Failed to delete budget item' }, { status: 500 });
  }
}
