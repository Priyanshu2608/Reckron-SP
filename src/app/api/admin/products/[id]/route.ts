import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
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

    // Verify unique slug (excluding current product)
    const existing = await Product.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json(
        { error: "Another product with a similar name already exists" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT Product API Error:", error);
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

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE Product API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
