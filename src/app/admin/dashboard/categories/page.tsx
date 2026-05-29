"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FolderOpen, Search, Plus, Edit, Trash2, Loader2, ArrowRight } from "lucide-react";
import { ICategory } from "@/models/Category";
import Modal from "@/components/ui/Modal";
import { toast } from "@/hooks/useToast";

interface ICategoryFormInput {
  name: string;
  description: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<ICategory | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ICategoryFormInput>({
    defaultValues: { name: "", description: "" },
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditCategory(null);
    reset({ name: "", description: "" });
    setModalOpen(true);
  };

  const openEditModal = (cat: ICategory) => {
    setEditCategory(cat);
    reset({ name: cat.name, description: cat.description || "" });
    setModalOpen(true);
  };

  const onSubmit = async (data: ICategoryFormInput) => {
    setSubmitting(true);
    try {
      const url = editCategory
        ? `/api/admin/categories/${editCategory._id}`
        : "/api/admin/categories";
      const method = editCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          editCategory ? "Category updated successfully" : "Category created successfully"
        );
        setModalOpen(false);
        loadCategories();
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
    if (!confirm("Are you sure you want to delete this category? It must not be linked to any products.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok) {
        toast.success("Category deleted successfully");
        loadCategories();
      } else {
        toast.error(result.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete category error:", err);
      toast.error("Network error");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 fade-in-up text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Therapy Categories</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Group products into medical catalogs</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded bg-black hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Search Input bar */}
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded p-1.5 flex items-center">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Filter categories by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-2 pr-2 py-1 bg-transparent border-none text-slate-800 text-sm focus:outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Categories Grid Table */}
      <div className="bg-white border border-slate-200 rounded p-6">
        {loading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading categories...
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <th className="pb-3">Category Name</th>
                  <th className="pb-3">Slug</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id as any} className="text-slate-700">
                    <td className="py-3 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      {cat.name}
                    </td>
                    <td className="py-3 text-xs font-mono text-slate-500">{cat.slug}</td>
                    <td className="py-3 text-xs text-slate-500 max-w-xs truncate">{cat.description || "-"}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id as any)}
                          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Category"
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
            No categories found. Click "Add Category" to create one.
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCategory ? "Edit Category Details" : "Create New Category"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Category Name *</label>
            <input
              type="text"
              placeholder="e.g. Cardiology"
              {...register("name", { required: "Name is required" })}
              className={`px-3 py-2 rounded border bg-white text-slate-900 text-sm focus:outline-none focus:border-black ${errors.name ? "border-rose-500" : "border-slate-200"
                }`}
            />
            {errors.name && <span className="text-[10px] text-rose-500 font-medium">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
            <textarea
              rows={3}
              placeholder="Provide a brief description of Products in this category..."
              {...register("description")}
              className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded bg-black hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                Save Category
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
