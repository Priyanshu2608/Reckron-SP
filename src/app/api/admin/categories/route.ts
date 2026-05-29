import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET Categories API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = slugify(name);

    // Check if category with this slug already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Category with a similar name already exists" },
        { status: 400 }
      );
    }

    const newCategory = await Category.create({
      name,
      slug,
      description: description || "",
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("POST Category API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
