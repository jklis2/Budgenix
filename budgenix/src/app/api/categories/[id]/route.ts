import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Helper function to verify JWT token and get user ID
const getUserIdFromToken = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No valid authorization header found");
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

// GET a specific category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: categoryId } = await params;
    
    // Get category
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        budgetItems: true,
        transactions: {
          take: 10,
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Verify that the category belongs to the authenticated user
    if (category.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: categoryId } = await params;
    const { name, icon, color, isIncome } = await request.json();

    // Validation
    if (!name || !icon || !color) {
      return NextResponse.json(
        { error: "Missing required fields: name, icon, color" },
        { status: 400 }
      );
    }

    // Check if category exists and belongs to the user
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (existingCategory.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Don't allow changing isIncome for default categories to prevent data inconsistency
    let updatedIsIncome = isIncome;
    if (existingCategory.isDefault && existingCategory.isIncome !== isIncome) {
      updatedIsIncome = existingCategory.isIncome;
      console.log("Attempted to change isIncome for default category, ignoring this change");
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        icon,
        color,
        isIncome: updatedIsIncome
      }
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: categoryId } = await params;

    // Check if category exists and belongs to the user
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        budgetItems: true,
        transactions: true,
        subscriptions: true
      }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (existingCategory.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Don't allow deleting default categories
    if (existingCategory.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete default categories" },
        { status: 400 }
      );
    }

    // Check if category is in use
    if (
      existingCategory.budgetItems.length > 0 ||
      existingCategory.transactions.length > 0 ||
      existingCategory.subscriptions.length > 0
    ) {
      return NextResponse.json(
        { 
          error: "Cannot delete category that is in use. Remove all associated budget items, transactions, and subscriptions first.",
          usageCount: {
            budgetItems: existingCategory.budgetItems.length,
            transactions: existingCategory.transactions.length,
            subscriptions: existingCategory.subscriptions.length
          }
        },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: categoryId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
