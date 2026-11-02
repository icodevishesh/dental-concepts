import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import path from "path";
import { rm } from "fs/promises";

export interface CaseFileDoc {
  kind: string; // "scans" | "rx" | "photos"
  name: string;
  size: number;
  type: string;
  storedAs: string;
}

export interface CaseUploadDoc {
  _id?: ObjectId;
  caseId: string;
  type: string; // "crown" | "implant" | "arch" | "temp" | "waxup"
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
  consent: boolean;
  files: CaseFileDoc[];
  status: string;
  createdAt: Date;
}

export const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export const CASE_TYPES = ["crown", "implant", "arch", "temp", "waxup"] as const;
export type CaseType = (typeof CASE_TYPES)[number];

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  crown: "Crown or veneer",
  implant: "Implant restoration",
  arch: "Full arch / All-on-X",
  temp: "Temporaries",
  waxup: "Digital wax up",
};

const COLLECTION = "caseUploads";

let indexesEnsured = false;
async function ensureIndexes(): Promise<void> {
  if (indexesEnsured) return;
  const db = await getDb();
  const collection = db.collection<CaseUploadDoc>(COLLECTION);
  await Promise.all([
    collection.createIndex({ createdAt: -1 }),
    collection.createIndex({ type: 1, createdAt: -1 }),
    collection.createIndex({ caseId: 1 }, { unique: true }),
  ]);
  indexesEnsured = true;
}

export interface CaseFilters {
  type?: CaseType;
  from?: Date;
  to?: Date;
}

export interface GetCasesPagedResult {
  cases: CaseUploadDoc[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getCasesPaged(
  page: number,
  perPage: number,
  filters: CaseFilters = {}
): Promise<GetCasesPagedResult> {
  await ensureIndexes();
  const db = await getDb();
  const collection = db.collection<CaseUploadDoc>(COLLECTION);

  const match: Record<string, unknown> = {};
  if (filters.type) match.type = filters.type;
  if (filters.from || filters.to) {
    const range: Record<string, Date> = {};
    if (filters.from) range.$gte = filters.from;
    if (filters.to) range.$lte = filters.to;
    match.createdAt = range;
  }

  const total = await collection.countDocuments(match);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const cases = await collection
    .find(match)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * perPage)
    .limit(perPage)
    .toArray();

  return { cases, total, page: safePage, totalPages };
}

export interface MonthlyCaseCount {
  month: string; // "YYYY-MM"
  count: number;
}

export interface CaseStats {
  totalCases: number;
  totalFiles: number;
  monthly: MonthlyCaseCount[];
}

interface CaseStatsFacetResult {
  totals: { totalCases: number; totalFiles: number }[];
  monthly: { _id: string; count: number }[];
}

export async function getCaseStats(monthsBack = 12): Promise<CaseStats> {
  await ensureIndexes();
  const db = await getDb();
  const collection = db.collection<CaseUploadDoc>(COLLECTION);

  const since = new Date();
  since.setDate(1);
  since.setHours(0, 0, 0, 0);
  since.setMonth(since.getMonth() - (monthsBack - 1));

  const [result] = await collection
    .aggregate<CaseStatsFacetResult>([
      {
        $facet: {
          totals: [
            { $project: { fileCount: { $size: { $ifNull: ["$files", []] } } } },
            { $group: { _id: null, totalCases: { $sum: 1 }, totalFiles: { $sum: "$fileCount" } } },
          ],
          monthly: [
            { $match: { createdAt: { $gte: since } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ])
    .toArray();

  const totals = result?.totals[0] ?? { totalCases: 0, totalFiles: 0 };
  const byMonth = new Map((result?.monthly ?? []).map((m) => [m._id, m.count]));

  const monthly: MonthlyCaseCount[] = [];
  const cursor = new Date(since);
  for (let i = 0; i < monthsBack; i++) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    monthly.push({ month: key, count: byMonth.get(key) ?? 0 });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return { totalCases: totals.totalCases, totalFiles: totals.totalFiles, monthly };
}

export interface DownloadableFile {
  absolutePath: string;
  name: string;
  type: string;
  size: number;
}

export async function findCaseFileForDownload(
  caseId: string,
  storedAs: string
): Promise<DownloadableFile | null> {
  await ensureIndexes();
  const db = await getDb();
  const doc = await db
    .collection<CaseUploadDoc>(COLLECTION)
    .findOne({ caseId, "files.storedAs": storedAs }, { projection: { files: 1 } });
  if (!doc) return null;

  const file = doc.files.find((f) => f.storedAs === storedAs);
  if (!file) return null;

  const absolutePath = path.join(UPLOAD_ROOT, caseId, storedAs);
  const resolvedRoot = path.resolve(UPLOAD_ROOT) + path.sep;
  if (!path.resolve(absolutePath).startsWith(resolvedRoot)) return null;

  return { absolutePath, name: file.name, type: file.type, size: file.size };
}

export async function deleteCase(caseId: string): Promise<boolean> {
  await ensureIndexes();
  const db = await getDb();
  const result = await db.collection<CaseUploadDoc>(COLLECTION).deleteOne({ caseId });
  if (result.deletedCount === 0) return false;

  try {
    await rm(path.join(UPLOAD_ROOT, caseId), { recursive: true, force: true });
  } catch {
    // DB record is gone either way; leftover files on disk aren't fatal here.
  }

  return true;
}
