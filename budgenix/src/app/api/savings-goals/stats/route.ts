import { NextRequest, NextResponse } from 'next/server';
import * as savingsGoalService from '@/services/savingsGoalService';
import { getUserFromToken } from '@/lib/auth-helpers';

// GET /api/savings-goals/stats
// Get statistics for all savings goals
export async function GET(request: NextRequest) {
  try {
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = user.id;

    // Get savings goal stats
    const stats = await savingsGoalService.getSavingsGoalStats(userId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in GET /api/savings-goals/stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch savings goal statistics' },
      { status: 500 }
    );
  }
}
