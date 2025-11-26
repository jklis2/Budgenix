import { NextRequest, NextResponse } from 'next/server';
import * as savingsGoalService from '@/services/savingsGoalService';
import { getUserFromToken } from '@/lib/auth-helpers';

// GET /api/savings-goals
// Get all savings goals for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = user.id;
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const isCompleted = searchParams.get('isCompleted');

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
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const body = await request.json();
    const userId = user.id;
    
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
      userId
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


