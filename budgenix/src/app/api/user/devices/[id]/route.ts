import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth-helpers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: deviceId } = await params;

    // Check if device exists and belongs to user
    const device = await prisma.userDevice.findUnique({
      where: { id: deviceId }
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    if (device.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the device
    await prisma.userDevice.delete({
      where: { id: deviceId }
    });

    return NextResponse.json({ 
      message: "Device removed successfully" 
    });
  } catch (error) {
    console.error("Error deleting device:", error);
    return NextResponse.json({ 
      error: "An error occurred while deleting device" 
    }, { status: 500 });
  }
}
