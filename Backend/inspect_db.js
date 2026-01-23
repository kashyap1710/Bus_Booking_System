import { db } from "./src/db/index.js";
import { sql } from "drizzle-orm";

async function inspectSchema() {
  console.log("🔍 Inspecting 'customers' table columns...");
  const result = await db.execute(sql`
    SELECT column_name, is_nullable, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'customers';
  `);
  console.table(result.rows);
  process.exit(0);
}

inspectSchema().catch(console.error);
