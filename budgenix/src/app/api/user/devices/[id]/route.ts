import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id: deviceId } = await params;

    // Check if device exists and belongs to user
    const device = await prisma.userDevice.findUnique({
      where: { id: deviceId }
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    if (device.userId !== decoded.id) {
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
