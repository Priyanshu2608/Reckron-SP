import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    await connectToDatabase();

    // Build query filter
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { composition: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
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
    console.error("GET Products API Error:", error);
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
    const data = await request.json();

    const {
      name,
      description,
      composition,
      benefits,
      dosage,
      packaging,
      category,
      images,
      featured,
      seoMetadata,
    } = data;

    if (!name || !description || !composition || !category) {
      return NextResponse.json(
        { error: "Missing required fields (name, description, composition, category)" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    // Verify unique slug
    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A product with a similar name already exists" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name,
      slug,
      description,
      composition,
      benefits: Array.isArray(benefits) ? benefits : [],
      dosage: dosage || "",
      packaging: packaging || "",
      category,
      images: Array.isArray(images) ? images : [],
      featured: !!featured,
      seoMetadata: seoMetadata || { title: "", description: "", keywords: "" },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST Product API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
