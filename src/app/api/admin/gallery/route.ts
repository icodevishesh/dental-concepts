import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { createGalleryImage, getGalleryImagesPaged } from "@/lib/gallery";
import {
  getCloudinaryClient,
  IntegrationDisabledError,
  IntegrationNotConfiguredError,
} from "@/lib/integrations/cloudinary";

const PER_PAGE = 24;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  const { images, total, totalPages } = await getGalleryImagesPaged(page, PER_PAGE);

  return NextResponse.json({
    images: images.map((img) => ({ ...img, _id: img._id?.toString() })),
    total,
    page,
    totalPages,
    perPage: PER_PAGE,
  });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const formData = await req.formData();
  const file = formData.get("file");
  const alt = formData.get("alt");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const cloudinary = await getCloudinaryClient();
    const result = await cloudinary.uploader.upload(base64, {
      folder: "dental-concepts/gallery",
    });
    const doc = await createGalleryImage({
      url: result.secure_url,
      publicId: result.public_id,
      alt: typeof alt === "string" && alt.trim() ? alt.trim() : file.name,
    });
    return NextResponse.json({ ok: true, image: { ...doc, _id: doc._id?.toString() } });
  } catch (err) {
    if (err instanceof IntegrationNotConfiguredError || err instanceof IntegrationDisabledError) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Set it up from Settings → Integrations." },
        { status: 503 }
      );
    }
    console.error("Gallery image upload failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Image upload failed" }, { status: 502 });
  }
}
