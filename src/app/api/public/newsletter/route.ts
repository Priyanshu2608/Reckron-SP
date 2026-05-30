import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    try {
      await NewsletterSubscriber.create({ email });
    } catch (err: any) {
      // Duplicate key error code in MongoDB (already subscribed)
      if (err.code === 11000) {
        return NextResponse.json({
          success: true,
          message: "You are already subscribed to our newsletter!",
        });
      }
      throw err;
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully! Thank you for joining our newsletter.",
    });
  } catch (error) {
    console.error("POST Newsletter API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
