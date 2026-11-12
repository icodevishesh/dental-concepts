import { NextRequest, NextResponse } from "next/server";
import { createRxSubmission, validateRxSubmissionInput } from "@/lib/rx-submissions";

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

  try {
    const { id } = await createRxSubmission(input);
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Could not save the RX form" }, { status: 500 });
  }
}
