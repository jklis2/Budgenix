import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: Request) {
  const { email, password, rememberMe } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const validPassword = await compare(password, user.password);
  if (!validPassword) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // Generowanie kodu 2FA jeśli opcja "Remember Me" nie jest zaznaczona
  if (!rememberMe) {
    const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFAExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min ważności

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFACode, twoFAExpiry }
    });

    await sendEmail(user.email, "Your 2FA Code", `Your verification code is: ${twoFACode}`);

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

  return NextResponse.json({ token, message: "Logged in successfully" });
}
