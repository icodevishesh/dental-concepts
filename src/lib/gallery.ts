import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface GalleryImageDoc {
  _id?: ObjectId;
  url: string;
  publicId: string;
  alt: string;
  createdAt: Date;
}

export interface GalleryImageInput {
  url: string;
  publicId: string;
  alt: string;
}

const COLLECTION = "gallery";

export async function getAllGalleryImages(): Promise<GalleryImageDoc[]> {
  const db = await getDb();
  return db.collection<GalleryImageDoc>(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
}

export async function getLatestGalleryImages(limit: number): Promise<GalleryImageDoc[]> {
  const db = await getDb();
  return db.collection<GalleryImageDoc>(COLLECTION).find({}).sort({ createdAt: -1 }).limit(limit).toArray();
}

export interface GetGalleryImagesPagedResult {
  images: GalleryImageDoc[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getGalleryImagesPaged(page: number, perPage: number): Promise<GetGalleryImagesPagedResult> {
  const db = await getDb();
  const collection = db.collection<GalleryImageDoc>(COLLECTION);
  const total = await collection.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const images = await collection
    .find({})
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * perPage)
    .limit(perPage)
    .toArray();
  return { images, total, page: safePage, totalPages };
}

export async function createGalleryImage(input: GalleryImageInput): Promise<GalleryImageDoc> {
  const db = await getDb();
  const doc: GalleryImageDoc = {
    url: input.url,
    publicId: input.publicId,
    alt: input.alt,
    createdAt: new Date(),
  };
  const result = await db.collection<GalleryImageDoc>(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function deleteGalleryImage(id: string): Promise<GalleryImageDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection<GalleryImageDoc>(COLLECTION).findOneAndDelete({ _id: new ObjectId(id) });
  return doc;
}

export function validateGalleryImageInput(
  body: Record<string, unknown>
): { input?: GalleryImageInput; error?: string } {
  const { url, publicId, alt } = body;

  if (!url || typeof url !== "string") return { error: "Image URL is required" };
  if (!publicId || typeof publicId !== "string") return { error: "Image publicId is required" };
  if (!alt || typeof alt !== "string") return { error: "Alt text is required" };

  return { input: { url, publicId, alt } };
}
