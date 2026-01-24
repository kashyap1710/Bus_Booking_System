import { db } from "./src/db/index.js";
import { customers, bookings, seatSegments, bookingMeals } from "./src/db/schema.js";

async function resetDatabase() {
  try {
    console.log("⚠️  Starting Database Reset...");

    console.log("Deleting Booking Meals...");
    await db.delete(bookingMeals);
    
    console.log("Deleting Seat Segments...");
    await db.delete(seatSegments);

    console.log("Deleting Bookings...");
    await db.delete(bookings);

    console.log("Deleting Customers...");
    await db.delete(customers);

    console.log("✅ Database Reset Successful! All transactional data cleared.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
