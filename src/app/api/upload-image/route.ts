import { NextRequest, NextResponse } from "next/server";
import { getCloudinary, cloudinaryIsConfigured } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const given = req.headers.get("x-admin-password");
  if (adminPassword && given !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!cloudinaryIsConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Add CLOUDINARY_* vars to .env.local." },
      { status: 503 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const cloudinary = getCloudinary();
  const result = await cloudinary.uploader.upload(base64, {
    folder: "dental-concepts/blog",
  });

  return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
}
