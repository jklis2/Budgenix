import { NextRequest, NextResponse } from 'next/server';
import * as savingsGoalService from '@/services/savingsGoalService';

// POST /api/savings-goals/[id]/contributions
// Add a contribution to a savings goal
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // W Next.js App Router, musimy użyć await Promise.resolve() dla params
  // Jest to zalecane rozwiązanie dla najnowszych wersji Next.js
  const resolvedParams = await Promise.resolve(params);
  const goalId = resolvedParams.id;
  
  try {
    // Parse the request body
    const body = await request.json();
    
    if (!body.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Validate required fields
    if (!body.amount || !body.accountId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the contribution
    const contribution = await savingsGoalService.addContribution(
      goalId,
      {
        amount: parseFloat(body.amount),
        accountId: body.accountId,
        date: body.date ? new Date(body.date) : undefined
      },
      body.userId
    );

    return NextResponse.json(contribution, { status: 201 });
  } catch (error) {
    console.error(`Error in POST /api/savings-goals/${goalId}/contributions:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add contribution' },
      { status: 500 }
    );
  }
}
