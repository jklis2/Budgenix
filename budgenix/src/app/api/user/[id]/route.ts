import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const authenticatedUser = await getUserFromToken(request);
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await params;

    // Sprawdź czy użytkownik próbuje pobrać swoje własne dane
    if (authenticatedUser.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden - You can only access your own profile" },
        { status: 403 }
      );
    }

    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isActive: true,
        fullName: true,
        phoneNumber: true,
        avatarColor: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user data" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Weryfikacja tokenu JWT i pobranie użytkownika
    const authenticatedUser = await getUserFromToken(request);
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await params;

    // Sprawdź czy użytkownik próbuje zaktualizować swoje własne dane
    if (authenticatedUser.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden - You can only update your own profile" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate that user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update only the allowed fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: body.fullName,
        phoneNumber: body.phoneNumber,
        avatarColor: body.avatarColor,
      },
      select: {
        id: true,
        email: true,
        isActive: true,
        fullName: true,
        phoneNumber: true,
        avatarColor: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "An error occurred while updating user data" },
      { status: 500 }
    );
  }
}
