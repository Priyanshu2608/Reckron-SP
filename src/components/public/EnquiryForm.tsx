"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Send, CheckCircle2, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/useToast";

interface IEnquiryFormInputs {
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  product: string;
  message: string;
}

interface IEnquiryFormProps {
  preselectedProduct?: string;
  onSuccess?: () => void;
}

export default function EnquiryForm({ preselectedProduct = "", onSuccess }: IEnquiryFormProps) {
  const [productsList, setProductsList] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IEnquiryFormInputs>({
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phoneNumber: "",
      city: "",
      country: "",
      product: preselectedProduct,
      message: "",
    },
  });

  // Pre-fill if preselectedProduct changes
  useEffect(() => {
    if (preselectedProduct) {
      setValue("product", preselectedProduct);
    }
  }, [preselectedProduct, setValue]);

  // Fetch product list for dropdown
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch("/api/public/products?limit=50");
        if (res.ok) {
          const data = await res.json();
          const names = (data.products || []).map((p: any) => p.name);
          // If preselected product is not in the list, prepend/append it
          if (preselectedProduct && !names.includes(preselectedProduct)) {
            names.unshift(preselectedProduct);
          }
          // Ensure "General Enquiry" is always present
          if (!names.includes("General Corporate Inquiry")) {
            names.push("General Corporate Inquiry");
          }
          setProductsList(names);
        }
      } catch (err) {
        console.error("Failed to load products for form:", err);
        setProductsList(["General Corporate Inquiry"]);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, [preselectedProduct]);

  const onSubmit = async (data: IEnquiryFormInputs) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Enquiry submitted successfully! Our desk will contact you soon.");
        setDone(true);
        reset();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Enquiry submission failed.");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="py-8 text-center flex flex-col items-center gap-4 text-slate-800">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold">Thank You!</h3>
        <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
          Your therapeutic Product enquiry has been logged successfully. Our regulatory desk will contact you with product spec dossiers shortly.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-2 px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-colors"
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
      {/* Grid: Full Name & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Full Name *</label>
          <input
            type="text"
            placeholder="John Doe"
            {...register("fullName", { required: "Name is required" })}
            className={`px-4 py-2.5 rounded-xl border bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-accent-blue focus:bg-white transition-all ${errors.fullName ? "border-rose-500" : "border-slate-200"
              }`}
          />
          {errors.fullName && <span className="text-[10px] text-rose-500 font-medium">{errors.fullName.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
          <input
            type="text"
            placeholder="MedLife Pharmacies"
            {...register("companyName")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-accent-blue focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Grid: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Email Address *</label>
          <input
            type="email"
            placeholder="john@company.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
            })}
            className={`px-4 py-2.5 rounded-xl border bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-accent-blue focus:bg-white transition-all ${errors.email ? "border-rose-500" : "border-slate-200"
              }`}
          />
          {errors.email && <span className="text-[10px] text-rose-500 font-medium">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
          <input
            type="tel"
            placeholder="+1 (555) 012-3456"
            {...register("phoneNumber")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-accent-blue focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Grid: City & Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">City</label>
          <input
            type="text"
            placeholder="New York"
            {...register("city")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-accent-blue focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Country</label>
          <input
            type="text"
            placeholder="United States"
            {...register("country")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-accent-blue focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Dropdown: Product Selection */}
      <div className="flex flex-col gap-1.5 relative">
        <label className="text-xs font-bold text-slate-500 uppercase">Select Product / Brand *</label>
        <div className="relative">
          <select
            {...register("product", { required: "Product selection is required" })}
            className={`w-full appearance-none px-4 py-2.5 rounded-xl border bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-accent-blue focus:bg-white transition-all ${errors.product ? "border-rose-500" : "border-slate-200"
              }`}
          >
            <option value="">-- Choose Product --</option>
            {productsList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {errors.product && <span className="text-[10px] text-rose-500 font-medium">{errors.product.message}</span>}
      </div>

      {/* Textarea: Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase">Message *</label>
        <textarea
          rows={4}
          placeholder="Please describe Product stocks quantity required or general query..."
          {...register("message", { required: "Message is required" })}
          className={`px-4 py-2.5 rounded-xl border bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-accent-blue focus:bg-white transition-all resize-none ${errors.message ? "border-rose-500" : "border-slate-200"
            }`}
        />
        {errors.message && <span className="text-[10px] text-rose-500 font-medium">{errors.message.message}</span>}
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-xl bg-primary hover:bg-accent-blue hover:shadow-lg transition-all text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send className="w-4.5 h-4.5" /> Submit Product Enquiry
          </>
        )}
      </button>
    </form>
  );
}
