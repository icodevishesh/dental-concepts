import { getDb } from "@/lib/mongodb";
import type { IntegrationName } from "./integration-settings";

export type AuditAction = "create" | "update" | "enable" | "disable" | "test";

export interface IntegrationAuditLogDoc {
  integration: IntegrationName;
  action: AuditAction;
  actor: string;
  changedFields: string[];
  timestamp: Date;
}

const COLLECTION = "integrationAuditLogs";

/** Records who changed what on an integration, never the values themselves. */
export async function recordAuditLog(
  integration: IntegrationName,
  action: AuditAction,
  actor: string,
  changedFields: string[] = []
): Promise<void> {
  const db = await getDb();
  await db.collection<IntegrationAuditLogDoc>(COLLECTION).insertOne({
    integration,
    action,
    actor,
    changedFields,
    timestamp: new Date(),
  });
}

export async function getAuditLog(integration: IntegrationName, limit = 20): Promise<IntegrationAuditLogDoc[]> {
  const db = await getDb();
  return db
    .collection<IntegrationAuditLogDoc>(COLLECTION)
    .find({ integration })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
}
