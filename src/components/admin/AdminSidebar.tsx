"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  FolderOpen,
  Mail,
  Edit,
  PhoneCall,
  LogOut,
  ChevronRight,
  Activity,
} from "lucide-react";
import { toast } from "@/hooks/useToast";

const adminLinks = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/dashboard/products", icon: Pill },
  { name: "Categories", href: "/admin/dashboard/categories", icon: FolderOpen },
  { name: "Enquiries", href: "/admin/dashboard/enquiries", icon: Mail },
  { name: "CMS Content", href: "/admin/dashboard/content", icon: Edit },
  { name: "Contact Specs", href: "/admin/dashboard/contact", icon: PhoneCall },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
        router.refresh();
      } else {
        toast.error("Logout failed. Try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Network error");
    }
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white text-slate-800 flex flex-col h-screen sticky top-0 z-30 shrink-0">
      
      {/* Sidebar Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 bg-white">
        <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white">
          <Activity className="w-4 h-4" />
        </div>
        <span className="font-bold text-base text-slate-900 tracking-tight">
          Reckron <span className="text-slate-500 font-medium">Console</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-4 py-2.5 rounded text-sm font-semibold transition-colors group ${
                isActive
                  ? "bg-black text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-black"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`} />
                <span>{link.name}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "text-white opacity-100" : ""}`} />
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 text-rose-500" />
          <span>Exit Console</span>
        </button>
      </div>

    </aside>
  );
}
