"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Loader2, Save, Home, Info, BarChart } from "lucide-react";
import { toast } from "@/hooks/useToast";
import { DEFAULT_CMS } from "@/lib/cms-defaults";

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "stats">("hero");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // States to hold the fetched structures
  const [heroState, setHeroState] = useState(DEFAULT_CMS.home_hero);
  const [aboutState, setAboutState] = useState(DEFAULT_CMS.home_about);
  const [statsState, setStatsState] = useState(DEFAULT_CMS.statistics);

  const loadCmsContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        if (data.home_hero) setHeroState(data.home_hero);
        if (data.home_about) setAboutState(data.home_about);
        if (data.statistics) setStatsState(data.statistics);
      }
    } catch (err) {
      console.error("Failed to load CMS content:", err);
      toast.error("Failed to load CMS content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCmsContent();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "home_hero", value: heroState }),
      });
      if (res.ok) {
        toast.success("Homepage Hero updated successfully!");
      } else {
        toast.error("Failed to save Hero section");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "home_about", value: aboutState }),
      });
      if (res.ok) {
        toast.success("Company About details updated successfully!");
      } else {
        toast.error("Failed to save About section");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "statistics", value: statsState }),
      });
      if (res.ok) {
        toast.success("Statistics banner updated successfully!");
      } else {
        toast.error("Failed to save statistics");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHeroFieldChange = (field: string, value: string) => {
    setHeroState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAboutFieldChange = (field: string, value: string | number) => {
    setAboutState((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatFieldChange = (index: number, field: "count" | "label", value: string) => {
    setStatsState((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  return (
    <div className="space-y-8 fade-in-up text-left">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">CMS Content Editor</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Modify dynamic copy across public website routes</p>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading website content...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Tabs Sidebar */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 shrink-0">
            <button
              onClick={() => setActiveTab("hero")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold transition-colors shrink-0 cursor-pointer border ${
                activeTab === "hero"
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <Home className="w-4.5 h-4.5" /> Hero Section
            </button>
            
            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold transition-colors shrink-0 cursor-pointer border ${
                activeTab === "about"
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <Info className="w-4.5 h-4.5" /> Company Intro
            </button>
            
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold transition-colors shrink-0 cursor-pointer border ${
                activeTab === "stats"
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <BarChart className="w-4.5 h-4.5" /> Stats Counters
            </button>
          </div>

          {/* Form Content area */}
          <div className="lg:col-span-9 bg-white border border-slate-200 rounded p-6">
            
            {/* HERO FORM */}
            {activeTab === "hero" && (
              <form onSubmit={handleSaveHero} className="space-y-5">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3">Homepage Hero Banner</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Banner Sub-heading / Description</label>
                  <textarea
                    rows={4}
                    value={heroState.subtitle}
                    onChange={(e) => handleHeroFieldChange("subtitle", e.target.value)}
                    className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Button Text</label>
                    <input
                      type="text"
                      value={heroState.primaryBtnText}
                      onChange={(e) => handleHeroFieldChange("primaryBtnText", e.target.value)}
                      className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Secondary Button Text</label>
                    <input
                      type="text"
                      value={heroState.secondaryBtnText}
                      onChange={(e) => handleHeroFieldChange("secondaryBtnText", e.target.value)}
                      className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-black hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Hero Section
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ABOUT FORM */}
            {activeTab === "about" && (
              <form onSubmit={handleSaveAbout} className="space-y-5">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3">Company Introduction Block</h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-3 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Tag / Category Label</label>
                    <input
                      type="text"
                      value={aboutState.tag}
                      onChange={(e) => handleAboutFieldChange("tag", e.target.value)}
                      className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="sm:col-span-7 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Title Header</label>
                    <input
                      type="text"
                      value={aboutState.title}
                      onChange={(e) => handleAboutFieldChange("title", e.target.value)}
                      className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Years Exp</label>
                    <input
                      type="number"
                      value={aboutState.experienceYears}
                      onChange={(e) => handleAboutFieldChange("experienceYears", parseInt(e.target.value))}
                      className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Main Prose Description</label>
                  <textarea
                    rows={4}
                    value={aboutState.description}
                    onChange={(e) => handleAboutFieldChange("description", e.target.value)}
                    className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Corporate Mission</label>
                    <textarea
                      rows={3}
                      value={aboutState.mission}
                      onChange={(e) => handleAboutFieldChange("mission", e.target.value)}
                      className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Corporate Vision</label>
                    <textarea
                      rows={3}
                      value={aboutState.vision}
                      onChange={(e) => handleAboutFieldChange("vision", e.target.value)}
                      className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-black hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save About Section
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STATS FORM */}
            {activeTab === "stats" && (
              <form onSubmit={handleSaveStats} className="space-y-5">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3">Statistics Counters Banner</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {statsState.items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded bg-slate-50 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Counter #{idx + 1}</span>
                      
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-4 flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">Value</label>
                          <input
                            type="text"
                            value={item.count}
                            onChange={(e) => handleStatFieldChange(idx, "count", e.target.value)}
                            className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black"
                          />
                        </div>
                        <div className="col-span-8 flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">Label</label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleStatFieldChange(idx, "label", e.target.value)}
                            className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-black hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Statistics Banner
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
