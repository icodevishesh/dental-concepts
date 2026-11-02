"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FolderOpen,
  FileStack,
  Scan,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Trash2,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CASE_TYPES = ["crown", "implant", "arch", "temp", "waxup"] as const;
type CaseType = (typeof CASE_TYPES)[number];

const CASE_TYPE_LABELS: Record<CaseType, string> = {
  crown: "Crown or veneer",
  implant: "Implant restoration",
  arch: "Full arch / All-on-X",
  temp: "Temporaries",
  waxup: "Digital wax up",
};

const FILE_KIND_LABELS: Record<string, string> = {
  scans: "Scan files",
  rx: "RX form",
  photos: "Shade photos",
};

function fileKindIcon(kind: string) {
  if (kind === "scans") return Scan;
  if (kind === "rx") return FileText;
  if (kind === "photos") return ImageIcon;
  return Paperclip;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(1)} ${units[i]}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

interface CaseFile {
  kind: string;
  name: string;
  size: number;
  type: string;
  storedAs: string;
}

interface CaseRecord {
  _id: string;
  caseId: string;
  type: string;
  option: string;
  shade: string;
  timing: string;
  doctor: string;
  practice: string;
  email: string;
  phone: string;
  patient: string;
  teeth: string;
  due: string;
  scanner: string;
  notes: string;
  files: CaseFile[];
  status: string;
  createdAt: string;
}

interface CasesResponse {
  cases: CaseRecord[];
  total: number;
  page: number;
  totalPages: number;
}

interface MonthlyCaseCount {
  month: string;
  count: number;
}

interface CaseStats {
  totalCases: number;
  totalFiles: number;
  monthly: MonthlyCaseCount[];
}

interface Filters {
  type: CaseType | "all";
  from: string;
  to: string;
}

const EMPTY_FILTERS: Filters = { type: "all", from: "", to: "" };

