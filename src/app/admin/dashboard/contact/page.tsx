"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PhoneCall, Loader2, Save, Mail, MapPin, Share2 } from "lucide-react";
import { toast } from "@/hooks/useToast";

interface IContactFormInputs {
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  mapEmbedUrl: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  instagram: string;
}

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IContactFormInputs>({
    defaultValues: {
      email: "",
      phone: "",
      address: "",
      whatsappNumber: "",
      mapEmbedUrl: "",
      facebook: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      instagram: "",
    },
  });

  useEffect(() => {
    const loadContactInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/contact");
        if (res.ok) {
          const data = await res.json();
          setValue("email", data.email || "");
          setValue("phone", data.phone || "");
          setValue("address", data.address || "");
          setValue("whatsappNumber", data.whatsappNumber || "");
          setValue("mapEmbedUrl", data.mapEmbedUrl || "");
          setValue("facebook", data.socialLinks?.facebook || "");
          setValue("linkedin", data.socialLinks?.linkedin || "");
          setValue("twitter", data.socialLinks?.twitter || "");
          setValue("youtube", data.socialLinks?.youtube || "");
          setValue("instagram", data.socialLinks?.instagram || "");
        }
      } catch (err) {
        console.error("Failed to load contact info:", err);
        toast.error("Failed to load contact coordinates");
      } finally {
        setLoading(false);
      }
    };
    loadContactInfo();
  }, [setValue]);

  const onSubmit = async (data: IContactFormInputs) => {
    setSubmitting(true);
    const payload = {
      email: data.email,
      phone: data.phone,
      address: data.address,
      whatsappNumber: data.whatsappNumber,
      mapEmbedUrl: data.mapEmbedUrl,
      socialLinks: {
        facebook: data.facebook,
        linkedin: data.linkedin,
        twitter: data.twitter,
        youtube: data.youtube,
        instagram: data.instagram,
      },
    };

    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Contact specifications updated successfully!");
      } else {
        const result = await res.json();
        toast.error(result.error || "Failed to update contact specs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 fade-in-up text-left">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Contact Specifications</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Manage address coordinates and social media mappings</p>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading coordinates...
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          {/* Card 1: Core details */}
          <div className="bg-white border border-slate-200 rounded p-6 space-y-6">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-600" /> Core Coordinates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Public Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. info@reckronsp.com"
                  {...register("email", { required: "Email is required" })}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Public Telephone Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +1 (555) 019-2834"
                  {...register("phone", { required: "Phone is required" })}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp Contact Number (International Format)</label>
                <input
                  type="text"
                  placeholder="e.g. +15550192834"
                  {...register("whatsappNumber")}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Google Maps Embed URL (Iframe Source)</label>
                <input
                  type="text"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  {...register("mapEmbedUrl")}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Physical Office Address *</label>
              <textarea
                rows={3}
                required
                placeholder="Enter complete office address..."
                {...register("address", { required: "Address is required" })}
                className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
              />
            </div>
          </div>

          {/* Card 2: Social media */}
          <div className="bg-white border border-slate-200 rounded p-6 space-y-6">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-slate-600" /> Social Media Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">LinkedIn Profile</label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/company/reckronsp"
                  {...register("linkedin")}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Facebook Page</label>
                <input
                  type="text"
                  placeholder="https://facebook.com/reckronsp"
                  {...register("facebook")}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">X / Twitter</label>
                <input
                  type="text"
                  placeholder="https://twitter.com/reckronsp"
                  {...register("twitter")}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">YouTube Channel</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/reckronsp"
                  {...register("youtube")}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Instagram</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/reckronsp"
                  {...register("instagram")}
                  className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded bg-black hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Saving Coordinates...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Contact Details
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
