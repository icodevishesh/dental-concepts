import { NextRequest, NextResponse } from "next/server";
import { createRxSubmission, validateRxSubmissionInput } from "@/lib/rx-submissions";
import { sendRxFormEmails } from "@/lib/notify";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { input, error } = validateRxSubmissionInput(body);
  if (error || !input) {
    return NextResponse.json({ error }, { status: 400 });
  }

  let id: string;
  try {
    ({ id } = await createRxSubmission(input));
  } catch {
    return NextResponse.json({ error: "Could not save the RX form" }, { status: 500 });
  }

  try {
    await sendRxFormEmails(input);
  } catch (err) {
    console.error("[rx-form] failed to send RX form emails", err);
  }

  return NextResponse.json({ ok: true, id });
}
