import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/mongodb";
import { UPLOAD_ROOT } from "@/lib/cases";
import { sendUploadCaseEmails } from "@/lib/notify";

function safeName(name: string) {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(-150) || "file";
}

async function saveFiles(caseDir: string, files: File[], kind: string) {
  const saved: { kind: string; name: string; size: number; type: string; storedAs: string }[] = [];
  for (const file of files) {
    const storedAs = `${kind}-${randomUUID()}-${safeName(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(caseDir, storedAs), buffer);
    saved.push({ kind, name: file.name, size: file.size, type: file.type, storedAs });
  }
  return saved;
}

// Map the restoration items selected in the online RX form onto the legacy
// case `type` the admin dashboard filters by, so existing reads keep working.
const ITEM_TO_TYPE: Record<string, string> = {
  layered: "crown",
  fcz: "crown",
  emax: "crown",
  gold: "crown",
  provisional: "temp",
  waxup: "waxup",
  icrown: "implant",
  abutment: "implant",
  fullarch: "arch",
  itemp: "implant",
  models: "crown",
  nightguard: "crown",
  tray: "crown",
};
// Higher wins when several items are selected.
const TYPE_PRIORITY: Record<string, number> = { arch: 5, implant: 4, waxup: 3, temp: 2, crown: 1 };

const ITEM_LABELS: Record<string, string> = {
  layered: "Zirconia (layered)",
  fcz: "Full contour zirconia",
  emax: "Lithium disilicate",
  gold: "Gold crown",
  provisional: "Provisional",
  waxup: "Digital diagnostic wax-up",
  icrown: "Implant crown",
  abutment: "Custom abutment",
  fullarch: "Full arch / All-on-X",
  itemp: "Implant temporary",
  models: "Model printing",
  nightguard: "Night guard",
  tray: "Custom tray",
};

function deriveType(items: string[]): string {
  let best = "";
  let bestScore = 0;
  for (const item of items) {
    const t = ITEM_TO_TYPE[item];
    if (!t) continue;
    const score = TYPE_PRIORITY[t] || 0;
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  return best;
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const formData = await req.formData();
  const field = (name: string) => String(formData.get(name) || "").trim();
  const bool = (name: string) => {
    const v = field(name);
    return v === "on" || v === "true" || v === "yes";
  };
  const list = (name: string) =>
    formData
      .getAll(name)
      .map((v) => String(v).trim())
      .filter(Boolean);

  const scans = formData.getAll("scans").filter((f): f is File => f instanceof File);
  const rx = formData.getAll("rx").filter((f): f is File => f instanceof File);
  const photos = formData.getAll("photos").filter((f): f is File => f instanceof File);

  const delivery = field("delivery");
  // A digital case must include at least one scan. Shipped / drop-off cases
  // arrive physically, so no file is required.
  if (delivery === "digital" && scans.length === 0) {
    return NextResponse.json({ error: "A digital case needs at least one scan file." }, { status: 400 });
  }

  const items = list("items");
  const itemLabels = items.map((i) => ITEM_LABELS[i] || i);

  const caseId = randomUUID();
  const caseDir = path.join(UPLOAD_ROOT, caseId);
  await mkdir(caseDir, { recursive: true });

  const files = [
    ...(await saveFiles(caseDir, scans, "scans")),
    ...(await saveFiles(caseDir, rx, "rx")),
    ...(await saveFiles(caseDir, photos, "photos")),
  ];

  const record = {
    caseId,
    type: deriveType(items),
    option: itemLabels.join(", "),
    shade: field("shade"),
    timing: field("needBy"),
    doctor: field("doctor"),
    practice: field("practice"),
    email: field("email"),
    phone: field("phone"),
    patient: field("patient"),
    teeth: field("teeth"),
    due: field("due"),
    scanner: field("scanner"),
    notes: field("notes"),
    consent: bool("consent"),
    files,
    status: "received",
    createdAt: new Date(),

    // Extended online RX form fields.
    license: field("license"),
    items,
    itemLabels,
    alloy: field("alloy"),
    implantSystem: field("implantSystem"),
    access: field("access"),
    cement: field("cement"),
    abutMat: field("abutMat"),
    labParts: bool("labParts"),
    stump: field("stump"),
    customShade: bool("customShade"),
    photosFlag: bool("photosFlag"),
    delivery,
    box: list("box"),
    needBy: field("needBy"),
    signature: field("signature"),
    warranty: bool("warranty"),
  };

  try {
    const db = await getDb();
    await db.collection("caseUploads").insertOne(record);
  } catch {
    // Files are already safely on disk even if Mongo isn't configured yet;
    // don't fail the upload just because metadata couldn't be recorded.
  }

  try {
    await sendUploadCaseEmails(record);
  } catch (err) {
    console.error("[upload-case] failed to send case emails", err);
  }

  return NextResponse.json({ ok: true, caseId });
}
