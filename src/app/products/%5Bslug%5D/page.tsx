import { notFound } from "next/navigation";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import ProductDetailsClient from "@/components/public/ProductDetailsClient";
import ProductCard from "@/components/public/ProductCard";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

interface IProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic SEO metadata (Next.js 15 compliant)
export async function generateMetadata({ params }: IProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug });

    if (!product) {
      return { title: "Product Not Found" };
    }

    return {
      title: product.seoMetadata?.title || `${product.name} | Spec Dossier`,
      description:
        product.seoMetadata?.description ||
        `Technical specification sheet, composition, dosage details, and stock enquiry for ${product.name}.`,
      keywords: product.seoMetadata?.keywords?.split(",") || [product.name, "pharmaceuticals", "Products"],
    };
  } catch (err) {
    console.error("Metadata generation failed:", err);
    return { title: "Product Specs" };
  }
}

export const revalidate = 0;

export default async function ProductDetailPage({ params }: IProductPageProps) {
  const { slug } = await params;
  await connectToDatabase();

  const product = await Product.findOne({ slug }).populate("category", "name slug");
  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current product, limit 3)
  let relatedProducts: any[] = [];
  try {
    relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .populate("category", "name slug")
      .limit(3);
  } catch (err) {
    console.error("Failed to load related products:", err);
  }

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900/10 py-12 fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link / Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-accent-blue transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Pharmaceutical Catalog
          </Link>
        </div>

        {/* Dynamic Detail Viewer */}
        <div className="bg-card dark:bg-slate-950 border border-border rounded-3xl p-6 sm:p-10 shadow-sm mb-16">
          <ProductDetailsClient product={JSON.parse(JSON.stringify(product))} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-border/80 pt-16 text-left">
            <h2 className="text-2xl font-extrabold text-primary dark:text-white mb-8">
              Related Products in {(product.category as any).name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <div key={p._id as string}>
                  <ProductCard product={JSON.parse(JSON.stringify(p))} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
