import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getPublicIntegrationView, type IntegrationName } from "@/lib/integrations/integration-settings";

const INTEGRATIONS: IntegrationName[] = ["ups", "cloudinary"];

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const views = await Promise.all(INTEGRATIONS.map((name) => getPublicIntegrationView(name)));
  return NextResponse.json(views);
}
