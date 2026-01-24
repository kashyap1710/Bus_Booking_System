import { db } from "./src/db/index.js";
import { sql } from "drizzle-orm";

async function dropUnusedColumns() {
  try {
    console.log("⏳ Dropping unused columns...");

    // 1. Drop customers.gender, customers.last_booking_date
    await db.execute(sql`ALTER TABLE customers DROP COLUMN IF EXISTS gender;`);
    await db.execute(sql`ALTER TABLE customers DROP COLUMN IF EXISTS "last_booking_date";`);

    // 2. Drop bookings.seat_status, bookings.confirmation_time
    await db.execute(sql`ALTER TABLE bookings DROP COLUMN IF EXISTS seat_status;`);
    await db.execute(sql`ALTER TABLE bookings DROP COLUMN IF EXISTS confirmation_time;`);

    // 3. Drop duplicate seat_segments.to_index? 
    // Drizzle will handle the mapping, but physical DB might have duplicate columns? 
    // Actually, SQL doesn't allow duplicate column names, so the schema definition was just a bug in JS file, not DB.
    // So no DB action needed for seat_segments duplicate.

    console.log("✅ Successfully dropped unused columns!");
  } catch (error) {
    console.error("❌ Failed to alter table:", error);
  } finally {
    process.exit();
  }
}

dropUnusedColumns();
