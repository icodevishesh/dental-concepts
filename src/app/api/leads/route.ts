import { NextRequest, NextResponse } from "next/server";
import { createLead, validateLeadInput } from "@/lib/leads";

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

  try {
    const { id } = await createLead(input);
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Could not save the inquiry" }, { status: 500 });
  }
}
