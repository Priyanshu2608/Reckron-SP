import Link from "next/link";
import { Pill, FolderOpen, Mail, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Enquiry from "@/models/Enquiry";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  await connectToDatabase();

  // Fetch stats in parallel
  const [productCount, categoryCount, pendingEnquiryCount, totalEnquiryCount, recentEnquiries] =
    await Promise.all([
      Product.countDocuments({}),
      Category.countDocuments({}),
      Enquiry.countDocuments({ status: "pending" }),
      Enquiry.countDocuments({}),
      Enquiry.find({}).sort({ createdAt: -1 }).limit(5),
    ]);

  const cards = [
    {
      title: "Total Products",
      value: productCount,
      desc: "Active catalog list size",
      icon: Pill,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/admin/dashboard/products",
    },
    {
      title: "Therapy Categories",
      value: categoryCount,
      desc: "Distinct medical sections",
      icon: FolderOpen,
      color: "text-accent",
      bg: "bg-accent/10",
      href: "/admin/dashboard/categories",
    },
    {
      title: "Pending Enquiries",
      value: pendingEnquiryCount,
      desc: "Requires stock reviews",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/admin/dashboard/enquiries",
    },
    {
      title: "Total Enquiries",
      value: totalEnquiryCount,
      desc: "Total client queries logged",
      icon: Mail,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      href: "/admin/dashboard/enquiries",
    },
  ];

  const isCloudinaryConfigured =
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET;

  return (
    <div className="space-y-8 fade-in-up text-left">

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded border border-slate-200 bg-white text-slate-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight">System Status Online</h1>
          <p className="text-slate-500 text-xs mt-1">Manage Reckron Products catalog, client enquiries, and homepage content.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <div className="px-3 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 max-w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Database Sync OK
          </div>
          {isCloudinaryConfigured ? (
            <div className="px-3 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 max-w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" /> Cloudinary Enabled
            </div>
          ) : (
            <div className="px-3 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 max-w-max" title="Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local to activate Cloudinary uploads.">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Cloudinary Fallback (Local)
            </div>
          )}
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="p-5 bg-white border border-slate-200 rounded flex flex-col gap-4 text-left hover:border-black transition-colors group"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">
                  {card.value}
                </span>
                <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries List */}
      <div className="bg-white border border-slate-200 rounded p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-base text-slate-900">Recent Client Enquiries</h3>
          <Link
            href="/admin/dashboard/enquiries"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-black underline"
          >
            Manage Enquiries <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <th className="pb-3">Client Name</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">City/Country</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEnquiries.map((enquiry) => (
                  <tr key={enquiry._id as any} className="text-slate-700">
                    <td className="py-3 font-bold text-slate-900">
                      {enquiry.fullName}
                      <span className="block text-[10px] font-normal text-slate-500 mt-0.5">{enquiry.companyName || "No Company"}</span>
                    </td>
                    <td className="py-3 font-semibold text-slate-800">{enquiry.product}</td>
                    <td className="py-3">
                      {enquiry.city ? `${enquiry.city}, ` : ""}
                      {enquiry.country || "N/A"}
                    </td>
                    <td className="py-3 text-xs text-slate-500">{formatDate(enquiry.createdAt)}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${enquiry.status === "pending"
                            ? "bg-slate-100 border-slate-300 text-slate-700"
                            : enquiry.status === "reviewed"
                              ? "bg-slate-50 border-slate-200 text-slate-600"
                              : "bg-black border-black text-white"
                          }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-200 rounded">
            No client enquiries logged yet.
          </div>
        )}
      </div>

    </div>
  );
}
