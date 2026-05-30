import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 });
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("GET Subscribers API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
