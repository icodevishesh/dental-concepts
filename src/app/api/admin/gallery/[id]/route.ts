import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { deleteGalleryImage } from "@/lib/gallery";
import { getCloudinaryClient } from "@/lib/integrations/cloudinary";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const doc = await deleteGalleryImage(id);
  if (!doc) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  try {
    const cloudinary = await getCloudinaryClient();
    await cloudinary.uploader.destroy(doc.publicId);
  } catch (err) {
    console.error("Failed to destroy Cloudinary asset:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true });
}
