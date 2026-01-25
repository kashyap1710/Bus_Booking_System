import { db } from "./index.js";
import { stations, seats, meals } from "./schema.js";

async function seed() {
  console.log("🌱 Seeding database...");

  /* ---------- STATIONS ---------- */
  await db.insert(stations).values([
    { cityName: "Ahmedabad", stationIndex: 0 },
    { cityName: "Vadodara", stationIndex: 1 },
    { cityName: "Bharuch", stationIndex: 2 },
    { cityName: "Surat", stationIndex: 3 },
    { cityName: "Vapi", stationIndex: 4 },
    { cityName: "Virar", stationIndex: 5 },
    { cityName: "Mumbai", stationIndex: 6 },
  ]);

  /* ---------- SEATS ---------- */
  const seatData = [];

  // Lower Berth (LB)
  for (let i = 1; i <= 12; i++) {
    seatData.push({
      seatNumber: `${i} LB`,
    });
  }

  // Upper Berth (UB)
  for (let i = 1; i <= 12; i++) {
    seatData.push({
      seatNumber: `${i} UB`,
    });
  }

  await db.insert(seats).values(seatData);

  /* ---------- MEALS ---------- */
  await db.insert(meals).values([
    { name: "Veg Meal", price: 12000 },     // ₹120.00
    { name: "Non-Veg Meal", price: 15000 }, // ₹150.00
  ]);

  console.log("✅ Seeding completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed", err);
  process.exit(1);
});
