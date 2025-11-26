import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all devices for the user
    await prisma.userDevice.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ 
      message: "All devices logged out successfully" 
    });
  } catch (error) {
    console.error("Error logging out all devices:", error);
    return NextResponse.json({ 
      error: "An error occurred while logging out all devices" 
    }, { status: 500 });
  }
}
