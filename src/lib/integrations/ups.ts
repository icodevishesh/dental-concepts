import { getDecryptedCredentials } from "./integration-settings";

export class IntegrationNotConfiguredError extends Error {}
export class IntegrationDisabledError extends Error {}
export class UpsAuthError extends Error {}

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
