import { getDb } from "@/lib/mongodb";
import type { ObjectId } from "mongodb";

export type BlogCategory =
  | "Working with the lab"
  | "Custom shades"
  | "Crowns & veneers";

export interface BlogDoc {
  _id?: ObjectId;
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  coverImage: string;
  coverImageAlt: string;
  readTime: string;
  publishedAt: string; // ISO date, e.g. "2026-10-05"
  body: string; // HTML string rendered into the article body
  createdAt: Date;
  updatedAt: Date;
}

export type BlogSummary = Pick<
  BlogDoc,
  | "slug"
  | "title"
  | "description"
  | "category"
  | "coverImage"
  | "coverImageAlt"
  | "readTime"
  | "publishedAt"
>;

const COLLECTION = "blogs";

export async function getAllBlogs(): Promise<BlogSummary[]> {
  const db = await getDb();
  const docs = await db
    .collection<BlogDoc>(COLLECTION)
    .find(
      {},
      {
        projection: {
          slug: 1,
          title: 1,
          description: 1,
          category: 1,
          coverImage: 1,
          coverImageAlt: 1,
          readTime: 1,
          publishedAt: 1,
        },
      }
    )
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map((d) => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
    category: d.category,
    coverImage: d.coverImage,
    coverImageAlt: d.coverImageAlt,
    readTime: d.readTime,
    publishedAt: d.publishedAt,
  }));
}

export async function getBlogBySlug(slug: string): Promise<BlogDoc | null> {
  const db = await getDb();
  return db.collection<BlogDoc>(COLLECTION).findOne({ slug });
}

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
