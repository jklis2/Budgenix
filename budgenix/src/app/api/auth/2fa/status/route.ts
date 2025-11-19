import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
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

    // Get the user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: {
        twoFactorEnabled: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      twoFactorEnabled: user.twoFactorEnabled || false
    });
  } catch (error) {
    console.error("Error getting 2FA status:", error);
    return NextResponse.json({ 
      error: "An error occurred while getting 2FA status" 
    }, { status: 500 });
  }
}
