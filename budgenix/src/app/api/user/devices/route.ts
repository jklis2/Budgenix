import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all devices for the user
    const devices = await prisma.userDevice.findMany({
      where: { userId: user.id },
      orderBy: { lastActiveAt: 'desc' }
    });

    return NextResponse.json({ devices });
  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json({ 
      error: "An error occurred while fetching devices" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { deviceName, browser, ipAddress } = await req.json();

    // Validate input
    if (!deviceName || !browser) {
      return NextResponse.json({ 
        error: "Device name and browser are required" 
      }, { status: 400 });
    }

    // Create or update device
    const device = await prisma.userDevice.create({
      data: {
        userId: user.id,
        deviceName,
        browser,
        ipAddress: ipAddress || null
      }
    });

    return NextResponse.json({ device });
  } catch (error) {
    console.error("Error creating device:", error);
    return NextResponse.json({ 
      error: "An error occurred while creating device" 
    }, { status: 500 });
  }
}
