import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearAdminSession();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
