import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sendTwoFactorEmail } from "@/lib/sendEmail";

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

    // Get the user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate 2FA code
    const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFAExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min validity

    // Save the code to the database
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        twoFACode, 
        twoFAExpiry 
      }
    });

    // Send verification code via email
    await sendTwoFactorEmail(user.email, twoFACode);

    return NextResponse.json({ 
      message: "Verification code sent to your email" 
    });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    return NextResponse.json({ 
      error: "An error occurred while enabling 2FA" 
    }, { status: 500 });
  }
}
