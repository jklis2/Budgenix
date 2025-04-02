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

// Default categories that will be created for new users
const defaultCategories = [
  { name: "Oszczędności", icon: "savings", color: "#4CAF50", isIncome: false },
  { name: "Rachunki", icon: "receipt", color: "#F44336", isIncome: false },
  { name: "Rozrywka", icon: "movie", color: "#9C27B0", isIncome: false },
  { name: "Subskrypcje", icon: "subscriptions", color: "#3F51B5", isIncome: false },
  { name: "Transport", icon: "directions_car", color: "#FF9800", isIncome: false },
  { name: "Zdrowie", icon: "medical_services", color: "#2196F3", isIncome: false },
  { name: "Żywność", icon: "restaurant", color: "#8BC34A", isIncome: false },
  { name: "Przychód", icon: "payments", color: "#4CAF50", isIncome: true }
];

// GET all categories for the authenticated user
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

    // Check if the user has any categories
    const categoriesCount = await prisma.category.count({
      where: { userId: user.id }
    });

    // If user has no categories, create default ones
    if (categoriesCount === 0) {
      console.log("No categories found for user, creating default categories");
      
      // Create default categories for the user
      await Promise.all(
        defaultCategories.map(category => 
          prisma.category.create({
            data: {
              name: category.name,
              icon: category.icon,
              color: category.color,
              isIncome: category.isIncome,
              isDefault: true,
              userId: user.id
            }
          })
        )
      );
      
      console.log("Default categories created successfully");
    }

    // Fetch all categories for the user
    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: [
        { isIncome: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: `Failed to fetch categories: ${error}` },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const userInfo = getUserIdFromToken(request);
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Attempting to create category for user ID:", userInfo.id, "email:", userInfo.email);

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

    const { name, icon, color, isIncome } = await request.json();
    console.log("Category data:", { name, icon, color, isIncome });

    // Validation
    if (!name || !icon || !color) {
      return NextResponse.json(
        { error: "Missing required fields: name, icon, color" },
        { status: 400 }
      );
    }

    try {
      // Create new category using Prisma client
      const newCategory = await prisma.category.create({
        data: {
          name,
          icon,
          color,
          isIncome: Boolean(isIncome),
          isDefault: false,
          userId: user.id
        }
      });

      console.log("Category created successfully:", newCategory);
      return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
      console.error("Error creating category with Prisma:", error);
      
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
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: `Failed to create category: ${error}` },
      { status: 500 }
    );
  }
}
