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

// GET all subscriptions for the authenticated user
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

    // Fetch all subscriptions for the user with category details
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      include: {
        category: true
      },
      orderBy: [
        { nextBillingDate: 'asc' }
      ]
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: `Failed to fetch subscriptions: ${error}` },
      { status: 500 }
    );
  }
}

// POST - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const userInfo = getUserIdFromToken(request);
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Attempting to create subscription for user ID:", userInfo.id, "email:", userInfo.email);

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

    const data = await request.json();
    const { name, amount, cycle, nextPayment, category, logo, color, active, accountId } = data;
    console.log("Subscription data:", data);

    // Validation
    if (!name || amount === undefined || !cycle || !nextPayment) {
      console.error("Missing required fields:", { name, amount, cycle, nextPayment });
      return NextResponse.json(
        { error: "Missing required fields: name, amount, cycle, nextPayment" },
        { status: 400 }
      );
    }

    // Find the category by name if provided
    let categoryId = null;
    if (category) {
      const categoryObj = await prisma.category.findFirst({
        where: {
          userId: user.id,
          name: category
        }
      });
      
      if (categoryObj) {
        categoryId = categoryObj.id;
      }
    }

    try {
      // Create new subscription using Prisma client
      console.log("Creating subscription with data:", {
        name,
        amount: parseFloat(amount.toString()),
        billingCycle: cycle,
        startDate: new Date(),
        nextBillingDate: new Date(nextPayment),
        categoryId,
        userId: user.id
      });
      
      const newSubscription = await prisma.subscription.create({
        data: {
          name,
          amount: parseFloat(amount.toString()),
          billingCycle: cycle,
          startDate: new Date(),
          nextBillingDate: new Date(nextPayment),
          categoryId,
          userId: user.id
        },
        include: {
          category: true
        }
      });

      // If accountId is provided, we could store it in a separate table or add a field to the subscription model
      // For now, we'll just return it with the response

      console.log("Subscription created successfully:", newSubscription);
      
      // Add UI-specific fields to match the frontend model
      const responseData = {
        ...newSubscription,
        logo: logo || "🔔",
        color: color || "blue",
        active: active !== undefined ? active : true,
        accountId: accountId || null
      };
      
      return NextResponse.json(responseData, { status: 201 });
    } catch (error) {
      console.error("Error creating subscription with Prisma:", error);
      
      // Check if it's a foreign key constraint error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003' || error.code === 'P2025') {
          return NextResponse.json(
            { error: "Foreign key constraint failed. User or category may not exist." },
            { status: 400 }
          );
        }
      }
      
      throw error; // Re-throw for general error handling
    }
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: `Failed to create subscription: ${error}` },
      { status: 500 }
    );
  }
}