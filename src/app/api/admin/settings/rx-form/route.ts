import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getCloudinaryClient, IntegrationNotConfiguredError, IntegrationDisabledError } from "@/lib/integrations/cloudinary";
import { getRxFormSetting, setActiveRxForm } from "@/lib/site-settings";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const setting = await getRxFormSetting();
  return NextResponse.json({
    fileUrl: setting?.fileUrl || "/assets/digital-rx.pdf",
    originalFilename: setting?.originalFilename || null,
    updatedAt: setting?.updatedAt || null,
  });
}

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
      folder: "dental-concepts/rx-form",
      resource_type: "auto",
      use_filename: true,
    });

    await setActiveRxForm(result.secure_url, file.name);

    return NextResponse.json({ ok: true, fileUrl: result.secure_url });
  } catch (err) {
    if (err instanceof IntegrationNotConfiguredError || err instanceof IntegrationDisabledError) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Set it up from Settings → Integrations first." },
        { status: 503 }
      );
    }
    console.error("RX form upload failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }
}
