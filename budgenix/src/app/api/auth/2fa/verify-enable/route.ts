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

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify 2FA code
    if (!user.twoFACode || user.twoFACode !== code || !user.twoFAExpiry || user.twoFAExpiry < new Date()) {
      return NextResponse.json({ 
        error: "Invalid or expired verification code" 
      }, { status: 401 });
    }

    // Enable 2FA and clear the code
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        twoFactorEnabled: true,
        twoFACode: null,
        twoFAExpiry: null
      }
    });

    return NextResponse.json({ 
      message: "Two-factor authentication enabled successfully",
      twoFactorEnabled: true
    });
  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    return NextResponse.json({ 
      error: "An error occurred while verifying the code" 
    }, { status: 500 });
  }
}
