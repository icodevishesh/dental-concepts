import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface EventDoc {
  _id?: ObjectId;
  title: string;
  description: string;
  date: string; // ISO date, e.g. "2026-11-20"
  time: string;
  location: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventInput {
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  link?: string;
}

const COLLECTION = "events";

export async function getAllEvents(): Promise<EventDoc[]> {
  const db = await getDb();
  return db.collection<EventDoc>(COLLECTION).find({}).sort({ date: 1 }).toArray();
}

export async function getEventById(id: string): Promise<EventDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<EventDoc>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function createEvent(input: EventInput): Promise<{ id: string }> {
  const db = await getDb();
  const now = new Date();
  const doc: EventDoc = {
    title: input.title,
    description: input.description,
    date: input.date,
    time: input.time || "",
    location: input.location || "",
    link: input.link || "",
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<EventDoc>(COLLECTION).insertOne(doc);
  return { id: result.insertedId.toString() };
}

export async function updateEvent(id: string, input: EventInput): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<EventDoc>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: input.title,
        description: input.description,
        date: input.date,
        time: input.time || "",
        location: input.location || "",
        link: input.link || "",
        updatedAt: new Date(),
      },
    }
  );
  return result.matchedCount > 0;
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<EventDoc>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export function validateEventInput(
  body: Record<string, unknown>
): { input?: EventInput; error?: string } {
  const { title, description, date, time, location, link } = body;

  if (!title || typeof title !== "string") return { error: "Title is required" };
  if (!description || typeof description !== "string") return { error: "Description is required" };
  if (!date || typeof date !== "string") return { error: "Date is required" };

  return {
    input: {
      title,
      description,
      date,
      time: typeof time === "string" ? time : undefined,
      location: typeof location === "string" ? location : undefined,
      link: typeof link === "string" ? link : undefined,
    },
  };
}
