"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Home, Info, BarChart, CheckSquare, Award, BookOpen } from "lucide-react";
import { toast } from "@/hooks/useToast";
import { DEFAULT_CMS } from "@/lib/cms-defaults";

const DEFAULT_ABOUT_DETAILS = {
  storyTitle: "Our Story",
  storyText: "Reckron SP is a small, dedicated pharmaceutical business. We started with a simple goal: to make safe, reliable, and high-quality medicines accessible to our community. We focus on care, using premium certified ingredients, and keeping our operations simple and focused on quality.",
  timeline: [
    { year: "2014", title: "Business Inception", desc: "Started with a focus on supplying reliable, high-quality essential medicines." },
    { year: "2018", title: "Growing Reach", desc: "Expanded our distribution network to support more local healthcare providers." },
    { year: "2022", title: "Local Trust", desc: "Partnered with clinics and pharmacies to ensure consistent supply of daily care products." },
    { year: "2026", title: "Quality First", desc: "Continued commitment to safe packaging and reliable, honest pharmaceutical supply." },
  ],
};

type TabType = "hero" | "about" | "stats" | "why_choose_us" | "certifications" | "about_details";

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // States to hold the fetched structures
  const [heroState, setHeroState] = useState(DEFAULT_CMS.home_hero);
  const [aboutState, setAboutState] = useState(DEFAULT_CMS.home_about);
  const [statsState, setStatsState] = useState(DEFAULT_CMS.statistics);
  const [whyChooseState, setWhyChooseState] = useState(DEFAULT_CMS.why_choose_us);
  const [certificationsState, setCertificationsState] = useState(DEFAULT_CMS.certifications);
  const [aboutDetailsState, setAboutDetailsState] = useState(DEFAULT_ABOUT_DETAILS);

  const loadCmsContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        if (data.home_hero) setHeroState({ ...DEFAULT_CMS.home_hero, ...data.home_hero });
        if (data.home_about) setAboutState({ ...DEFAULT_CMS.home_about, ...data.home_about });
        if (data.statistics) setStatsState({ ...DEFAULT_CMS.statistics, ...data.statistics });
        if (data.why_choose_us) setWhyChooseState({ ...DEFAULT_CMS.why_choose_us, ...data.why_choose_us });
        if (data.certifications) setCertificationsState({ ...DEFAULT_CMS.certifications, ...data.certifications });
        if (data.about_details) setAboutDetailsState({ ...DEFAULT_ABOUT_DETAILS, ...data.about_details });
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

  const handleSaveSection = async (key: string, value: any, successMessage: string) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        toast.success(successMessage);
      } else {
        toast.error(`Failed to save ${key.replace("_", " ")}`);
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

  const handleWhyChooseFieldChange = (field: string, value: string) => {
    setWhyChooseState((prev) => ({ ...prev, [field]: value }));
  };

  const handleWhyChooseItemChange = (index: number, field: "title" | "description" | "iconName", value: string) => {
    setWhyChooseState((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleCertItemChange = (index: number, field: "name" | "desc", value: string) => {
    setCertificationsState((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleAboutDetailsFieldChange = (field: string, value: string) => {
    setAboutDetailsState((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimelineItemChange = (index: number, field: "year" | "title" | "desc", value: string) => {
    setAboutDetailsState((prev) => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      return { ...prev, timeline: newTimeline };
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
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 shrink-0 select-none">
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

            <button
              onClick={() => setActiveTab("why_choose_us")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold transition-colors shrink-0 cursor-pointer border ${
                activeTab === "why_choose_us"
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <CheckSquare className="w-4.5 h-4.5" /> Why Choose Us
            </button>

            <button
              onClick={() => setActiveTab("certifications")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold transition-colors shrink-0 cursor-pointer border ${
                activeTab === "certifications"
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <Award className="w-4.5 h-4.5" /> Certifications
            </button>

            <button
              onClick={() => setActiveTab("about_details")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold transition-colors shrink-0 cursor-pointer border ${
                activeTab === "about_details"
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" /> About Story & Timeline
            </button>
          </div>

          {/* Form Content area */}
          <div className="lg:col-span-9 bg-white border border-slate-200 rounded p-6">
            
            {/* HERO FORM */}
            {activeTab === "hero" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection("home_hero", heroState, "Homepage Hero updated successfully!");
                }}
                className="space-y-5"
              >
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3">Homepage Hero Banner</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Banner Headline / Slogan</label>
                  <input
                    type="text"
                    value={heroState.title || ""}
                    onChange={(e) => handleHeroFieldChange("title", e.target.value)}
                    className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>

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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection("home_about", aboutState, "Company About details updated successfully!");
                }}
                className="space-y-5"
              >
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection("statistics", statsState, "Statistics banner updated successfully!");
                }}
                className="space-y-5"
              >
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

            {/* WHY CHOOSE US FORM */}
            {activeTab === "why_choose_us" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection("why_choose_us", whyChooseState, "Why Choose Us copy updated successfully!");
                }}
                className="space-y-5"
              >
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3">Why Choose Us Section</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Section Headline Title</label>
                  <input
                    type="text"
                    value={whyChooseState.title}
                    onChange={(e) => handleWhyChooseFieldChange("title", e.target.value)}
                    className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whyChooseState.items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded bg-slate-50 space-y-3 text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Marketing Point #{idx + 1}</span>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">Icon Label</label>
                          <input
                            type="text"
                            value={item.iconName}
                            onChange={(e) => handleWhyChooseItemChange(idx, "iconName", e.target.value)}
                            className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">Feature Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleWhyChooseItemChange(idx, "title", e.target.value)}
                            className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">Prose Description</label>
                          <textarea
                            rows={3}
                            value={item.description}
                            onChange={(e) => handleWhyChooseItemChange(idx, "description", e.target.value)}
                            className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black resize-none"
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
                      <Save className="w-4 h-4" /> Save Why Choose Us Section
                    </>
                  )}
                </button>
              </form>
            )}

            {/* CERTIFICATIONS FORM */}
            {activeTab === "certifications" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection("certifications", certificationsState, "Certifications updated successfully!");
                }}
                className="space-y-5"
              >
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3">Company Certifications</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certificationsState.items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded bg-slate-50 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certification #{idx + 1}</span>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">Certificate Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleCertItemChange(idx, "name", e.target.value)}
                            className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">Short Description</label>
                          <input
                            type="text"
                            value={item.desc}
                            onChange={(e) => handleCertItemChange(idx, "desc", e.target.value)}
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
                      <Save className="w-4 h-4" /> Save Certifications
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ABOUT DETAILS / STORY / TIMELINE FORM */}
            {activeTab === "about_details" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveSection("about_details", aboutDetailsState, "About Story and Timeline updated successfully!");
                }}
                className="space-y-5"
              >
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3">About Page Story & Timeline</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Story Title</label>
                  <input
                    type="text"
                    value={aboutDetailsState.storyTitle}
                    onChange={(e) => handleAboutDetailsFieldChange("storyTitle", e.target.value)}
                    className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Story Narrative Paragraph</label>
                  <textarea
                    rows={6}
                    value={aboutDetailsState.storyText}
                    onChange={(e) => handleAboutDetailsFieldChange("storyText", e.target.value)}
                    className="px-3 py-2 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-black resize-none"
                  />
                </div>

                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Journey Milestones (Timeline)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {aboutDetailsState.timeline.map((event, idx) => (
                      <div key={idx} className="p-4 border border-slate-200 rounded bg-slate-50 space-y-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Milestone #{idx + 1}</span>
                        
                        <div className="grid grid-cols-12 gap-3 mb-2">
                          <div className="col-span-3 flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500">Year</label>
                            <input
                              type="text"
                              value={event.year}
                              onChange={(e) => handleTimelineItemChange(idx, "year", e.target.value)}
                              className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black"
                            />
                          </div>
                          <div className="col-span-9 flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500">Event Title</label>
                            <input
                              type="text"
                              value={event.title}
                              onChange={(e) => handleTimelineItemChange(idx, "title", e.target.value)}
                              className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500">Description</label>
                          <textarea
                            rows={3}
                            value={event.desc}
                            onChange={(e) => handleTimelineItemChange(idx, "desc", e.target.value)}
                            className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-black resize-none"
                          />
                        </div>
                      </div>
                    ))}
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
                      <Save className="w-4 h-4" /> Save About Details & Timeline
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
