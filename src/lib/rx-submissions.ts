import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export type RxCategory = "crown" | "impl" | "other";

export interface RxSubmissionDoc {
  _id?: ObjectId;
  doctorName: string;
  licenseNumber: string;
  doctorPhone: string;
  practiceEmail: string;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  category: RxCategory;
  restorations: string[];
  goldAlloy: string;
  implants: string[];
  implantCementation: string;
  implantHole: string;
  implantSystem: string;
  otherServices: string[];
  teeth: number[];
  shade: string;
  stumpShade: string;
  digitalScan: boolean;
  customShade: boolean;
  photosSent: boolean;
  instructions: string;
  enclosed: string[];
  delivery: string;
  dueDate: string;
  signature: string;
  agreeWarranty: boolean;
  recipient: string;
  createdAt: Date;
}

export interface RxSubmissionInput {
  doctorName: string;
  licenseNumber: string;
  doctorPhone: string;
  practiceEmail: string;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  category: RxCategory;
  restorations: string[];
  goldAlloy?: string;
  implants: string[];
  implantCementation?: string;
  implantHole?: string;
  implantSystem?: string;
  otherServices: string[];
  teeth: number[];
  shade: string;
  stumpShade: string;
  digitalScan?: boolean;
  customShade?: boolean;
  photosSent?: boolean;
  instructions: string;
  enclosed: string[];
  delivery: string;
  dueDate: string;
  signature: string;
  agreeWarranty: boolean;
  recipient?: string;
}

const COLLECTION = "rxSubmissions";
const CATEGORIES: RxCategory[] = ["crown", "impl", "other"];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((v) => typeof v === "number");
}

export async function createRxSubmission(input: RxSubmissionInput): Promise<{ id: string }> {
  const db = await getDb();
  const doc: RxSubmissionDoc = {
    doctorName: input.doctorName,
    licenseNumber: input.licenseNumber,
    doctorPhone: input.doctorPhone,
    practiceEmail: input.practiceEmail,
    patientName: input.patientName,
    patientPhone: input.patientPhone,
    appointmentDate: input.appointmentDate,
    category: input.category,
    restorations: input.restorations,
    goldAlloy: input.goldAlloy || "",
    implants: input.implants,
    implantCementation: input.implantCementation || "",
    implantHole: input.implantHole || "",
    implantSystem: input.implantSystem || "",
    otherServices: input.otherServices,
    teeth: input.teeth,
    shade: input.shade,
    stumpShade: input.stumpShade,
    digitalScan: Boolean(input.digitalScan),
    customShade: Boolean(input.customShade),
    photosSent: Boolean(input.photosSent),
    instructions: input.instructions,
    enclosed: input.enclosed,
    delivery: input.delivery,
    dueDate: input.dueDate,
    signature: input.signature,
    agreeWarranty: Boolean(input.agreeWarranty),
    recipient: input.recipient || "",
    createdAt: new Date(),
  };
  const result = await db.collection<RxSubmissionDoc>(COLLECTION).insertOne(doc);
  return { id: result.insertedId.toString() };
}

export async function deleteRxSubmission(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection<RxSubmissionDoc>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export interface GetRxSubmissionsResult {
  submissions: RxSubmissionDoc[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getRxSubmissions(page: number, perPage: number): Promise<GetRxSubmissionsResult> {
  const db = await getDb();
  const collection = db.collection<RxSubmissionDoc>(COLLECTION);
  const total = await collection.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const submissions = await collection
    .find({})
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * perPage)
    .limit(perPage)
    .toArray();
  return { submissions, total, page: safePage, totalPages };
}

export function validateRxSubmissionInput(body: Record<string, unknown>): { input?: RxSubmissionInput; error?: string } {
  const {
    doctorName, licenseNumber, doctorPhone, practiceEmail, patientName, patientPhone, appointmentDate,
    category, restorations, goldAlloy, implants, implantCementation, implantHole, implantSystem,
    otherServices, teeth, shade, stumpShade, digitalScan, customShade, photosSent, instructions,
    enclosed, delivery, dueDate, signature, agreeWarranty, recipient,
  } = body;

  if (!doctorName || typeof doctorName !== "string") return { error: "Doctor's name is required" };
  if (!licenseNumber || typeof licenseNumber !== "string") return { error: "License number is required" };
  if (!doctorPhone || typeof doctorPhone !== "string") return { error: "Doctor's phone is required" };
  if (!practiceEmail || typeof practiceEmail !== "string") return { error: "Practice email is required" };
  if (!patientName || typeof patientName !== "string") return { error: "Patient's name is required" };
  if (!patientPhone || typeof patientPhone !== "string") return { error: "Patient's phone is required" };
  if (!appointmentDate || typeof appointmentDate !== "string") return { error: "Appointment date is required" };
  if (typeof category !== "string" || !CATEGORIES.includes(category as RxCategory)) return { error: "A case category is required" };
  if (!isStringArray(restorations)) return { error: "Restorations must be a list" };
  if (!isStringArray(implants)) return { error: "Implant options must be a list" };
  if (!isStringArray(otherServices)) return { error: "Other services must be a list" };
  if (!isNumberArray(teeth) || teeth.length === 0) return { error: "At least one tooth must be selected" };
  if (!shade || typeof shade !== "string") return { error: "Shade is required" };
  if (!stumpShade || typeof stumpShade !== "string") return { error: "Stump shade is required" };
  if (!instructions || typeof instructions !== "string") return { error: "Instructions for the technician are required" };
  if (!isStringArray(enclosed) || enclosed.length === 0) return { error: "At least one enclosed item is required" };
  if (!delivery || typeof delivery !== "string") return { error: "Delivery method is required" };
  if (!dueDate || typeof dueDate !== "string") return { error: "Due date is required" };
  if (!signature || typeof signature !== "string") return { error: "Signature is required" };
  if (agreeWarranty !== true) return { error: "Agreement to the warranty terms is required" };

  const resto = restorations.length + implants.length + otherServices.length;
  if (resto === 0) return { error: "At least one restoration or service is required" };

  if (category === "crown" && restorations.some((r) => typeof r === "string" && r.toLowerCase().startsWith("gold")) && !goldAlloy) {
    return { error: "Gold alloy is required when a gold crown is selected" };
  }
  if (category === "impl") {
    if (!implantCementation || typeof implantCementation !== "string") return { error: "Implant cementation is required" };
    if (!implantHole || typeof implantHole !== "string") return { error: "Implant screw access is required" };
    if (!implantSystem || typeof implantSystem !== "string") return { error: "Implant system and size is required" };
  }

  return {
    input: {
      doctorName,
      licenseNumber,
      doctorPhone,
      practiceEmail,
      patientName,
      patientPhone,
      appointmentDate,
      category: category as RxCategory,
      restorations,
      goldAlloy: typeof goldAlloy === "string" ? goldAlloy : undefined,
      implants,
      implantCementation: typeof implantCementation === "string" ? implantCementation : undefined,
      implantHole: typeof implantHole === "string" ? implantHole : undefined,
      implantSystem: typeof implantSystem === "string" ? implantSystem : undefined,
      otherServices,
      teeth,
      shade,
      stumpShade,
      digitalScan: digitalScan === true,
      customShade: customShade === true,
      photosSent: photosSent === true,
      instructions,
      enclosed,
      delivery,
      dueDate,
      signature,
      agreeWarranty: true,
      recipient: typeof recipient === "string" ? recipient : undefined,
    },
  };
}
