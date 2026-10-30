import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  getPublicIntegrationView,
  setEnabled,
  upsertIntegration,
  type IntegrationName,
} from "@/lib/integrations/integration-settings";
import { recordAuditLog } from "@/lib/integrations/audit-log";

const VALID_NAMES: IntegrationName[] = ["ups", "cloudinary"];

function isValidName(name: string): name is IntegrationName {
  return (VALID_NAMES as string[]).includes(name);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { name } = await params;
  if (!isValidName(name)) {
    return NextResponse.json({ error: "Unknown integration" }, { status: 404 });
  }

  return NextResponse.json(await getPublicIntegrationView(name));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { name } = await params;
  if (!isValidName(name)) {
    return NextResponse.json({ error: "Unknown integration" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const credentials = (body.credentials && typeof body.credentials === "object" ? body.credentials : {}) as Record<
    string,
    string | undefined
  >;
  const settings = (body.settings && typeof body.settings === "object" ? body.settings : {}) as Record<
    string,
    string | undefined
  >;
  const isEnabled = typeof body.isEnabled === "boolean" ? body.isEnabled : undefined;

  if (name === "ups") {
    if (settings.environment && settings.environment !== "sandbox" && settings.environment !== "production") {
      return NextResponse.json({ error: "UPS environment must be 'sandbox' or 'production'" }, { status: 400 });
    }
  }

  if (name === "cloudinary") {
    if (settings.cloudName !== undefined && !settings.cloudName.trim()) {
      return NextResponse.json({ error: "Cloudinary cloud name cannot be blank" }, { status: 400 });
    }
  }

  try {
    const { changedFields } = await upsertIntegration(name, { credentials, settings, isEnabled }, session.username);
    await recordAuditLog(name, "update", session.username, changedFields);
    return NextResponse.json(await getPublicIntegrationView(name));
  } catch (err) {
    console.error(`Failed to save ${name} integration:`, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Failed to save integration configuration" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const session = await requireAdminSession(req);
  if (session instanceof NextResponse) return session;

  const { name } = await params;
  if (!isValidName(name)) {
    return NextResponse.json({ error: "Unknown integration" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body.isEnabled !== "boolean") {
    return NextResponse.json({ error: "isEnabled (boolean) is required" }, { status: 400 });
  }

  await setEnabled(name, body.isEnabled, session.username);
  await recordAuditLog(name, body.isEnabled ? "enable" : "disable", session.username);
  return NextResponse.json(await getPublicIntegrationView(name));
}
