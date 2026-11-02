import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { deleteCase } from "@/lib/cases";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ caseId: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { caseId } = await params;
  const ok = await deleteCase(caseId);
  if (!ok) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
