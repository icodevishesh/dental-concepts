import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getCaseStats } from "@/lib/cases";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const stats = await getCaseStats(12);
  return NextResponse.json(stats);
}
