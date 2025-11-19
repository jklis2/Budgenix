import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { registerOrUpdateDevice } from "@/lib/deviceManager";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  
  // Check if account is locked due to too many failed attempts
  if (user.failedAttempts >= 5 && user.lastFailedAttempt) {
    const lockTime = 15 * 60 * 1000; // 15 minutes in milliseconds
    const lockExpiry = new Date(user.lastFailedAttempt.getTime() + lockTime);
    const now = new Date();
    
    if (now < lockExpiry) {
      const remainingMinutes = Math.ceil((lockExpiry.getTime() - now.getTime()) / 60000);
      return NextResponse.json({ 
        error: `Account temporarily locked. Try again in ${remainingMinutes} minutes.` 
      }, { status: 429 });
    } else {
      // Reset failed attempts if lock period has expired
      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: 0, lastFailedAttempt: null }
      });
    }
  }

  // Verify 2FA code
  if (!user.twoFACode || user.twoFACode !== code || !user.twoFAExpiry || user.twoFAExpiry < new Date()) {
    // Increment failed attempts counter
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        failedAttempts: user.failedAttempts + 1,
        lastFailedAttempt: new Date()
      }
    });
    
    return NextResponse.json({ error: "Invalid or expired 2FA code" }, { status: 401 });
  }

  // Reset failed attempts on successful verification
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      failedAttempts: 0,
      lastFailedAttempt: null,
      twoFACode: null, 
      twoFAExpiry: null 
    }
  });

  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email 
    }, 
    process.env.JWT_SECRET!, 
    { expiresIn: "30d" }
  );

  // Register or update device
  await registerOrUpdateDevice(user.id, req);

  return NextResponse.json({ token, message: "Logged in successfully" });
}
