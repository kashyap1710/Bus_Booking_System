import { db } from "./src/db/index.js";
import { seats } from "./src/db/schema.js";

async function addMissingSeats() {
  try {
    console.log("⏳ Checking for missing seats (13-15)...");

    const newSeats = [];
    const existingSeats = await db.select().from(seats);
    const existingNumbers = new Set(existingSeats.map(s => s.seatNumber));

    // Add 13-15 LB
    for (let i = 13; i <= 15; i++) {
        const num = `${i} LB`;
        if (!existingNumbers.has(num)) {
            newSeats.push({ seatNumber: num, seatType: "LB" });
        }
    }

    // Add 13-15 UB
    for (let i = 13; i <= 15; i++) {
        const num = `${i} UB`;
        if (!existingNumbers.has(num)) {
            newSeats.push({ seatNumber: num, seatType: "UB" });
        }
    }

    if (newSeats.length > 0) {
        console.log(`Adding ${newSeats.length} missing seats...`);
        await db.insert(seats).values(newSeats);
        console.log("✅ Successfully added missing seats!");
    } else {
        console.log("✅ All seats (1-15) already exist.");
    }

  } catch (error) {
    console.error("❌ Failed to add seats:", error);
  } finally {
    process.exit();
  }
}

addMissingSeats();
