"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Loader2, RefreshCw } from "lucide-react";
import ProductCard from "./ProductCard";
import { IProduct } from "@/models/Product";
import { ICategory } from "@/models/Category";

interface IProductsContainerProps {
  categories: ICategory[];
}

export default function ProductsContainer({ categories }: IProductsContainerProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  // Fetch products based on filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `/api/public/products?search=${encodeURIComponent(debouncedSearch)}&category=${category}&page=${page}&limit=9`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
        setTotalCount(data.pagination.total);
      }
    } catch (err) {
      console.error("Products client fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category, page]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">

        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products or active ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-accent-blue focus:bg-white text-sm transition-all"
          />
        </div>

        {/* Total stats */}
        <div className="text-sm font-semibold text-slate-500 shrink-0">
          Showing <span className="text-slate-900 font-bold">{products.length}</span> of{" "}
          <span className="text-slate-900 font-bold">{totalCount}</span> Products
        </div>
      </div>

      {/* Category selector row */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => {
            setCategory("all");
            setPage(1);
          }}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${category === "all"
              ? "bg-accent-blue text-white shadow-md shadow-accent-blue/15"
              : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => {
              setCategory(cat.slug);
              setPage(1);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${category === cat.slug
                ? "bg-accent-blue text-white shadow-md shadow-accent-blue/15"
                : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id as any}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-dashed border-slate-200 bg-white max-w-xl mx-auto w-full flex flex-col items-center gap-4">
          <p className="text-muted text-sm">No Products match your search or filter. Try adjusting your keywords.</p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === p
                      ? "bg-accent-blue text-white shadow-md shadow-accent-blue/15"
                      : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                    }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Premium Shimmer skeleton card
function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] w-full bg-slate-100" />
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="w-16 h-3 bg-slate-100 rounded" />
          <div className="w-3/4 h-5 bg-slate-100 rounded mt-1" />
          <div className="w-full h-10 bg-slate-100 rounded mt-2" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="w-20 h-4 bg-slate-100 rounded" />
          <div className="w-12 h-4 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}
