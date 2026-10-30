// Creates (or resets) the single admin user document used for /admin login.
// Run with: npm run seed:admin
// Change the password immediately afterward via /admin/settings.
import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "crypto";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    try {
      process.loadEnvFile(".env");
    } catch {
      /* no env file found; rely on already-exported vars */
    }
  }
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dental-concepts";

if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local before seeding.");
  process.exit(1);
}

const username = process.env.SEED_ADMIN_USERNAME || "admin";
const password = process.env.SEED_ADMIN_PASSWORD || "DentalConcept2026";

function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("adminUsers");
  await collection.createIndex({ username: 1 }, { unique: true });

  const now = new Date();
  await collection.updateOne(
    { username },
    {
      $set: { username, passwordHash: hashPassword(password), updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  console.log(`Admin user "${username}" is ready. Log in at /admin/login, then change the password from Settings.`);
} finally {
  await client.close();
}
