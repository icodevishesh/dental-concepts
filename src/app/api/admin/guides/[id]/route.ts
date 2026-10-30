import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { deleteGuide, updateGuide, validateGuideInput } from "@/lib/guides";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { input, error } = validateGuideInput(body);
  if (error || !input) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const ok = await updateGuide(id, input);
  if (!ok) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const ok = await deleteGuide(id);
  if (!ok) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
