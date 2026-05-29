import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";

interface IParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: IParams) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const product = await Product.findOne({ slug }).populate("category", "name slug");
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get related products (same category, excluding current product, limit 3)
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .select("name slug images packaging composition")
      .limit(3);

    return NextResponse.json({
      product,
      related,
    });
  } catch (error) {
    console.error("GET Public Product Details API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
