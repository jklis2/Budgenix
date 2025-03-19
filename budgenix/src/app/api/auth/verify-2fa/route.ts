import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.twoFACode || user.twoFACode !== code || user.twoFAExpiry! < new Date()) {
    return NextResponse.json({ error: "Invalid or expired 2FA code" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFACode: null, twoFAExpiry: null }
  });

  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email 
    }, 
    process.env.JWT_SECRET!, 
    { expiresIn: "30d" }
  );

  return NextResponse.json({ token, message: "Logged in successfully" });
}
