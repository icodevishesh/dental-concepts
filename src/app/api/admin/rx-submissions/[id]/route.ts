import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { deleteRxSubmission } from "@/lib/rx-submissions";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const ok = await deleteRxSubmission(id);
  if (!ok) {
    return NextResponse.json({ error: "RX submission not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
