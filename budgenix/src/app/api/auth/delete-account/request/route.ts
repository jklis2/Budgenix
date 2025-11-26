import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sendDeleteAccountEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get the user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate verification code
    const deleteAccountCode = Math.floor(100000 + Math.random() * 900000).toString();
    const deleteAccountExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min validity

    // Save the code to the database (reusing twoFACode and twoFAExpiry fields)
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        twoFACode: deleteAccountCode, 
        twoFAExpiry: deleteAccountExpiry 
      }
    });

    // Send verification code via email
    await sendDeleteAccountEmail(user.email, deleteAccountCode);

    return NextResponse.json({ 
      message: "Kod weryfikacyjny został wysłany na Twój adres email" 
    });
  } catch (error) {
    console.error("Error requesting account deletion:", error);
    return NextResponse.json({ 
      error: "Wystąpił błąd podczas wysyłania kodu weryfikacyjnego" 
    }, { status: 500 });
  }
}
