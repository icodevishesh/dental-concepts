import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { deleteTestimonial, updateTestimonial, validateTestimonialInput } from "@/lib/testimonials";

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

  const { input, error } = validateTestimonialInput(body);
  if (error || !input) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const ok = await updateTestimonial(id, input);
  if (!ok) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const ok = await deleteTestimonial(id);
  if (!ok) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
