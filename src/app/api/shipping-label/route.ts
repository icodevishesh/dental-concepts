import { NextRequest, NextResponse } from "next/server";
import {
  createUpsShipment,
  IntegrationDisabledError,
  IntegrationNotConfiguredError,
  UpsAuthError,
  UpsShipmentError,
} from "@/lib/integrations/ups";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const direction = body.direction === "return" ? "return" : body.direction === "new" ? "new" : null;
  const doctor = typeof body.doctor === "string" ? body.doctor.trim() : "";
  const practice = typeof body.practice === "string" ? body.practice.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const addressLine = typeof body.addressLine === "string" ? body.addressLine.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const zip = typeof body.zip === "string" ? body.zip.trim() : "";
  const weightLbs = Number(body.weightLbs);

  if (!direction) return NextResponse.json({ error: "Shipment direction is required" }, { status: 400 });
  if (!doctor) return NextResponse.json({ error: "Doctor name is required" }, { status: 400 });
  if (!practice) return NextResponse.json({ error: "Practice name is required" }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "Phone is required" }, { status: 400 });
  if (!addressLine) return NextResponse.json({ error: "Address is required" }, { status: 400 });
  if (!city) return NextResponse.json({ error: "City is required" }, { status: 400 });
  if (!state) return NextResponse.json({ error: "State is required" }, { status: 400 });
  if (!zip) return NextResponse.json({ error: "ZIP code is required" }, { status: 400 });
  if (!weightLbs || weightLbs <= 0) return NextResponse.json({ error: "Package weight is required" }, { status: 400 });

  try {
    const { trackingNumber, labelBase64 } = await createUpsShipment({
      direction,
      weightLbs,
      practiceAddress: {
        name: practice,
        attentionName: doctor,
        phone,
        addressLine,
        city,
        stateProvinceCode: state,
        postalCode: zip,
      },
    });
    return NextResponse.json({ ok: true, trackingNumber, labelBase64 });
  } catch (err) {
    if (err instanceof IntegrationNotConfiguredError) {
      return NextResponse.json({ error: "Shipping labels aren't available right now. Please call the lab." }, { status: 503 });
    }
    if (err instanceof IntegrationDisabledError) {
      return NextResponse.json({ error: "Shipping labels aren't available right now. Please call the lab." }, { status: 503 });
    }
    if (err instanceof UpsAuthError || err instanceof UpsShipmentError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    console.error("Shipping label request failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Unexpected error creating the shipping label." }, { status: 500 });
  }
}
