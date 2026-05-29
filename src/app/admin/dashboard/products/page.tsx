"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pill, Search, Plus, Edit, Trash2, Loader2, Award, FolderOpen } from "lucide-react";
import { IProduct } from "@/models/Product";
import { ICategory } from "@/models/Category";
import Modal from "@/components/ui/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "@/hooks/useToast";

interface IProductFormInput {
  name: string;
  category: string;
  composition: string;
  packaging: string;
  dosage: string;
  description: string;
  benefitsText: string; // Textarea split by newlines
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Custom states for files/images uploaded
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IProductFormInput>({
    defaultValues: {
      name: "",
      category: "",
      composition: "",
      packaging: "",
      dosage: "",
      description: "",
      benefitsText: "",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  });

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/products?search=${encodeURIComponent(search)}&category=${categoryFilter}&page=${page}&limit=8`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [search, categoryFilter, page]);

  const openAddModal = () => {
    setEditProduct(null);
    setUploadedImages([]);
    reset({
      name: "",
      category: categories.length > 0 ? (categories[0]._id as any) : "",
      composition: "",
      packaging: "",
      dosage: "",
      description: "",
      benefitsText: "",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (prod: IProduct) => {
    setEditProduct(prod);
    setUploadedImages(prod.images || []);
    reset({
      name: prod.name,
      category: prod.category ? ((prod.category as any)._id || prod.category) : "",
      composition: prod.composition,
      packaging: prod.packaging || "",
      dosage: prod.dosage || "",
      description: prod.description,
      benefitsText: prod.benefits ? prod.benefits.join("\n") : "",
      featured: !!prod.featured,
      seoTitle: prod.seoMetadata?.title || "",
      seoDescription: prod.seoMetadata?.description || "",
      seoKeywords: prod.seoMetadata?.keywords || "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: IProductFormInput) => {
    setSubmitting(true);
    try {
      const benefits = data.benefitsText
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);

      const payload = {
        name: data.name,
        category: data.category,
        composition: data.composition,
        packaging: data.packaging,
        dosage: data.dosage,
        description: data.description,
        benefits,
        featured: data.featured,
        images: uploadedImages,
        seoMetadata: {
          title: data.seoTitle,
          description: data.seoDescription,
          keywords: data.seoKeywords,
        },
      };

      const url = editProduct
        ? `/api/admin/products/${editProduct._id}`
        : "/api/admin/products";
      const method = editProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          editProduct ? "Product updated successfully" : "Product created successfully"
        );
        setModalOpen(false);
        loadProducts();
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product specifications card?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted successfully");
        loadProducts();
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-8 fade-in-up text-left">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Products Catalog</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Manage pharmaceutical active compound cards</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded bg-black hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-slate-200 p-4 rounded">
        {/* Search */}
        <div className="relative flex-1 w-full flex items-center border border-slate-200 bg-white rounded px-3 py-1.5">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search name or active ingredient composition..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent border-none text-slate-800 text-sm focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Category filter */}
        <div className="w-full md:w-64">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 border border-slate-200 bg-white rounded text-sm focus:outline-none text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id as any} value={cat._id as any}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List Table */}
      <div className="bg-white border border-slate-200 rounded p-6">
        {loading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading Products...
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">Therapy Category</th>
                  <th className="pb-3">Packaging Specs</th>
                  <th className="pb-3">Featured</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod._id as any} className="text-slate-700">
                    <td className="py-3 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        {prod.name}
                        <span className="block text-[10px] font-normal text-slate-500 mt-0.5 max-w-[200px] truncate">{prod.composition}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                        <FolderOpen className="w-3 h-3" />
                        {(prod.category as any)?.name || "Pharmaceutical"}
                      </span>
                    </td>
                    <td className="py-3 text-xs font-semibold text-slate-600">{prod.packaging || "-"}</td>
                    <td className="py-3">
                      {prod.featured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-950 border border-slate-300 px-1.5 py-0.5 rounded bg-slate-50 uppercase tracking-wider">
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id as any)}
                          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500 text-sm border border-dashed border-slate-200 rounded">
            No products found matching filters.
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded border border-slate-200 text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs font-bold text-slate-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded border border-slate-200 text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? `Edit Product: ${editProduct.name}` : "Add New Product"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Row 1: Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Paracetamol 500mg"
                {...register("name", { required: "Name is required" })}
                className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
              />
              {errors.name && <span className="text-[10px] text-rose-500">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Category *</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id as any} value={cat._id as any}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="text-[10px] text-rose-500">{errors.category.message}</span>}
            </div>
          </div>

          {/* Row 2: Composition and Packaging */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Active Composition *</label>
              <input
                type="text"
                placeholder="e.g. Paracetamol IP 500 mg"
                {...register("composition", { required: "Composition is required" })}
                className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
              />
              {errors.composition && <span className="text-[10px] text-rose-500">{errors.composition.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Packaging Specifications</label>
              <input
                type="text"
                placeholder="e.g. 10x10 Tablets Blister pack"
                {...register("packaging")}
                className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Row 3: Image uploader */}
          <ImageUpload value={uploadedImages} onChange={(urls) => setUploadedImages(urls)} />

          {/* Row 4: Dosage & Administration */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Dosage & Administration</label>
            <textarea
              rows={2}
              placeholder="e.g. As directed by the Physician."
              {...register("dosage")}
              className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>

          {/* Row 5: Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Description *</label>
            <textarea
              rows={3}
              placeholder="Provide clinical details, pharmacology indications..."
              {...register("description", { required: "Description is required" })}
              className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
            />
            {errors.description && <span className="text-[10px] text-rose-500">{errors.description.message}</span>}
          </div>

          {/* Row 6: Benefits (one per line) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Key Benefits / Clinical Indications (One per line)</label>
            <textarea
              rows={3}
              placeholder="e.g. Reduces high fever quickly&#10;Relieves mild to moderate pain"
              {...register("benefitsText")}
              className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featuredProduct"
              {...register("featured")}
              className="w-4 h-4 accent-black rounded border-slate-300 focus:ring-black focus:ring-2"
            />
            <label htmlFor="featuredProduct" className="text-sm font-semibold text-slate-700">
              Pin as Featured Product on Homepage
            </label>
          </div>

          {/* SEO Metadata Accordion/Section */}
          <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-4">
            <h4 className="font-bold text-xs text-slate-950 uppercase tracking-wider">Search Engine Optimization (SEO) Details</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Title</label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol tablets wholesale | Reckron"
                  {...register("seoTitle")}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Keywords (comma separated)</label>
                <input
                  type="text"
                  placeholder="paracetamol, painkiller, tablets"
                  {...register("seoKeywords")}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Description</label>
              <textarea
                rows={2}
                placeholder="Meta description displayed in search results..."
                {...register("seoDescription")}
                className="px-3 py-2 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded bg-black hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Saving Product...
              </>
            ) : (
              <>
                Save Product Product
              </>
            )}
          </button>
        </form>
      </Modal>

    </div>
  );
}
