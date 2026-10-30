import { getDb } from "@/lib/mongodb";

export interface SiteSettingDoc {
  key: string;
  fileUrl: string;
  originalFilename: string;
  updatedAt: Date;
}

const COLLECTION = "siteSettings";
const RX_FORM_KEY = "rxForm";
const DEFAULT_RX_FORM_URL = "/assets/digital-rx.pdf";

export async function getActiveRxFormUrl(): Promise<string> {
  const db = await getDb();
  const doc = await db.collection<SiteSettingDoc>(COLLECTION).findOne({ key: RX_FORM_KEY });
  return doc?.fileUrl || DEFAULT_RX_FORM_URL;
}

export async function getRxFormSetting(): Promise<SiteSettingDoc | null> {
  const db = await getDb();
  return db.collection<SiteSettingDoc>(COLLECTION).findOne({ key: RX_FORM_KEY });
}

export async function setActiveRxForm(fileUrl: string, originalFilename: string): Promise<void> {
  const db = await getDb();
  await db.collection<SiteSettingDoc>(COLLECTION).updateOne(
    { key: RX_FORM_KEY },
    { $set: { key: RX_FORM_KEY, fileUrl, originalFilename, updatedAt: new Date() } },
    { upsert: true }
  );
}
