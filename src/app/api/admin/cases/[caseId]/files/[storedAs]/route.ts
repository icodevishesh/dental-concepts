import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { findCaseFileForDownload } from "@/lib/cases";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ caseId: string; storedAs: string }> }
) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { caseId, storedAs } = await params;
  const file = await findCaseFileForDownload(caseId, storedAs);
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    await stat(file.absolutePath);
  } catch {
    return NextResponse.json({ error: "File missing on disk" }, { status: 404 });
  }

  const nodeStream = createReadStream(file.absolutePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;
  const safeName = file.name.replace(/[\r\n"]/g, "");

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "Content-Length": String(file.size),
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    },
  });
}
