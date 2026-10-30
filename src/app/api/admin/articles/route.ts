import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { createBlog, getAllBlogsAdmin, validateBlogInput } from "@/lib/blog";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const articles = await getAllBlogsAdmin();
  return NextResponse.json(articles.map((a) => ({ ...a, _id: a._id?.toString() })));
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

  const { input, error } = validateBlogInput(body);
  if (error || !input) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const { id, slug } = await createBlog(input);
  return NextResponse.json({ ok: true, id, slug });
}
