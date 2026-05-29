import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

interface IParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: IParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = slugify(name);

    // Check if category with this slug already exists (excluding current category)
    const existing = await Category.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json(
        { error: "Another category with a similar name already exists" },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description: description || "" },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("PUT Category API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: IParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    // Check if there are any products attached to this category
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It is linked to ${productCount} product(s).` },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE Category API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
