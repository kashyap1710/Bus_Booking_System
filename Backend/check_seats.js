import { db } from "./src/db/index.js";
import { seats } from "./src/db/schema.js";

async function checkSeats() {
  const allSeats = await db.select().from(seats);
  console.log("Found", allSeats.length, "seats");
  if (allSeats.length > 0) {
    console.log("Sample Seat Numbers:", allSeats.slice(0, 5).map(s => `"${s.seatNumber}"`));
  }
  process.exit();
}

checkSeats();
