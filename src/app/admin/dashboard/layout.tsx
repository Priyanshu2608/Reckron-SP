import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const revalidate = 0;

interface IDashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: IDashboardLayoutProps) {
  // 1. Perform authorization checks (secure Node.js server environment)
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  // 2. Pre-connect database for dashboard pages
  await connectToDatabase();

  return (
    <div className="flex w-full min-h-screen bg-slate-100">
      {/* Sidebar navigation */}
      <AdminSidebar />

      {/* Main dashboard content container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <AdminHeader username={session.username} />

        {/* Inner Scroll Container */}
        <main className="flex-1 overflow-y-auto p-8 text-left bg-slate-50">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
