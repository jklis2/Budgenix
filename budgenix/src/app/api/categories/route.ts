import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getUserFromToken } from "@/lib/auth-helpers";

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
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Attempting to create category for user ID:", user.id, "email:", user.email);
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
      
      // Jeśli kategoria nie jest przychodem, dodaj ją do aktywnego budżetu
      if (!isIncome) {
        try {
          // Znajdź aktywny budżet użytkownika
          const activeBudget = await prisma.budget.findFirst({
            where: {
              userId: user.id,
              isActive: true
            }
          });

          if (activeBudget) {
            // Sprawdź czy pozycja budżetowa dla tej kategorii już istnieje
            const existingItem = await prisma.budgetItem.findFirst({
              where: {
                budgetId: activeBudget.id,
                categoryId: newCategory.id
              }
            });

            // Jeśli nie istnieje, utwórz nową pozycję budżetową
            if (!existingItem) {
              await prisma.budgetItem.create({
                data: {
                  budgetId: activeBudget.id,
                  categoryId: newCategory.id,
                  allocatedAmount: 1000 // Domyślna kwota budżetowa
                }
              });
              
              console.log(`Added category ${newCategory.name} to active budget with default amount 1000`);
            }
          }
        } catch (budgetError) {
          console.error("Error adding category to budget:", budgetError);
          // Nie przerywamy procesu - kategoria została utworzona pomyślnie
        }
      }
      
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
