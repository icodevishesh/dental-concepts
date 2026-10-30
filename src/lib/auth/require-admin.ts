import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

export interface AdminSession {
  username: string;
}

/**
 * Validates the admin session cookie for API route handlers. Returns the
 * session on success, or a 401 NextResponse to return directly otherwise.
 * (middleware.ts handles the page-level redirect; routes need JSON, not a
 * redirect, so they check the cookie themselves too.)
 */
export async function requireAdminSession(
  req: NextRequest
): Promise<AdminSession | NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { username: payload.sub };
}
