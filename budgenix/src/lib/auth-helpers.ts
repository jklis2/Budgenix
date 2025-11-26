import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Helper function to verify JWT token and get user from database
export const getUserFromToken = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No valid authorization header found");
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email: string };
    console.log("Token decoded successfully, user ID:", decoded.id, "email:", decoded.email);
    
    // First try to find user by ID
    let user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    // If not found, try to find by email
    if (!user && decoded.email) {
      console.log(`User with ID ${decoded.id} not found, trying to find by email ${decoded.email}`);
      user = await prisma.user.findUnique({
        where: { email: decoded.email }
      });
    }

    if (!user) {
      console.log(`User with ID ${decoded.id} and email ${decoded.email} not found in the database`);
      return null;
    }

    console.log("User found:", user.id);
    return user;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};