export default function AdminCasesPage() {
  const [data, setData] = useState<CasesResponse | null>(null);
  const [stats, setStats] = useState<CaseStats | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const fetchCases = useCallback(async (targetPage: number, targetFilters: Filters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(targetPage) });
      if (targetFilters.type !== "all") params.set("type", targetFilters.type);
      if (targetFilters.from) params.set("from", targetFilters.from);
      if (targetFilters.to) params.set("to", targetFilters.to);

      const res = await fetch(`/api/admin/cases?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch cases");
      const json: CasesResponse = await res.json();
      setData(json);
      setPage(json.page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error loading cases");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const res = await fetch("/api/admin/cases/stats", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      setStats(await res.json());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error loading case stats");
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    fetchCases(1, EMPTY_FILTERS);
    fetchStats();
  }, [fetchCases, fetchStats]);

  const applyFilters = (next: Filters) => {
    setFilters(next);
    fetchCases(1, next);
  };

  const handleRefresh = () => {
    fetchCases(page, filters);
    fetchStats();
  };

  const handleDelete = async (caseId: string) => {
    if (!confirm("Delete this case? This also permanently removes its uploaded files.")) return;
    try {
      const res = await fetch(`/api/admin/cases/${caseId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Case deleted");
      fetchCases(page, filters);
      fetchStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting case");
    }
  };

  const cases = data?.cases ?? [];
  const totalPages = data?.totalPages ?? 1;
  const chartData = (stats?.monthly ?? []).map((m) => ({ ...m, label: monthLabel(m.month) }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="!text-lg font-semibold text-gray-900 !mb-2">Cases</h2>
          <p className="!text-sm text-gray-500">All cases submitted through the upload page, with attached files.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading || isStatsLoading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg !text-xs transition-all cursor-pointer flex items-center gap-1.5 border-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          title="Refetch cases from the database"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading || isStatsLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_200px_1fr] gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <FolderOpen className="w-4 h-4" />
            <span className="!text-xs font-semibold uppercase tracking-wider">Total cases</span>
          </div>
          <div className="!text-3xl font-semibold text-gray-900 mt-3 tabular-nums">
            {isStatsLoading ? "…" : (stats?.totalCases ?? 0)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <FileStack className="w-4 h-4" />
            <span className="!text-xs font-semibold uppercase tracking-wider">Files uploaded</span>
          </div>
          <div className="!text-3xl font-semibold text-gray-900 mt-3 tabular-nums">
            {isStatsLoading ? "…" : (stats?.totalFiles ?? 0)}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="!text-xs font-semibold uppercase tracking-wider text-gray-500">Cases per month</span>
          <div className="mt-2" style={{ height: 180 }}>
            {isStatsLoading ? (
              <div className="h-full flex items-center justify-center">
                <span className="w-6 h-6 border-3 border-blue-default border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#e1e0d9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#898781" }} axisLine={{ stroke: "#e1e0d9" }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#898781" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    cursor={{ fill: "rgba(37,99,235,0.08)" }}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    labelFormatter={(label) => `${label}`}
                    formatter={(value) => [`${value} cases`, ""]}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => applyFilters({ ...filters, type: "all" })}
            className={`rounded-full px-3 py-1.5 !text-xs font-semibold border cursor-pointer transition-colors ${
              filters.type === "all" ? "bg-blue-default !text-white border-blue-default" : "bg-white text-gray-700 border-gray-300 hover:border-blue-default/50"
            }`}
          >
            All
          </button>
          {CASE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => applyFilters({ ...filters, type: t })}
              className={`rounded-full px-3 py-1.5 !text-xs font-semibold border cursor-pointer transition-colors ${
                filters.type === t ? "bg-blue-default !text-white border-blue-default" : "bg-white text-gray-700 border-gray-300 hover:border-blue-default/50"
              }`}
            >
              {CASE_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2 ml-auto">
          <label className="block">
            <span className="block !text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">From</span>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => applyFilters({ ...filters, from: e.target.value })}
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 !text-xs focus:border-blue-default outline-none"
            />
          </label>
          <label className="block">
            <span className="block !text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">To</span>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => applyFilters({ ...filters, to: e.target.value })}
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 !text-xs focus:border-blue-default outline-none"
            />
          </label>
          {(filters.type !== "all" || filters.from || filters.to) && (
            <button
              onClick={() => applyFilters(EMPTY_FILTERS)}
              className="bg-transparent hover:bg-gray-100 border-none text-blue-default font-semibold !text-xs cursor-pointer py-1.5 px-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-3 border-blue-default border-t-transparent rounded-full animate-spin" />
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-semibold">No cases match these filters.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-gray-700">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor / Practice</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Files</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map((c) => {
                  const isExpanded = expandedCaseId === c.caseId;
                  const typeLabel = CASE_TYPE_LABELS[c.type as CaseType] ?? c.type;
                  return (
                    <Fragment key={c.caseId}>
                      <tr className="hover:bg-gray-50 transition-colors align-top">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900 leading-tight">{c.patient || "—"}</div>
                          {c.teeth && <div className="text-xs text-gray-500 mt-1">Teeth {c.teeth}</div>}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600">
                          <div className="font-semibold text-gray-900">{c.doctor}</div>
                          <div className="text-gray-500 mt-0.5">{c.practice}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600">
                          <div className="font-semibold text-gray-900">{typeLabel}</div>
                          <div className="text-gray-500 mt-0.5">
                            {[c.option, c.shade, c.timing].filter(Boolean).join(" · ")}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <button
                            onClick={() => setExpandedCaseId(isExpanded ? null : c.caseId)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-2.5 py-1 font-semibold border-none cursor-pointer inline-flex items-center gap-1"
                          >
                            {c.files.length} {c.files.length === 1 ? "file" : "files"}
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <span className="bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5 text-gray-700 font-medium capitalize">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(c.caseId)}
                            className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="py-3 px-4">
                            <div className="flex flex-wrap gap-2">
                              {c.files.map((f) => {
                                const Icon = fileKindIcon(f.kind);
                                return (
                                  <a
                                    key={f.storedAs}
                                    href={`/api/admin/cases/${c.caseId}/files/${f.storedAs}`}
                                    download
                                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-default/50 transition-colors !text-gray-700 no-underline"
                                    title={f.name}
                                  >
                                    <Icon className="w-4 h-4 text-blue-default shrink-0" />
                                    <span className="flex flex-col">
                                      <span className="!text-xs font-semibold leading-tight">{FILE_KIND_LABELS[f.kind] ?? f.kind}</span>
                                      <span className="!text-[10px] text-gray-500 leading-tight truncate max-w-[180px]">{f.name}</span>
                                      <span className="!text-[10px] text-gray-400 leading-tight">{formatBytes(f.size)}</span>
                                    </span>
                                  </a>
                                );
                              })}
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
                onClick={() => fetchCases(page - 1, filters)}
                disabled={page <= 1}
                className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchCases(page + 1, filters)}
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
