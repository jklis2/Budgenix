import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { token } = await req.json();

  // Znalezienie użytkownika po tokenie aktywacyjnym
  const user = await prisma.user.findFirst({
    where: { activationToken: token },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  // Aktywacja konta użytkownika
  await prisma.user.update({
    where: { id: user.id },
    data: { isActive: true, activationToken: null },
  });

  return NextResponse.json({ message: "Account activated" });
}
