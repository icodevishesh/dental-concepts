import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getCloudinaryClient, IntegrationNotConfiguredError, IntegrationDisabledError } from "@/lib/integrations/cloudinary";

export async function POST(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const cloudinary = await getCloudinaryClient();
    const result = await cloudinary.uploader.upload(base64, {
      folder: "dental-concepts/blog",
    });
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    if (err instanceof IntegrationNotConfiguredError || err instanceof IntegrationDisabledError) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Set it up from Settings → Integrations." },
        { status: 503 }
      );
    }
    console.error("Image upload failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Image upload failed" }, { status: 502 });
  }
}
