import { getDecryptedCredentials } from "./integration-settings";

export class IntegrationNotConfiguredError extends Error {}
export class IntegrationDisabledError extends Error {}
export class UpsAuthError extends Error {}
export class UpsShipmentError extends Error {}

// The lab's own address — used as Shipper on every shipment, and as
// ShipFrom/ShipTo depending on shipment direction (see createUpsShipment).
const LAB_SHIPPER = {
  name: "Dental Concepts",
  attentionName: "Dental Concepts Lab",
  phone: "8007005227",
  addressLine: "244 9th Street",
  city: "San Francisco",
  stateProvinceCode: "CA",
  postalCode: "94103",
  countryCode: "US",
};

export interface UpsConfig {
  clientId: string;
  clientSecret: string;
  accountNumber: string;
  environment: "sandbox" | "production";
}

/**
 * Resolves UPS credentials from the database first. Only falls back to
 * process.env.UPS_* when no database configuration has been saved yet
 * (first-run migration grace period — remove the env vars once an admin has
 * saved working credentials from /admin/settings/integrations).
 */
export async function getUpsConfig(): Promise<UpsConfig> {
  const stored = await getDecryptedCredentials("ups");

  if (stored) {
    if (!stored.isEnabled) {
      throw new IntegrationDisabledError("The UPS integration is disabled.");
    }
    const { clientId, clientSecret, accountNumber } = stored.credentials;
    const environment = (stored.settings.environment === "production" ? "production" : "sandbox") as
      | "sandbox"
      | "production";
    if (!clientId || !clientSecret || !accountNumber) {
      throw new IntegrationNotConfiguredError("UPS integration is missing required credentials.");
    }
    return { clientId, clientSecret, accountNumber, environment };
  }

  const clientId = process.env.UPS_CLIENT_ID;
  const clientSecret = process.env.UPS_CLIENT_SECRET;
  const accountNumber = process.env.UPS_ACCOUNT_NUMBER;
  const environment = process.env.UPS_ENV === "production" ? "production" : "sandbox";
  if (!clientId || !clientSecret || !accountNumber) {
    throw new IntegrationNotConfiguredError("UPS integration is not configured.");
  }
  return { clientId, clientSecret, accountNumber, environment };
}

function getUpsBaseUrl(environment: UpsConfig["environment"]): string {
  return environment === "production" ? "https://onlinetools.ups.com" : "https://wwwcie.ups.com";
}

/** OAuth client-credentials token fetch. Does not call any shipping/label/rate endpoint. */
export async function getUpsAccessToken(): Promise<string> {
  const config = await getUpsConfig();
  const baseUrl = getUpsBaseUrl(config.environment);
  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/security/v1/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: "grant_type=client_credentials",
    });
  } catch {
    throw new UpsAuthError("Could not reach the UPS API. Check your network connection and try again.");
  }

  if (!res.ok) {
    throw new UpsAuthError(`UPS authentication failed (HTTP ${res.status}). Check the client ID and secret.`);
  }

  const data: { access_token?: string } = await res.json();
  if (!data.access_token) {
    throw new UpsAuthError("UPS did not return an access token.");
  }
  return data.access_token;
}

export interface UpsAddress {
  name: string;
  attentionName?: string;
  phone: string;
  addressLine: string;
  city: string;
  stateProvinceCode: string;
  postalCode: string;
  countryCode?: string;
}

export interface CreateUpsShipmentInput {
  /** "new" = case going from the practice to the lab. "return" = work going from the lab back to the practice. */
  direction: "new" | "return";
  practiceAddress: UpsAddress;
  weightLbs: number;
}

export interface CreateUpsShipmentResult {
  trackingNumber: string;
  labelBase64: string;
}

function toUpsParty(addr: UpsAddress) {
  return {
    Name: addr.name,
    AttentionName: addr.attentionName || addr.name,
    Phone: { Number: addr.phone.replace(/[^0-9]/g, "") },
    Address: {
      AddressLine: addr.addressLine,
      City: addr.city,
      StateProvinceCode: addr.stateProvinceCode,
      PostalCode: addr.postalCode,
      CountryCode: addr.countryCode || "US",
    },
  };
}

/** Creates a UPS Ground shipment and returns its tracking number and base64 PDF label. */
export async function createUpsShipment(input: CreateUpsShipmentInput): Promise<CreateUpsShipmentResult> {
  const config = await getUpsConfig();
  const token = await getUpsAccessToken();
  const baseUrl = getUpsBaseUrl(config.environment);

  const lab = toUpsParty({ ...LAB_SHIPPER, phone: LAB_SHIPPER.phone });
  const practice = toUpsParty(input.practiceAddress);
  const shipFrom = input.direction === "new" ? practice : lab;
  const shipTo = input.direction === "new" ? lab : practice;

  const body = {
    ShipmentRequest: {
      Request: { RequestOption: "nonvalidate" },
      Shipment: {
        Shipper: { ...lab, ShipperNumber: config.accountNumber },
        ShipFrom: shipFrom,
        ShipTo: shipTo,
        Service: { Code: "03", Description: "Ground" },
        Package: [
          {
            Packaging: { Code: "02", Description: "Customer Supplied Package" },
            PackageWeight: {
              UnitOfMeasurement: { Code: "LBS" },
              Weight: String(input.weightLbs),
            },
          },
        ],
        PaymentInformation: {
          ShipmentCharge: [{ Type: "01", BillShipper: { AccountNumber: config.accountNumber } }],
        },
      },
      LabelSpecification: {
        LabelImageFormat: { Code: "PDF" },
      },
    },
  };

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/shipments/v2409/ship`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new UpsShipmentError("Could not reach the UPS API. Check your network connection and try again.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const upsMessage = data?.response?.errors?.[0]?.message;
    throw new UpsShipmentError(upsMessage || `UPS rejected the shipment request (HTTP ${res.status}).`);
  }

  const packageResult = data?.ShipmentResponse?.ShipmentResults?.PackageResults;
  const pkg = Array.isArray(packageResult) ? packageResult[0] : packageResult;
  const trackingNumber = pkg?.TrackingNumber;
  const labelBase64 = pkg?.ShippingLabel?.GraphicImage;

  if (!trackingNumber || !labelBase64) {
    throw new UpsShipmentError("UPS did not return a label for this shipment.");
  }

  return { trackingNumber, labelBase64 };
}

export async function testUpsConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    await getUpsAccessToken();
    return { ok: true, message: "Connected to UPS successfully." };
  } catch (err) {
    if (err instanceof IntegrationNotConfiguredError) {
      return { ok: false, message: "UPS is not configured yet." };
    }
    if (err instanceof IntegrationDisabledError) {
      return { ok: false, message: "The UPS integration is disabled." };
    }
    if (err instanceof UpsAuthError) {
      return { ok: false, message: err.message };
    }
    console.error("UPS test connection failed:", err instanceof Error ? err.message : err);
    return { ok: false, message: "Unexpected error while testing the UPS connection." };
  }
}
