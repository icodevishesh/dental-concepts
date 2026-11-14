import { NextRequest, NextResponse } from "next/server";
import { createLead, validateLeadInput } from "@/lib/leads";
import { sendContactInquiryEmails } from "@/lib/notify";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { input, error } = validateLeadInput(body);
  if (error || !input) {
    return NextResponse.json({ error }, { status: 400 });
  }

  let id: string;
  try {
    ({ id } = await createLead(input));
  } catch {
    return NextResponse.json({ error: "Could not save the inquiry" }, { status: 500 });
  }

  try {
    await sendContactInquiryEmails(input);
  } catch (err) {
    console.error("[leads] failed to send inquiry emails", err);
  }

  return NextResponse.json({ ok: true, id });
}
