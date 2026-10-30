import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface GuideDoc {
  _id?: ObjectId;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  href: string;
  publishedAt: string; // ISO date, e.g. "2026-10-05"
  createdAt: Date;
  updatedAt: Date;
}

export interface GuideInput {
  title: string;
  description: string;
  category: string;
  coverImage?: string;
  coverImageAlt?: string;
  href: string;
  publishedAt?: string;
}

const COLLECTION = "guides";

export async function getAllGuides(): Promise<GuideDoc[]> {
  const db = await getDb();
  return db.collection<GuideDoc>(COLLECTION).find({}).sort({ publishedAt: -1 }).toArray();
}

export async function getGuideById(id: string): Promise<GuideDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<GuideDoc>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function createGuide(input: GuideInput): Promise<{ id: string }> {
  const db = await getDb();
  const now = new Date();
  const doc: GuideDoc = {
    title: input.title,
    description: input.description,
    category: input.category,
    coverImage: input.coverImage || "",
    coverImageAlt: input.coverImageAlt || "",
    href: input.href,
    publishedAt: input.publishedAt || now.toISOString().slice(0, 10),
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<GuideDoc>(COLLECTION).insertOne(doc);
  return { id: result.insertedId.toString() };
}

export async function updateGuide(id: string, input: GuideInput): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<GuideDoc>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: input.title,
        description: input.description,
        category: input.category,
        coverImage: input.coverImage || "",
        coverImageAlt: input.coverImageAlt || "",
        href: input.href,
        publishedAt: input.publishedAt || new Date().toISOString().slice(0, 10),
        updatedAt: new Date(),
      },
    }
  );
  return result.matchedCount > 0;
}

export async function deleteGuide(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<GuideDoc>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export function validateGuideInput(
  body: Record<string, unknown>
): { input?: GuideInput; error?: string } {
  const { title, description, category, coverImage, coverImageAlt, href, publishedAt } = body;

  if (!title || typeof title !== "string") return { error: "Title is required" };
  if (!description || typeof description !== "string") return { error: "Description is required" };
  if (!category || typeof category !== "string") return { error: "Category is required" };
  if (!href || typeof href !== "string") return { error: "Link is required" };

  return {
    input: {
      title,
      description,
      category,
      href,
      coverImage: typeof coverImage === "string" ? coverImage : undefined,
      coverImageAlt: typeof coverImageAlt === "string" ? coverImageAlt : undefined,
      publishedAt: typeof publishedAt === "string" ? publishedAt : undefined,
    },
  };
}
