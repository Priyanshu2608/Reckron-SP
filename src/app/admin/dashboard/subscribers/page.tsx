"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Loader2, Download, Users, MailOpen } from "lucide-react";
import { toast } from "@/hooks/useToast";
import { formatDate } from "@/lib/utils";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      } else {
        toast.error("Failed to load subscribers");
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the subscriber list?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Subscriber removed successfully");
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error("Failed to delete subscriber");
      }
    } catch (err) {
      console.error("Delete subscriber error:", err);
      toast.error("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  const exportToCSV = () => {
    if (subscribers.length === 0) {
      toast.error("No subscribers to export");
      return;
    }

    const headers = ["Email", "Subscription Date"];
    const rows = subscribers.map((s) => [
      s.email,
      new Date(s.createdAt).toISOString()
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported CSV successfully!");
  };

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 fade-in-up text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Newsletter Subscribers</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            Manage users subscribed to your email campaigns
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={loading || subscribers.length === 0}
          className="px-4 py-2 rounded bg-black hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{subscribers.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <MailOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filtered Count</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{filteredSubscribers.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded p-1.5 flex items-center">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Filter subscribers by email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-2 pr-2 py-1 bg-transparent border-none text-slate-800 text-sm focus:outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Subscribers Grid List */}
      <div className="bg-white border border-slate-200 rounded p-6">
        {loading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading subscriber list...
          </div>
        ) : filteredSubscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Subscribed Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub._id} className="text-slate-700 hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">{sub.email}</td>
                    <td className="py-3 text-xs text-slate-500">{formatDate(sub.createdAt)}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(sub._id, sub.email)}
                        disabled={deletingId === sub._id}
                        className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-40"
                        title="Remove Subscriber"
                      >
                        {deletingId === sub._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500 text-sm border border-dashed border-slate-200 rounded">
            No active subscribers found.
          </div>
        )}
      </div>
    </div>
  );
}
