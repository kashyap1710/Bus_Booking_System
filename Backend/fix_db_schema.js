import { db } from "./src/db/index.js";
import { sql } from "drizzle-orm";

async function fixSchema() {
  console.log("🛠️  Dropping 'phone' column from 'customers' table...");
  try {
    await db.execute(sql`ALTER TABLE customers DROP COLUMN phone;`);
    console.log("✅ Column dropped successfully.");
  } catch (err) {
    console.error("❌ Failed to drop column:", err);
  }
  process.exit(0);
}

fixSchema();
