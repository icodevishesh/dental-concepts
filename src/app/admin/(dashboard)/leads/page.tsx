"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, RefreshCw, Trash2 } from "lucide-react";

interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  practice: string;
  email: string;
  phone: string;
  topic: string;
  preference: string;
  source: string;
  message: string;
  createdAt: string;
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminLeadsPage() {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?page=${targetPage}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch leads");
      const json: LeadsResponse = await res.json();
      setData(json);
      setPage(json.page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error loading leads");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    fetchLeads(1);
  }, [fetchLeads]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Lead deleted");
      fetchLeads(page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting lead");
    }
  };

  const leads = data?.leads ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="!text-lg font-semibold text-gray-900 !mb-2">Leads</h2>
          <p className="!text-sm text-gray-500">Contact inquiries submitted from the website.</p>
        </div>
        <button
          onClick={() => fetchLeads(page)}
          disabled={isLoading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg !text-xs transition-all cursor-pointer flex items-center gap-1.5 border-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          title="Refetch leads from the database"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-3 border-blue-default border-t-transparent rounded-full animate-spin" />
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-semibold">No leads yet.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-gray-700">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Practice</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors align-top">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 leading-tight">
                        {lead.firstName} {lead.lastName}
                      </div>
                      {lead.source && <div className="text-xs text-gray-500 mt-1">via {lead.source}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600">{lead.practice || "—"}</td>
                    <td className="py-3.5 px-4 text-xs text-gray-600">
                      <div>{lead.email}</div>
                      {lead.phone && <div className="text-gray-400 mt-0.5">{lead.phone}</div>}
                      {lead.preference && <div className="text-gray-400 mt-0.5">Prefers {lead.preference.toLowerCase()}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600">{lead.topic}</td>
                    <td className="py-3.5 px-4 text-xs text-gray-500 max-w-xs">
                      <div className="line-clamp-2">{lead.message}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="!text-xs text-gray-500">
              Page {page} of {totalPages} &middot; {data?.total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLeads(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchLeads(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
