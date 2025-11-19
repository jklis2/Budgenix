import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Helper function to verify JWT token and get user ID
const getUserIdFromToken = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
};

// Define types to match our database schema
interface DbAccount {
  id: string;
  name: string;
  balance: number;
  accountType: string;
  currency: string;
  isDefault: number | boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DbTransaction {
  id: string;
  title: string;
  amount: number;
  date: Date;
  notes: string | null;
  paymentMethod: string | null;
  accountId: string;
}

interface AccountWithTransactions extends Omit<DbAccount, 'isDefault'> {
  isDefault: boolean;
  transactions: Omit<DbTransaction, 'accountId'>[];
}

// GET a specific account by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: accountId } = await params;
    
    // Get account with raw SQL
    const results = await prisma.$queryRaw<(DbAccount & {
      transactionId: string | null;
      title: string | null;
      amount: number | null;
      date: Date | null;
      notes: string | null;
      paymentMethod: string | null;
    })[]>`
      SELECT a.*, t.id as transactionId, t.title, t.amount, t.date, t.notes, t.paymentMethod
      FROM Account a
      LEFT JOIN [Transaction] t ON a.id = t.accountId
      WHERE a.id = ${accountId}
      ORDER BY t.date DESC
    `;

    if (!results || results.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Process the results to create a proper account object with transactions
    const accountData = results[0];
    
    // Verify that the account belongs to the authenticated user
    if (accountData.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Format the account data
    const account: AccountWithTransactions = {
      id: accountData.id,
      name: accountData.name,
      balance: accountData.balance,
      accountType: accountData.accountType,
      currency: accountData.currency,
      isDefault: Boolean(accountData.isDefault),
      userId: accountData.userId,
      createdAt: accountData.createdAt,
      updatedAt: accountData.updatedAt,
      transactions: []
    };

    // Add transactions if they exist
    if (accountData.transactionId) {
      const transactions = results
        .filter(row => row.transactionId)
        .map(row => ({
          id: row.transactionId!,
          title: row.title!,
          amount: row.amount!,
          date: row.date!,
          notes: row.notes,
          paymentMethod: row.paymentMethod
        }))
        .slice(0, 10); // Limit to 10 transactions

      account.transactions = transactions;
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

// PUT - Update an account
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: accountId } = await params;
    const { name, balance, accountType, currency, isDefault } = await request.json();

    // Validation
    if (!name || balance === undefined || !accountType) {
      return NextResponse.json(
        { error: "Missing required fields: name, balance, accountType" },
        { status: 400 }
      );
    }

    // Check if account exists and belongs to the user
    const accounts = await prisma.$queryRaw<DbAccount[]>`
      SELECT * FROM Account WHERE id = ${accountId}
    `;

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const existingAccount = accounts[0];
    if (existingAccount.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // If isDefault is true, set all other accounts to not default
    if (isDefault) {
      await prisma.$executeRaw`
        UPDATE Account
        SET isDefault = 0
        WHERE userId = ${userId} AND id <> ${accountId} AND isDefault = 1
      `;
    }

    // Update the account
    const now = new Date();
    await prisma.$executeRaw`
      UPDATE Account
      SET 
        name = ${name},
        balance = ${parseFloat(balance.toString())},
        accountType = ${accountType},
        currency = ${currency},
        isDefault = ${isDefault ? 1 : 0},
        updatedAt = ${now}
      WHERE id = ${accountId}
    `;

    // Get the updated account
    const updatedAccounts = await prisma.$queryRaw<DbAccount[]>`
      SELECT * FROM Account WHERE id = ${accountId}
    `;
    
    const updatedAccount = updatedAccounts[0];
    return NextResponse.json({
      ...updatedAccount,
      isDefault: Boolean(updatedAccount.isDefault)
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: accountId } = await params;

    // Check if account exists and belongs to the user
    const accounts = await prisma.$queryRaw<DbAccount[]>`
      SELECT * FROM Account WHERE id = ${accountId}
    `;

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const existingAccount = accounts[0];
    if (existingAccount.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if account has transactions
    const transactions = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*) as count FROM [Transaction] WHERE accountId = ${accountId}
    `;
    
    const transactionCount = transactions[0].count;
    if (transactionCount > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete account with transactions", 
          count: transactionCount 
        }, 
        { status: 400 }
      );
    }

    // Delete the account
    await prisma.$executeRaw`
      DELETE FROM Account WHERE id = ${accountId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
