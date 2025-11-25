import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token: resetToken, newPassword, currentPassword, confirmNewPassword } = body;

    // Case 1: Reset password with email token (no authentication required)
    if (resetToken) {
      if (!newPassword) {
        return NextResponse.json({ error: "New password is required" }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ 
          error: "Password must be at least 8 characters long" 
        }, { status: 400 });
      }

      // Find user by activation token
      const user = await prisma.user.findFirst({
        where: { activationToken: resetToken }
      });

      if (!user) {
        return NextResponse.json({ 
          error: "Invalid or expired reset token" 
        }, { status: 400 });
      }

      // Hash new password
      const hashedPassword = await hash(newPassword, 10);

      // Update password and clear token
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          password: hashedPassword,
          activationToken: null 
        }
      });

      return NextResponse.json({ 
        message: "Password has been reset successfully" 
      });
    }

    // Case 2: Change password for logged-in user (requires JWT)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jwtToken = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(jwtToken, process.env.JWT_SECRET!) as { id: string; email: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Validate input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters long" 
      }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const validPassword = await compare(currentPassword, user.password);
    if (!validPassword) {
      return NextResponse.json({ 
        error: "Current password is incorrect" 
      }, { status: 401 });
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ 
      message: "Password changed successfully" 
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ 
      error: "An error occurred while changing password" 
    }, { status: 500 });
  }
}
