import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface LeadDoc {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  practice: string;
  email: string;
  phone: string;
  topic: string;
  preference: string;
  source: string;
  message: string;
  recipient: string;
  createdAt: Date;
}

export interface LeadInput {
  firstName: string;
  lastName: string;
  practice: string;
  email: string;
  phone?: string;
  topic: string;
  preference?: string;
  source?: string;
  message: string;
  recipient?: string;
}

const COLLECTION = "leads";

export async function createLead(input: LeadInput): Promise<{ id: string }> {
  const db = await getDb();
  const doc: LeadDoc = {
    firstName: input.firstName,
    lastName: input.lastName,
    practice: input.practice,
    email: input.email,
    phone: input.phone || "",
    topic: input.topic,
    preference: input.preference || "",
    source: input.source || "",
    message: input.message,
    recipient: input.recipient || "",
    createdAt: new Date(),
  };
  const result = await db.collection<LeadDoc>(COLLECTION).insertOne(doc);
  return { id: result.insertedId.toString() };
}

export async function deleteLead(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<LeadDoc>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export interface GetLeadsResult {
  leads: LeadDoc[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getLeads(page: number, perPage: number): Promise<GetLeadsResult> {
  const db = await getDb();
  const collection = db.collection<LeadDoc>(COLLECTION);
  const total = await collection.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const leads = await collection
    .find({})
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * perPage)
    .limit(perPage)
    .toArray();
  return { leads, total, page: safePage, totalPages };
}

export function validateLeadInput(body: Record<string, unknown>): { input?: LeadInput; error?: string } {
  const { firstName, lastName, practice, email, phone, topic, preference, source, message, recipient } = body;

  if (!firstName || typeof firstName !== "string") return { error: "First name is required" };
  if (!lastName || typeof lastName !== "string") return { error: "Last name is required" };
  if (!practice || typeof practice !== "string") return { error: "Practice name is required" };
  if (!email || typeof email !== "string") return { error: "Email is required" };
  if (!topic || typeof topic !== "string") return { error: "Topic is required" };
  if (!message || typeof message !== "string") return { error: "Message is required" };

  return {
    input: {
      firstName,
      lastName,
      practice,
      email,
      phone: typeof phone === "string" ? phone : undefined,
      topic,
      preference: typeof preference === "string" ? preference : undefined,
      source: typeof source === "string" ? source : undefined,
      message,
      recipient: typeof recipient === "string" ? recipient : undefined,
    },
  };
}
