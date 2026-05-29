import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    // Retrieve all enquiries, latest first, populate dynamic product reference if available
    const enquiries = await Enquiry.find({})
      .populate("productId", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("GET Enquiries API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
