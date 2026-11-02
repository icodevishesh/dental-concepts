import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/mongodb";
import { UPLOAD_ROOT } from "@/lib/cases";

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

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const formData = await req.formData();
  const field = (name: string) => String(formData.get(name) || "").trim();

  const scans = formData.getAll("scans").filter((f): f is File => f instanceof File);
  const rx = formData.getAll("rx").filter((f): f is File => f instanceof File);
  const photos = formData.getAll("photos").filter((f): f is File => f instanceof File);

  if (scans.length === 0 || rx.length === 0) {
    return NextResponse.json({ error: "At least one scan file and the RX form are required." }, { status: 400 });
  }

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
    type: field("type"),
    option: field("option"),
    shade: field("shade"),
    timing: field("timing"),
    doctor: field("doctor"),
    practice: field("practice"),
    email: field("email"),
    phone: field("phone"),
    patient: field("patient"),
    teeth: field("teeth"),
    due: field("due"),
    scanner: field("scanner"),
    notes: field("notes"),
    consent: field("consent") === "on" || field("consent") === "true",
    files,
    status: "received",
    createdAt: new Date(),
  };

  try {
    const db = await getDb();
    await db.collection("caseUploads").insertOne(record);
  } catch {
    // Files are already safely on disk even if Mongo isn't configured yet;
    // don't fail the upload just because metadata couldn't be recorded.
  }

  return NextResponse.json({ ok: true, caseId });
}
