import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const hashedPassword = await hash(password, 10);
    const activationToken = uuidv4();

    await prisma.user.create({
      data: { email, password: hashedPassword, activationToken },
    });

    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_URL) {
      console.error("NEXT_PUBLIC_URL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const activationLink = `${process.env.NEXT_PUBLIC_URL}/activate?token=${activationToken}`;
    
    try {
      await sendEmail(
        email,
        "Activate Your Account",
        `Click to activate: ${activationLink}`
      );
      console.log(`Activation email sent to ${email} with token ${activationToken}`);
    } catch (emailError) {
      console.error("Failed to send activation email:", emailError);
      // We don't return an error here because the user was already created
      // Instead, we inform the user that they may need to request a new activation email
      return NextResponse.json({ 
        message: "User registered but activation email could not be sent. Please contact support.",
        activationToken // Include token for debugging purposes in development
      });
    }

    return NextResponse.json({ message: "Activation email sent" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
