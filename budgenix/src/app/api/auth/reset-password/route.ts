import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/sendEmail";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const resetToken = uuidv4();
  await prisma.user.update({
    where: { id: user.id },
    data: { activationToken: resetToken },
  });

  await sendPasswordResetEmail(email, resetToken);

  return NextResponse.json({ message: "Reset link sent" });
}
