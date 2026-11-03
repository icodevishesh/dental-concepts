import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface TestimonialDoc {
  _id?: ObjectId;
  name: string;
  practice: string;
  quote: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialInput {
  name: string;
  practice: string;
  quote: string;
}

const COLLECTION = "testimonials";

export async function getAllTestimonials(): Promise<TestimonialDoc[]> {
  const db = await getDb();
  return db.collection<TestimonialDoc>(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
}

export interface GetTestimonialsPagedResult {
  testimonials: TestimonialDoc[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getTestimonialsPaged(page: number, perPage: number): Promise<GetTestimonialsPagedResult> {
  const db = await getDb();
  const collection = db.collection<TestimonialDoc>(COLLECTION);
  const total = await collection.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const testimonials = await collection
    .find({})
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * perPage)
    .limit(perPage)
    .toArray();
  return { testimonials, total, page: safePage, totalPages };
}

export async function createTestimonial(input: TestimonialInput): Promise<{ id: string }> {
  const db = await getDb();
  const now = new Date();
  const doc: TestimonialDoc = {
    name: input.name,
    practice: input.practice,
    quote: input.quote,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<TestimonialDoc>(COLLECTION).insertOne(doc);
  return { id: result.insertedId.toString() };
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<TestimonialDoc>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name: input.name,
        practice: input.practice,
        quote: input.quote,
        updatedAt: new Date(),
      },
    }
  );
  return result.matchedCount > 0;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<TestimonialDoc>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export function validateTestimonialInput(
  body: Record<string, unknown>
): { input?: TestimonialInput; error?: string } {
  const { name, practice, quote } = body;

  if (!name || typeof name !== "string") return { error: "Name is required" };
  if (!practice || typeof practice !== "string") return { error: "Practice is required" };
  if (!quote || typeof quote !== "string") return { error: "Quote is required" };

  return { input: { name, practice, quote } };
}
