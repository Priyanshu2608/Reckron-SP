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
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900/10 py-12 fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title c*/}
        <div className="text-left mb-10 flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-accent-blue ">
            Pharmaceutical Catalog
          </h1>
          <p className="text-muted text-sm max-w-2xl leading-relaxed">
            Search our regulatory-certified Product catalog. You can filter by therapy categories or request bulk dossiers.
          </p>
        </div>

        {/* Catalog container */}
        <ProductsContainer categories={JSON.parse(JSON.stringify(categories))} />

      </div>
    </div>
  );
}
