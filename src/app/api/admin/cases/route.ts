import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { CASE_TYPES, CaseType, getCasesPaged } from "@/lib/cases";

const PER_PAGE = 10;

function parseDate(value: string | null, endOfDay: boolean): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  if (endOfDay) date.setHours(23, 59, 59, 999);
  else date.setHours(0, 0, 0, 0);
  return date;
}

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const params = req.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);

  const typeParam = params.get("type");
  const type = CASE_TYPES.includes(typeParam as CaseType) ? (typeParam as CaseType) : undefined;

  const from = parseDate(params.get("from"), false);
  const to = parseDate(params.get("to"), true);

  const { cases, total, page: safePage, totalPages } = await getCasesPaged(page, PER_PAGE, {
    type,
    from,
    to,
  });

  return NextResponse.json({
    cases: cases.map((c) => ({ ...c, _id: c._id?.toString() })),
    total,
    page: safePage,
    totalPages,
    perPage: PER_PAGE,
  });
}
