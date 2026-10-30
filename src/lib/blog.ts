import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

export interface BlogInput {
  title: string;
  description: string;
  category: BlogCategory;
  coverImage?: string;
  coverImageAlt?: string;
  readTime?: string;
  publishedAt?: string;
  body: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Working with the lab",
  "Custom shades",
  "Crowns & veneers",
];

export function validateBlogInput(
  body: Record<string, unknown>
): { input?: BlogInput; error?: string } {
  const { title, description, category, coverImage, coverImageAlt, readTime, publishedAt, body: html } = body;

  if (!title || typeof title !== "string") return { error: "Title is required" };
  if (!description || typeof description !== "string") return { error: "Description is required" };
  if (!category || !BLOG_CATEGORIES.includes(category as BlogCategory)) {
    return { error: "A valid category is required" };
  }
  if (!html || typeof html !== "string") return { error: "Article content is required" };

  return {
    input: {
      title,
      description,
      category: category as BlogCategory,
      coverImage: typeof coverImage === "string" ? coverImage : undefined,
      coverImageAlt: typeof coverImageAlt === "string" ? coverImageAlt : undefined,
      readTime: typeof readTime === "string" ? readTime : undefined,
      publishedAt: typeof publishedAt === "string" ? publishedAt : undefined,
      body: html,
    },
  };
}

export async function getAllBlogsAdmin(): Promise<BlogDoc[]> {
  const db = await getDb();
  return db.collection<BlogDoc>(COLLECTION).find({}).sort({ publishedAt: -1 }).toArray();
}

export async function getBlogByIdAdmin(id: string): Promise<BlogDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<BlogDoc>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function createBlog(input: BlogInput): Promise<{ id: string; slug: string }> {
  const db = await getDb();
  const now = new Date();
  const slug = await uniqueSlug(slugify(input.title));

  const doc: BlogDoc = {
    slug,
    title: input.title,
    description: input.description,
    category: input.category,
    coverImage: input.coverImage || "/assets/products/crowns-veneers.webp",
    coverImageAlt: input.coverImageAlt || "",
    readTime: input.readTime || "3 min read",
    publishedAt: input.publishedAt || now.toISOString().slice(0, 10),
    body: input.body,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection<BlogDoc>(COLLECTION).insertOne(doc);
  return { id: result.insertedId.toString(), slug };
}

export async function updateBlogById(id: string, input: BlogInput): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<BlogDoc>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: input.title,
        description: input.description,
        category: input.category,
        coverImage: input.coverImage || "/assets/products/crowns-veneers.webp",
        coverImageAlt: input.coverImageAlt || "",
        readTime: input.readTime || "3 min read",
        publishedAt: input.publishedAt || new Date().toISOString().slice(0, 10),
        body: input.body,
        updatedAt: new Date(),
      },
    }
  );
  return result.matchedCount > 0;
}

export async function deleteBlogById(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<BlogDoc>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

async function uniqueSlug(base: string): Promise<string> {
  const db = await getDb();
  let candidate = base;
  let suffix = 1;
  while (await db.collection<BlogDoc>(COLLECTION).findOne({ slug: candidate })) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}

function slugify(s: string): string {
  return categorySlug(s);
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
