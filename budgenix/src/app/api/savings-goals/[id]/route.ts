import { NextRequest, NextResponse } from 'next/server';
import * as savingsGoalService from '@/services/savingsGoalService';
import { UpdateSavingsGoalDto } from '@/services/savingsGoalService';

// GET /api/savings-goals/[id]
// Get a single savings goal by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get the savings goal
    const savingsGoal = await savingsGoalService.getSavingsGoal(params.id, userId);
    
    if (!savingsGoal) {
      return NextResponse.json({ error: 'Savings goal not found' }, { status: 404 });
    }
    
    return NextResponse.json(savingsGoal);
  } catch (error) {
    console.error(`Error in GET /api/savings-goals/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch savings goal' },
      { status: 500 }
    );
  }
}

// PUT /api/savings-goals/[id]
// Update a savings goal
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Parse the request body
    const body = await request.json();
    
    if (!body.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prepare update data
    const updateData: UpdateSavingsGoalDto = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.targetAmount !== undefined) updateData.targetAmount = parseFloat(body.targetAmount);
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.targetDate !== undefined) updateData.targetDate = new Date(body.targetDate);
    if (body.isCompleted !== undefined) updateData.isCompleted = body.isCompleted;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.color !== undefined) updateData.color = body.color;

    // Update the savings goal
    const updatedGoal = await savingsGoalService.updateSavingsGoal(
      params.id,
      updateData,
      body.userId
    );

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error(`Error in PUT /api/savings-goals/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update savings goal' },
      { status: 500 }
    );
  }
}

// DELETE /api/savings-goals/[id]
// Delete a savings goal
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete the savings goal
    await savingsGoalService.deleteSavingsGoal(params.id, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/savings-goals/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete savings goal' },
      { status: 500 }
    );
  }
}
