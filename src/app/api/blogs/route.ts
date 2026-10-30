import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { BlogDoc } from "@/lib/blog";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection<BlogDoc>("blogs")
    .find({})
    .sort({ publishedAt: -1 })
    .toArray();
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const given = req.headers.get("x-admin-password");
  if (adminPassword && given !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, category, coverImage, coverImageAlt, readTime, publishedAt, html } = body;

  if (!title || !description || !category || !html) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(title);
  const now = new Date();

  const fields = {
    slug,
    title,
    description,
    category,
    coverImage: coverImage || "/assets/products/crowns-veneers.webp",
    coverImageAlt: coverImageAlt || "",
    readTime: readTime || "3 min read",
    publishedAt: publishedAt || now.toISOString().slice(0, 10),
    body: html,
    updatedAt: now,
  };

  const db = await getDb();
  await db.collection<BlogDoc>("blogs").updateOne(
    { slug },
    { $set: fields, $setOnInsert: { createdAt: now } },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, slug });
}
