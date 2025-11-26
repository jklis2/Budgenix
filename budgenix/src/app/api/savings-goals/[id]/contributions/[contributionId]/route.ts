import { NextRequest, NextResponse } from 'next/server';
import * as savingsGoalService from '@/services/savingsGoalService';
import { getUserFromToken } from '@/lib/auth-helpers';

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
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = user.id;
    
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
