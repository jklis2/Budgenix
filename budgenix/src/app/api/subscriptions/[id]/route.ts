import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth-helpers";

// GET a specific subscription by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id;
    const { id: subscriptionId } = await params;

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        category: true
      }
    });

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Verify that the subscription belongs to the authenticated user
    if (subscription.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Add UI-specific fields to match the frontend model
    const responseData = {
      ...subscription,
      logo: subscription.category?.icon || "🔔",
      color: subscription.category?.color || "blue",
      active: true // Since we don't have this field in the database, default to true
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// PUT - Update a subscription
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id;
    const { id: subscriptionId } = await params;
    const { name, amount, cycle, nextPayment, category, logo, color, active } = await request.json();

    // Validation
    if (!name || amount === undefined || !cycle || !nextPayment) {
      return NextResponse.json(
        { error: "Missing required fields: name, amount, cycle, nextPayment" },
        { status: 400 }
      );
    }

    // Check if subscription exists and belongs to the user
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!existingSubscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (existingSubscription.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Find the category by name if provided
    let categoryId = existingSubscription.categoryId;
    if (category) {
      const categoryObj = await prisma.category.findFirst({
        where: {
          userId,
          name: category
        }
      });
      
      if (categoryObj) {
        categoryId = categoryObj.id;
      }
    }

    // Update the subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        name,
        amount: parseFloat(amount.toString()),
        billingCycle: cycle,
        nextBillingDate: new Date(nextPayment),
        categoryId
      },
      include: {
        category: true
      }
    });
    
    // Add UI-specific fields to match the frontend model
    const responseData = {
      ...updatedSubscription,
      logo: logo || updatedSubscription.category?.icon || "🔔",
      color: color || updatedSubscription.category?.color || "blue",
      active: active !== undefined ? active : true
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id;
    const { id: subscriptionId } = await params;

    // Check if subscription exists and belongs to the user
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!existingSubscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (existingSubscription.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the subscription
    await prisma.subscription.delete({
      where: { id: subscriptionId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}