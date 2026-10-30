import { getDb } from "@/lib/mongodb";
import { hashPassword, verifyPassword } from "./password";

export interface AdminUserDoc {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = "adminUsers";

export async function getAdminUser(username: string): Promise<AdminUserDoc | null> {
  const db = await getDb();
  return db.collection<AdminUserDoc>(COLLECTION).findOne({ username });
}

export async function verifyAdminLogin(username: string, password: string): Promise<boolean> {
  const user = await getAdminUser(username);
  if (!user) return false;
  return verifyPassword(password, user.passwordHash);
}

export async function updateAdminPassword(username: string, newPassword: string): Promise<void> {
  const db = await getDb();
  await db.collection<AdminUserDoc>(COLLECTION).updateOne(
    { username },
    { $set: { passwordHash: hashPassword(newPassword), updatedAt: new Date() } }
  );
}
