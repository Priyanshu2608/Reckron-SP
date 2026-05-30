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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 1. Left Column: Sticky Filters Sidebar */}
      <div className="lg:col-span-3 lg:sticky lg:top-24 flex flex-col gap-6">
        {/* Statistics & Quick Details */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
          <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Catalog Stats
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-semibold">Listed Products</span>
              <span className="text-slate-900 font-bold bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-lg text-xs">
                {totalCount} Items
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-semibold">Active Category</span>
              <span className="text-accent-blue font-bold bg-accent-blue/10 border border-accent-blue/15 px-2.5 py-0.5 rounded-lg text-xs capitalize">
                {category === "all" ? "All Segments" : category.replace("-", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Category Selector (Vertical List) */}
        <div className="hidden lg:flex flex-col gap-2">
          <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest px-2 mb-1 text-left">
            Therapy Segments
          </h3>
          <button
            onClick={() => {
              setCategory("all");
              setPage(1);
            }}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between cursor-pointer border ${
              category === "all"
                ? "bg-accent-blue text-white border-accent-blue shadow-md shadow-accent-blue/15"
                : "border-slate-100 hover:border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>All Categories</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-lg font-black ${
                category === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {totalCount}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                setCategory(cat.slug);
                setPage(1);
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between cursor-pointer border ${
                category === cat.slug
                  ? "bg-accent-blue text-white border-accent-blue shadow-md shadow-accent-blue/15"
                  : "border-slate-100 hover:border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Safety & Compliance Badge */}
      </div>

      {/* 2. Right Column: Search Bar & Products Catalog Grid */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog by product name, chemical composition or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-accent-blue focus:shadow-md focus:shadow-accent-blue/5 text-sm transition-all text-slate-800 placeholder:text-slate-400 shadow-xs"
          />
        </div>

        {/* Mobile Category Selector (Horizontal Scrollable Tabs) */}
        <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
          <button
            onClick={() => {
              setCategory("all");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              category === "all"
                ? "bg-accent-blue text-white border-accent-blue shadow-md"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                category === cat.slug
                  ? "bg-accent-blue text-white border-accent-blue shadow-md"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id as any}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl border border-dashed border-slate-200 bg-white max-w-xl mx-auto w-full flex flex-col items-center gap-4 p-8">
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              No chemical compounds match your search or filter requirements. Try adjusting your search query.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 transition-colors cursor-pointer"
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
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === p
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
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Premium Shimmer skeleton card
function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[16/10] w-full bg-slate-100" />
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="w-16 h-3 bg-slate-100 rounded-lg" />
          <div className="w-3/4 h-5 bg-slate-100 rounded-lg mt-1" />
          <div className="w-full h-10 bg-slate-50 rounded-2xl mt-2 border border-slate-100/50" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="w-20 h-4 bg-slate-100 rounded-lg" />
          <div className="w-12 h-4 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
