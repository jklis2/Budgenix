import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// GET /api/budgets/[id] - Get a specific budget
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // W Next.js 14+ parametry dynamicznych tras powinny być oczekiwane przed użyciem
    const { id } = await params;

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

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

// PUT /api/budgets/[id] - Update a budget
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // W Next.js 14+ parametry dynamicznych tras powinny być oczekiwane przed użyciem
    const { id } = await params;
    const body = await request.json();
    const { name, startDate, endDate, totalAmount, isActive }: {
      name?: string;
      startDate?: string;
      endDate?: string;
      totalAmount?: number;
      isActive?: boolean;
    } = body;

    // Check if budget exists
    const existingBudget = await prisma.budget.findUnique({
      where: { id }
    });

    if (!existingBudget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // Update budget
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        startDate: startDate !== undefined ? new Date(startDate) : undefined,
        endDate: endDate !== undefined ? new Date(endDate) : undefined,
        totalAmount: totalAmount !== undefined ? totalAmount : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      include: {
        budgetItems: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

// DELETE /api/budgets/[id] - Delete a budget
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // W Next.js 14+ parametry dynamicznych tras powinny być oczekiwane przed użyciem
    const { id } = await params;

    // Check if budget exists
    const existingBudget = await prisma.budget.findUnique({
      where: { id }
    });

    if (!existingBudget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // Delete all budget items first
    await prisma.budgetItem.deleteMany({
      where: { budgetId: id }
    });

    // Delete the budget
    await prisma.budget.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
}
