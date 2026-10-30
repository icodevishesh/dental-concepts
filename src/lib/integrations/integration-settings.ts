import { getDb } from "@/lib/mongodb";
import { decrypt, encrypt } from "./encryption";

export type IntegrationName = "ups" | "cloudinary";

export type ConnectionStatus = "not_configured" | "not_tested" | "connected" | "failed";

export interface IntegrationSettingsDoc {
  integration: IntegrationName;
  credentials: Record<string, string>; // encrypted values keyed by field name
  settings: Record<string, string>; // non-secret config, e.g. { environment: "sandbox" }
  isEnabled: boolean;
  connectionStatus: ConnectionStatus;
  lastTestedAt: Date | null;
  lastError: string | null;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationPublicView {
  integration: IntegrationName;
  isEnabled: boolean;
  connectionStatus: ConnectionStatus;
  lastTestedAt: Date | null;
  lastError: string | null;
  settings: Record<string, string>;
  credentialFields: Record<string, boolean>; // field name -> is a value saved
  updatedAt: Date | null;
}

// Which credential fields are secret (encrypted) per integration. Everything
// else an integration needs goes in `settings` (non-secret, stored as-is).
export const SECRET_FIELDS: Record<IntegrationName, string[]> = {
  ups: ["clientId", "clientSecret", "accountNumber"],
  cloudinary: ["apiKey", "apiSecret"],
};

const COLLECTION = "integrationSettings";

let indexEnsured = false;
async function ensureIndex() {
  if (indexEnsured) return;
  const db = await getDb();
  await db.collection<IntegrationSettingsDoc>(COLLECTION).createIndex({ integration: 1 }, { unique: true });
  indexEnsured = true;
}

async function getDoc(name: IntegrationName): Promise<IntegrationSettingsDoc | null> {
  const db = await getDb();
  return db.collection<IntegrationSettingsDoc>(COLLECTION).findOne({ integration: name });
}

export async function getPublicIntegrationView(name: IntegrationName): Promise<IntegrationPublicView> {
  const doc = await getDoc(name);
  const credentialFields: Record<string, boolean> = {};
  for (const field of SECRET_FIELDS[name]) {
    credentialFields[field] = Boolean(doc?.credentials?.[field]);
  }
  return {
    integration: name,
    isEnabled: doc?.isEnabled ?? false,
    connectionStatus: doc?.connectionStatus ?? "not_configured",
    lastTestedAt: doc?.lastTestedAt ?? null,
    lastError: doc?.lastError ?? null,
    settings: doc?.settings ?? {},
    credentialFields,
    updatedAt: doc?.updatedAt ?? null,
  };
}

/**
 * Server-only: decrypts and returns the integration's credentials for use by
 * the UPS/Cloudinary service modules. Never call this from an API route
 * response path — the result must stay on the server.
 */
export async function getDecryptedCredentials(
  name: IntegrationName
): Promise<{ credentials: Record<string, string>; settings: Record<string, string>; isEnabled: boolean } | null> {
  const doc = await getDoc(name);
  if (!doc) return null;
  const credentials: Record<string, string> = {};
  for (const field of SECRET_FIELDS[name]) {
    const value = doc.credentials?.[field];
    if (value) credentials[field] = decrypt(value);
  }
  return { credentials, settings: doc.settings ?? {}, isEnabled: doc.isEnabled };
}

export interface UpsertIntegrationInput {
  credentials?: Record<string, string | undefined>;
  settings?: Record<string, string | undefined>;
  isEnabled?: boolean;
}

/**
 * Creates or updates an integration's configuration. Blank/undefined secret
 * fields are dropped before the merge, so they never overwrite a previously
 * saved credential — admins can edit just the environment dropdown, for
 * example, without re-entering every secret.
 */
export async function upsertIntegration(
  name: IntegrationName,
  input: UpsertIntegrationInput,
  actor: string
): Promise<{ changedFields: string[] }> {
  await ensureIndex();
  const db = await getDb();
  const existing = await getDoc(name);
  const now = new Date();
  const changedFields: string[] = [];

  const nextCredentials: Record<string, string> = { ...(existing?.credentials ?? {}) };
  for (const field of SECRET_FIELDS[name]) {
    const raw = input.credentials?.[field];
    if (typeof raw === "string" && raw.trim() !== "") {
      nextCredentials[field] = encrypt(raw);
      changedFields.push(field);
    }
    // blank/missing -> retain existing encrypted value untouched
  }

  const nextSettings: Record<string, string> = { ...(existing?.settings ?? {}) };
  for (const [key, value] of Object.entries(input.settings ?? {})) {
    if (typeof value === "string") {
      if (nextSettings[key] !== value) changedFields.push(key);
      nextSettings[key] = value;
    }
  }

  const nextIsEnabled = input.isEnabled ?? existing?.isEnabled ?? false;
  if (existing && existing.isEnabled !== nextIsEnabled) changedFields.push("isEnabled");

  await db.collection<IntegrationSettingsDoc>(COLLECTION).updateOne(
    { integration: name },
    {
      $set: {
        integration: name,
        credentials: nextCredentials,
        settings: nextSettings,
        isEnabled: nextIsEnabled,
        connectionStatus: existing?.connectionStatus ?? "not_tested",
        lastTestedAt: existing?.lastTestedAt ?? null,
        lastError: existing?.lastError ?? null,
        updatedBy: actor,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  return { changedFields };
}

export async function setEnabled(name: IntegrationName, isEnabled: boolean, actor: string): Promise<void> {
  await ensureIndex();
  const db = await getDb();
  await db.collection<IntegrationSettingsDoc>(COLLECTION).updateOne(
    { integration: name },
    { $set: { isEnabled, updatedBy: actor, updatedAt: new Date() } }
  );
}

export async function setConnectionStatus(
  name: IntegrationName,
  status: ConnectionStatus,
  error: string | null
): Promise<void> {
  const db = await getDb();
  await db.collection<IntegrationSettingsDoc>(COLLECTION).updateOne(
    { integration: name },
    { $set: { connectionStatus: status, lastTestedAt: new Date(), lastError: error } }
  );
}
