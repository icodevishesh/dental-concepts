import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getLeads } from "@/lib/leads";

const PER_PAGE = 10;

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  const { leads, total, totalPages } = await getLeads(page, PER_PAGE);

  return NextResponse.json({
    leads: leads.map((l) => ({ ...l, _id: l._id?.toString() })),
    total,
    page,
    totalPages,
    perPage: PER_PAGE,
  });
}
