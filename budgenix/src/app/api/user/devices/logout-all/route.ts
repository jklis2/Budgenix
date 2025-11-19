import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
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

    // Delete all devices for the user
    await prisma.userDevice.deleteMany({
      where: { userId: decoded.id }
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
