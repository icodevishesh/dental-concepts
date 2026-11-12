"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, RefreshCw, Trash2 } from "lucide-react";

interface RxSubmission {
  _id: string;
  doctorName: string;
  licenseNumber: string;
  doctorPhone: string;
  practiceEmail: string;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  category: string;
  restorations: string[];
  goldAlloy: string;
  implants: string[];
  implantCementation: string;
  implantHole: string;
  implantSystem: string;
  otherServices: string[];
  teeth: number[];
  shade: string;
  stumpShade: string;
  digitalScan: boolean;
  customShade: boolean;
  photosSent: boolean;
  instructions: string;
  enclosed: string[];
  delivery: string;
  dueDate: string;
  signature: string;
  agreeWarranty: boolean;
  createdAt: string;
}

interface RxSubmissionsResponse {
  submissions: RxSubmission[];
  total: number;
  page: number;
  totalPages: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  crown: "Crowns & restorations",
  impl: "Implants",
  other: "Other services",
};

export default function AdminRxSubmissionsPage() {
  const [data, setData] = useState<RxSubmissionsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/rx-submissions?page=${targetPage}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch RX submissions");
      const json: RxSubmissionsResponse = await res.json();
      setData(json);
      setPage(json.page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error loading RX submissions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    fetchSubmissions(1);
  }, [fetchSubmissions]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this RX submission?")) return;
    try {
      const res = await fetch(`/api/admin/rx-submissions/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete");
      toast.success("RX submission deleted");
      fetchSubmissions(page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting RX submission");
    }
  };

  const submissions = data?.submissions ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="!text-lg font-semibold text-gray-900 !mb-2">RX Forms</h2>
          <p className="!text-sm text-gray-500">Laboratory prescriptions submitted from the online RX form.</p>
        </div>
        <button
          onClick={() => fetchSubmissions(page)}
          disabled={isLoading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg !text-xs transition-all cursor-pointer flex items-center gap-1.5 border-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          title="Refetch RX submissions from the database"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-3 border-blue-default border-t-transparent rounded-full animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-semibold">No RX submissions yet.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-gray-700">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Doctor / Practice</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Teeth</th>
                  <th className="py-3 px-4">Due</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((s) => {
                  const isExpanded = expandedId === s._id;
                  const categoryLabel = CATEGORY_LABELS[s.category] ?? s.category;
                  const restoSummary = [...s.restorations, ...s.implants, ...s.otherServices].filter(Boolean).join(", ");
                  return (
                    <Fragment key={s._id}>
                      <tr className="hover:bg-gray-50 transition-colors align-top">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900 leading-tight">{s.doctorName}</div>
                          <div className="text-xs text-gray-500 mt-1">{s.practiceEmail}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{s.doctorPhone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600">
                          <div className="font-semibold text-gray-900">{s.patientName}</div>
                          <div className="text-gray-500 mt-0.5">{s.patientPhone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600">
                          <div className="font-semibold text-gray-900">{categoryLabel}</div>
                          {restoSummary && <div className="text-gray-500 mt-0.5 line-clamp-2 max-w-xs">{restoSummary}</div>}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600">
                          {s.teeth.length ? `#${s.teeth.join(", #")}` : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600 whitespace-nowrap">
                          {s.dueDate ? new Date(s.dueDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : s._id)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-2.5 py-1 font-semibold border-none cursor-pointer inline-flex items-center gap-1"
                            >
                              View {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => handleDelete(s._id)}
                              className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="py-4 px-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-gray-600">
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">License number</div>
                                {s.licenseNumber || "—"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Appointment date</div>
                                {s.appointmentDate || "—"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Shade / stump shade</div>
                                {s.shade || "—"} / {s.stumpShade || "—"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Gold alloy</div>
                                {s.goldAlloy || "—"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Implant cementation / access</div>
                                {s.implantCementation || "—"} / {s.implantHole || "—"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Implant system</div>
                                {s.implantSystem || "—"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Digital scan / custom shade / photos sent</div>
                                {s.digitalScan ? "Yes" : "No"} / {s.customShade ? "Yes" : "No"} / {s.photosSent ? "Yes" : "No"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Enclosed with the case</div>
                                {s.enclosed.join(", ") || "—"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Delivery</div>
                                {s.delivery || "—"}
                              </div>
                              <div className="sm:col-span-2 lg:col-span-3">
                                <div className="font-semibold text-gray-900 mb-1">Instructions for the technician</div>
                                <div className="whitespace-pre-wrap">{s.instructions || "—"}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Signature</div>
                                {s.signature || "—"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 mb-1">Warranty agreed</div>
                                {s.agreeWarranty ? "Yes" : "No"}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="!text-xs text-gray-500">
              Page {page} of {totalPages} &middot; {data?.total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchSubmissions(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchSubmissions(page + 1)}
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
