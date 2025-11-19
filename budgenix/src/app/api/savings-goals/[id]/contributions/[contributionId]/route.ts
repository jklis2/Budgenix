import { NextRequest, NextResponse } from 'next/server';
import * as savingsGoalService from '@/services/savingsGoalService';

// DELETE /api/savings-goals/[id]/contributions/[contributionId]
// Remove a contribution from a savings goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; contributionId: string }> }
) {
  // W Next.js App Router, musimy użyć await Promise.resolve() dla params
  // Jest to zalecane rozwiązanie dla najnowszych wersji Next.js
  const resolvedParams = await params;
  const goalId = resolvedParams.id;
  const contributionId = resolvedParams.contributionId;
  
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Remove the contribution
    await savingsGoalService.removeContribution(
      goalId,
      contributionId,
      userId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/savings-goals/${goalId}/contributions/${contributionId}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove contribution' },
      { status: 500 }
    );
  }
}
