import { NextRequest, NextResponse } from 'next/server';
import * as savingsGoalService from '@/services/savingsGoalService';

// GET /api/savings-goals
// Get all savings goals for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const isCompleted = searchParams.get('isCompleted');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Build filter
    const filter: { isCompleted?: boolean } = {};
    if (isCompleted !== null) {
      filter.isCompleted = isCompleted === 'true';
    }

    // Get savings goals
    const savingsGoals = await savingsGoalService.getSavingsGoals(userId, filter);
    
    return NextResponse.json(savingsGoals);
  } catch (error) {
    console.error('Error in GET /api/savings-goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch savings goals' },
      { status: 500 }
    );
  }
}

// POST /api/savings-goals
// Create a new savings goal
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    if (!body.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Validate required fields
    if (!body.name || !body.targetAmount || !body.startDate || !body.targetDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the savings goal
    const savingsGoal = await savingsGoalService.createSavingsGoal(
      {
        name: body.name,
        targetAmount: parseFloat(body.targetAmount),
        startDate: new Date(body.startDate),
        targetDate: new Date(body.targetDate),
        icon: body.icon,
        color: body.color
      },
      body.userId
    );

    return NextResponse.json(savingsGoal, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/savings-goals:', error);
    return NextResponse.json(
      { error: 'Failed to create savings goal' },
      { status: 500 }
    );
  }
}


