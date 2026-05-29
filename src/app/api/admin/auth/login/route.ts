import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";
import { setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Set cookie session
    await setAdminSession({
      userId: admin._id as any,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
