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
      return NextResponse.json({ error: "Kod weryfikacyjny jest wymagany" }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the code
    if (!user.twoFACode || user.twoFACode !== code || !user.twoFAExpiry || user.twoFAExpiry < new Date()) {
      return NextResponse.json({ 
        error: "Nieprawidłowy lub wygasły kod weryfikacyjny" 
      }, { status: 401 });
    }

    // Delete all user's related data in transaction
    await prisma.$transaction(async (tx) => {
      // Delete user devices
      await tx.userDevice.deleteMany({
        where: { userId: user.id }
      });

      // Delete budget items (must be deleted before budgets and categories)
      const budgets = await tx.budget.findMany({
        where: { userId: user.id },
        select: { id: true }
      });
      
      for (const budget of budgets) {
        await tx.budgetItem.deleteMany({
          where: { budgetId: budget.id }
        });
      }

      // Delete budgets
      await tx.budget.deleteMany({
        where: { userId: user.id }
      });

      // Delete transactions
      await tx.transaction.deleteMany({
        where: { userId: user.id }
      });

      // Delete subscriptions
      await tx.subscription.deleteMany({
        where: { userId: user.id }
      });

      // Delete savings goals
      await tx.savingsGoal.deleteMany({
        where: { userId: user.id }
      });

      // Delete accounts
      await tx.account.deleteMany({
        where: { userId: user.id }
      });

      // Delete categories
      await tx.category.deleteMany({
        where: { userId: user.id }
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: user.id }
      });
    });

    return NextResponse.json({ 
      message: "Konto zostało pomyślnie usunięte",
      deleted: true
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ 
      error: "Wystąpił błąd podczas usuwania konta" 
    }, { status: 500 });
  }
}
