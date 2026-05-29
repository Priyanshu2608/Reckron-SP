"use client";

import Link from "next/link";
import { User, Eye } from "lucide-react";

interface IAdminHeaderProps {
  username: string;
}

export default function AdminHeader({ username }: IAdminHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-20">
      
      {/* Title info */}
      <div className="flex items-center gap-4 text-left">
        <h2 className="font-bold text-slate-900 text-base">Reckron Control Center</h2>
        <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-semibold tracking-wider">
          v1.0.0
        </span>
      </div>

      {/* Action group */}
      <div className="flex items-center gap-4">
        {/* View live site button */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View Live Site
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* User profile capsule */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded">
          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-semibold text-slate-800">
            {username}
          </span>
        </div>
      </div>

    </header>
  );
}
