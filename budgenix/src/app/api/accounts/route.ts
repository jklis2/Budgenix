import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Helper function to verify JWT token and get user ID
const getUserIdFromToken = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No valid authorization header found");
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email: string };
    console.log("Token decoded successfully, user ID:", decoded.id, "email:", decoded.email);
    return { id: decoded.id, email: decoded.email };
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

// GET all accounts for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userInfo = getUserIdFromToken(request);
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First try to find user by ID
    let user = await prisma.user.findUnique({
      where: { id: userInfo.id }
    });

    // If not found, try to find by email
    if (!user && userInfo.email) {
      console.log(`User with ID ${userInfo.id} not found, trying to find by email ${userInfo.email}`);
      user = await prisma.user.findUnique({
        where: { email: userInfo.email }
      });
    }

    if (!user) {
      console.log(`User with ID ${userInfo.id} and email ${userInfo.email} not found in the database`);
      return NextResponse.json(
        { error: "User not found. Please log in again." },
        { status: 404 }
      );
    }

    console.log("User found:", user.id);

    // Use the correct model name from Prisma
    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: `Failed to fetch accounts: ${error}` },
      { status: 500 }
    );
  }
}

// POST - Create a new account
export async function POST(request: NextRequest) {
  try {
    const userInfo = getUserIdFromToken(request);
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Attempting to create account for user ID:", userInfo.id, "email:", userInfo.email);

    // First try to find user by ID
    let user = await prisma.user.findUnique({
      where: { id: userInfo.id }
    });

    // If not found, try to find by email
    if (!user && userInfo.email) {
      console.log(`User with ID ${userInfo.id} not found, trying to find by email ${userInfo.email}`);
      user = await prisma.user.findUnique({
        where: { email: userInfo.email }
      });
    }
    
    if (!user) {
      console.log(`User with ID ${userInfo.id} and email ${userInfo.email} not found in the database`);
      return NextResponse.json(
        { error: "User not found. Please log in again." },
        { status: 404 }
      );
    }

    console.log("User found:", user.id);

    const { name, balance, accountType, currency, isDefault } = await request.json();
    console.log("Account data:", { name, balance, accountType, currency, isDefault });

    // Validation
    if (!name || balance === undefined || !accountType) {
      return NextResponse.json(
        { error: "Missing required fields: name, balance, accountType" },
        { status: 400 }
      );
    }

    // Validate balance is not negative when creating
    if (balance < 0 && accountType !== "Credit Card") {
      return NextResponse.json(
        { error: "Balance cannot be negative for non-credit card accounts" },
        { status: 400 }
      );
    }

    // If isDefault is true, update other accounts
    if (isDefault) {
      await prisma.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    try {
      // Create new account using Prisma client
      const newAccount = await prisma.account.create({
        data: {
          name,
          balance: parseFloat(balance.toString()),
          accountType,
          currency: currency || "PLN",
          isDefault: Boolean(isDefault),
          userId: user.id // Use the user ID from the database, not from the token
        }
      });

      console.log("Account created successfully:", newAccount);
      return NextResponse.json(newAccount, { status: 201 });
    } catch (error) {
      console.error("Error creating account with Prisma:", error);
      
      // Check if it's a foreign key constraint error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003' || error.code === 'P2025') {
          return NextResponse.json(
            { error: "Foreign key constraint failed. User may not exist." },
            { status: 400 }
          );
        }
      }
      
      throw error; // Re-throw for general error handling
    }
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: `Failed to create account: ${error}` },
      { status: 500 }
    );
  }
}
