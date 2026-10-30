import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { setConnectionStatus, type IntegrationName } from "@/lib/integrations/integration-settings";
import { recordAuditLog } from "@/lib/integrations/audit-log";
import { testUpsConnection } from "@/lib/integrations/ups";
import { testCloudinaryConnection } from "@/lib/integrations/cloudinary";

const VALID_NAMES: IntegrationName[] = ["ups", "cloudinary"];

function isValidName(name: string): name is IntegrationName {
  return (VALID_NAMES as string[]).includes(name);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { name } = await params;
  if (!isValidName(name)) {
    return NextResponse.json({ error: "Unknown integration" }, { status: 404 });
  }

  const result = name === "ups" ? await testUpsConnection() : await testCloudinaryConnection();

  await setConnectionStatus(name, result.ok ? "connected" : "failed", result.ok ? null : result.message);
  await recordAuditLog(name, "test", session.username);

  return NextResponse.json(result);
}
