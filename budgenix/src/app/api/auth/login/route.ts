import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendTwoFactorEmail } from "@/lib/sendEmail";
import { registerOrUpdateDevice } from "@/lib/deviceManager";

export async function POST(req: Request) {
  const { email, password, rememberMe } = await req.json();

  const user = await prisma.user.findUnique({ 
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      isActive: true,
      failedAttempts: true,
      lastFailedAttempt: true,
      twoFactorEnabled: true
    }
  });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  
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

  // Check if account is active
  if (!user.isActive) return NextResponse.json({ error: "Account not activated" }, { status: 401 });

  const validPassword = await compare(password, user.password);
  if (!validPassword) {
    // Increment failed attempts counter
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        failedAttempts: user.failedAttempts + 1,
        lastFailedAttempt: new Date()
      }
    });
    
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Reset failed attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      failedAttempts: 0,
      lastFailedAttempt: null,
      rememberMe: rememberMe // Update rememberMe field in database
    }
  });

  // Generowanie kodu 2FA jeśli 2FA jest włączone i opcja "Remember Me" nie jest zaznaczona
  if (!rememberMe && user.twoFactorEnabled) {
    const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFAExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min ważności

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFACode, twoFAExpiry }
    });

    await sendTwoFactorEmail(user.email, twoFACode);

    return NextResponse.json({ message: "2FA code sent to email" });
  }

  // Jeśli "Remember Me" jest zaznaczone, logowanie bez 2FA
  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email // Include email in the token payload
    }, 
    process.env.JWT_SECRET!, 
    { expiresIn: "30d" }
  );

  // Register or update device
  await registerOrUpdateDevice(user.id, req);

  return NextResponse.json({ token, message: "Logged in successfully" });
}
