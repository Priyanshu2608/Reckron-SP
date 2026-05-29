import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9"); // Default 9 cards per page
    const featured = searchParams.get("featured") === "true";

    await connectToDatabase();

    const query: any = {};

    // Filter by featured toggle
    if (featured) {
      query.featured = true;
    }

    // Filter by search query
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { composition: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by Category Slug
    if (categorySlug && categorySlug !== "all") {
      const categoryDoc = await Category.findOne({ slug: categorySlug });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // Category slug doesn't exist, return empty array
        return NextResponse.json({
          products: [],
          pagination: { total: 0, page, limit, pages: 0 },
        });
      }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort({ name: 1 }) // Alphabetic order for public list
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET Public Products API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
