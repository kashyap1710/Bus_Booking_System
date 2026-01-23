import { db } from "./src/db/index.js";
import { bookings } from "./src/db/schema.js";
import { desc } from "drizzle-orm";

async function checkLatest() {
  console.log("🔍 Converting query...");
  const latest = await db.select().from(bookings).orderBy(desc(bookings.id)).limit(1);
  
  if (latest.length === 0) {
    console.log("No bookings found.");
  } else {
    console.log("✅ Latest Booking in DB:");
    console.log(latest[0]);
  }
  process.exit(0);
}

checkLatest().catch(console.error);
