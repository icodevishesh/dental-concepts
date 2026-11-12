import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getRxSubmissions } from "@/lib/rx-submissions";

const PER_PAGE = 10;

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  const { submissions, total, totalPages } = await getRxSubmissions(page, PER_PAGE);

  return NextResponse.json({
    submissions: submissions.map((s) => ({ ...s, _id: s._id?.toString() })),
    total,
    page,
    totalPages,
    perPage: PER_PAGE,
  });
}
