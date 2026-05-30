import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import ProductsContainer from "@/components/public/ProductsContainer";

export const revalidate = 0;

export default async function ProductsPage() {
  await connectToDatabase();

  // Fetch categories sorted alphabetically
  let categories: any[] = [];
  try {
    categories = await Category.find({}).sort({ name: 1 });
  } catch (err) {
    console.error("Failed to load categories for catalog page:", err);
  }

  return (
    <div className="flex-1 w-full bg-slate-50 py-12 fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="text-left mb-12 flex flex-col gap-3">
          <span className="font-extrabold text-[10px] uppercase tracking-widest text-accent-blue">
            Regulatory Product Index
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Pharmaceutical Catalog
          </h1>
    
          
        </div>

        {/* Catalog container */}
        <ProductsContainer categories={JSON.parse(JSON.stringify(categories))} />

      </div>
    </div>
  );
}
