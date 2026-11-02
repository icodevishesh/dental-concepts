import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { createGuide, getGuidesPaged, validateGuideInput } from "@/lib/guides";

const PER_PAGE = 5;

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  const { guides, total, totalPages } = await getGuidesPaged(page, PER_PAGE);

  return NextResponse.json({
    guides: guides.map((g) => ({ ...g, _id: g._id?.toString() })),
    total,
    page,
    totalPages,
    perPage: PER_PAGE,
  });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

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

  const { id } = await createGuide(input);
  return NextResponse.json({ ok: true, id });
}
