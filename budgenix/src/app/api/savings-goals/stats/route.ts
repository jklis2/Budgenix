import { NextRequest, NextResponse } from 'next/server';
import * as savingsGoalService from '@/services/savingsGoalService';

// GET /api/savings-goals/stats
// Get statistics for all savings goals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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
