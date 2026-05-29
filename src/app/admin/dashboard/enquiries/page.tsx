"use client";

import { useEffect, useState } from "react";
import { Mail, Search, Eye, Trash2, Loader2, Check, Clock, User, Building, MapPin, MessageSquare, PhoneCall } from "lucide-react";
import { IEnquiry } from "@/models/Enquiry";
import Modal from "@/components/ui/Modal";
import { toast } from "@/hooks/useToast";
import { formatDate } from "@/lib/utils";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries");
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const openDetailsModal = (enq: IEnquiry) => {
    setSelectedEnquiry(enq);
    setModalOpen(true);
    // Automatically mark as 'reviewed' if it was 'pending'
    if (enq.status === "pending") {
      updateStatus(enq._id as any, "reviewed");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        // Update local state
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: updated.status } : e))
        );
        // If currently viewed modal is this enquiry, update details
        if (selectedEnquiry?._id === id) {
          setSelectedEnquiry((prev: any) => (prev ? { ...prev, status: updated.status } : null));
        }
        toast.success(`Enquiry status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this enquiry log?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Enquiry deleted successfully");
        setModalOpen(false);
        loadEnquiries();
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      console.error("Delete enquiry error:", err);
      toast.error("Network error");
    }
  };

  // Filter logic
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (e.companyName && e.companyName.toLowerCase().includes(search.toLowerCase())) ||
      e.product.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 fade-in-up text-left">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Product Enquiries</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Review global therapeutic stock requests</p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-slate-200 p-4 rounded">

        {/* Search */}
        <div className="relative flex-1 w-full flex items-center border border-slate-200 bg-white rounded px-3 py-1.5">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by client name, company, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-slate-800 text-sm focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Status filter */}
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 bg-white rounded text-sm focus:outline-none text-slate-700"
          >
            <option value="all">All Enquiries</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Enquiries Grid list */}
      <div className="bg-white border border-slate-200 rounded p-6">
        {loading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading enquiries...
          </div>
        ) : filteredEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <th className="pb-3">Client Name</th>
                  <th className="pb-3">Product / Brand</th>
                  <th className="pb-3">Logged Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq._id as any} className="text-slate-700">

                    {/* Name */}
                    <td className="py-3 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        {enq.fullName}
                        <span className="block text-[10px] font-normal text-slate-500 mt-0.5">{enq.companyName || "No Company"}</span>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-3 font-semibold text-slate-800">{enq.product}</td>

                    {/* Date */}
                    <td className="py-3 text-xs text-slate-500">{formatDate(enq.createdAt)}</td>

                    {/* Status */}
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${enq.status === "pending"
                            ? "bg-slate-100 border-slate-300 text-slate-700"
                            : enq.status === "reviewed"
                              ? "bg-slate-50 border-slate-200 text-slate-600"
                              : "bg-black border-black text-white"
                          }`}
                      >
                        {enq.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openDetailsModal(enq)}
                          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(enq._id as any)}
                          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Log"
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
            No stock enquiries matching filters found.
          </div>
        )}
      </div>

      {/* Details Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Enquiry Specification Card"
        size="md"
      >
        {selectedEnquiry && (
          <div className="space-y-6 text-left">

            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-xs text-slate-400 font-bold">{formatDate(selectedEnquiry.createdAt)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus(selectedEnquiry._id as any, "resolved")}
                  disabled={selectedEnquiry.status === "resolved"}
                  className="px-3 py-1 bg-black hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Resolve
                </button>
                <button
                  onClick={() => handleDelete(selectedEnquiry._id as any)}
                  className="p-1.5 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Name</span>
                  <p className="font-bold text-sm text-slate-900">{selectedEnquiry.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Name</span>
                  <p className="font-bold text-sm text-slate-900">{selectedEnquiry.companyName || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                  <p className="text-sm font-semibold text-slate-800 underline">
                    <a href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PhoneCall className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</span>
                  <p className="text-sm font-semibold text-slate-700">{selectedEnquiry.phoneNumber || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                  <p className="text-sm font-semibold text-slate-700">
                    {selectedEnquiry.city ? `${selectedEnquiry.city}, ` : ""}
                    {selectedEnquiry.country || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brand Enquired</span>
                  <p className="text-sm font-bold text-slate-800">{selectedEnquiry.product}</p>
                </div>
              </div>
            </div>

            {/* Message Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Message Body</span>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedEnquiry.message}</p>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
