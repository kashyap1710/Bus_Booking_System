import express from "express";
import { db } from "../db/index.js";
import { bookings, seatSegments, bookingMeals, seats, customers, stations, meals as mealsTable } from "../db/schema.js";
import { inArray, eq, and, lt, gt, sql } from "drizzle-orm";
import { sendBookingConfirmation } from "../services/email.service.js";

const router = express.Router();

// POST /api/bookings
router.post("/bookings", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing. Ensure Content-Type is application/json" });
    }

    const {
      email, // Changed from customerId
      journeyDate,
      fromIndex,
      toIndex,
      seatIds,
      passengerGenders,
      passengerNames,
      meals,
      totalAmount
    } = req.body; // destructure AFTER check

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let bookingId;

    // 🛡️ Start Transaction with SERIALIZABLE Isolation
    await db.transaction(async (tx) => {
      // 1. Set Isolation Level -> This ensures no other transaction can read/write these rows concurrently in a way that causes anomalies
      await tx.execute(sql`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`);

      // 2. Resolve seat numbers (strings) to IDs (integers)
      const seatRecords = await tx.select().from(seats).where(inArray(seats.seatNumber, seatIds));
      
      if (seatRecords.length !== seatIds.length) {
        throw new Error("INVALID_SEAT_NUMBERS");
      }

      // 🔴 Validation: Check if any of these seats are ALREADY booked for overlapping segments
      const seatIdsIntegers = seatRecords.map(s => s.id);
      const conflicts = await tx.select().from(seatSegments).where(
        and(
          inArray(seatSegments.seatId, seatIdsIntegers),
          eq(seatSegments.journeyDate, journeyDate),
          lt(seatSegments.fromIndex, Number(toIndex)),
          gt(seatSegments.toIndex, Number(fromIndex))
        )
      );

      if (conflicts.length > 0) {
        // Throwing error inside transaction rolls it back automatically
        throw new Error("SEAT_ALREADY_BOOKED"); 
      }

      // 👤 Find or Create Customer
      let customer = await tx.query.customers.findFirst({
        where: eq(customers.email, email)
      });

      if (!customer) {
        const [newCustomer] = await tx.insert(customers).values({
          email,
          fullName: passengerNames && passengerNames.length > 0 ? passengerNames[0] : "Guest",
        }).returning();
        customer = newCustomer;
      }

      const [booking] = await tx.insert(bookings).values({
        customerId: customer.id,
        journeyDate,
        fromStationIndex: fromIndex,
        toStationIndex: toIndex,
        bookingStatus: "CONFIRMED",
        totalAmount
      }).returning();
      
      bookingId = booking.id;

      // Map each seatId string to its corresponding gender from the request arrays
      // Assuming seatIds[i] corresponds to passengerGenders[i]
      for (let i = 0; i < seatIds.length; i++) {
        const seatNo = seatIds[i];
        const gender = passengerGenders ? passengerGenders[i] : null;
        
        const seatRecord = seatRecords.find(s => s.seatNumber === seatNo);
        
        if (seatRecord) {
          await tx.insert(seatSegments).values({
            seatId: seatRecord.id,
            bookingId: booking.id,
            journeyDate,
            fromIndex,
            toIndex,
            gender, // Store gender
            passengerName: passengerNames ? passengerNames[i] : null // Store name
          });
        }
      }

      if (meals?.length) {
        for (const m of meals) {
          await tx.insert(bookingMeals).values({
            bookingId: booking.id,
            mealId: m.mealId,
            quantity: m.qty
          });
        }
      }
    });

    // 📧 Send Email Notification (Non-blocking) - Only if transaction succeeds
    try {
      if (email && bookingId) {
        // Fetch Station Names (Read-only, can use main db or tx, doesn't matter much here but main db is fine)
        const fromStationData = await db.select({ name: stations.cityName }).from(stations).where(eq(stations.stationIndex, fromIndex)).limit(1);
        const toStationData = await db.select({ name: stations.cityName }).from(stations).where(eq(stations.stationIndex, toIndex)).limit(1);

        const fromStation = fromStationData[0]?.name || "Unknown";
        const toStation = toStationData[0]?.name || "Unknown";

        // Fetch Meal Names if meals are selected
        let bookedMeals = [];
        if (meals && meals.length > 0) {
          const mealIds = meals.map(m => m.mealId);
          const mealRecords = await db.select().from(mealsTable).where(inArray(mealsTable.id, mealIds));
          
          bookedMeals = meals.map(m => {
            const mealInfo = mealRecords.find(r => r.id === m.mealId);
            return {
              name: mealInfo ? mealInfo.name : "Unknown Meal",
              quantity: m.qty,
              price: mealInfo ? mealInfo.price : 0
            };
          });
        }

        // We don't await this so it runs in background
        sendBookingConfirmation(email, {
          bookingId: bookingId,
          journeyDate,
          seats: seatIds,
          totalAmount,
          fromStation,
          toStation,
          meals: bookedMeals,
          passengerNames
        }).catch(err => console.error("Email sending failed asynchronously:", err));
      }
    } catch (emailError) {
      console.error("Failed to initiate email notification:", emailError);
    }

    res.json({ success: true, bookingId: bookingId });

  } catch (err) {
    console.error("❌ BOOKING FAILED:", err); 

    if (err.message === "SEAT_ALREADY_BOOKED") {
       return res.status(409).json({ message: "One or more seats are already booked for this route segment." });
    }
    if (err.message === "INVALID_SEAT_NUMBERS") {
       return res.status(400).json({ message: "Invalid seat numbers provided" });
    }
    if (err.code === '40001') { 
      // Postgres Serialization Failure
      return res.status(409).json({ message: "High traffic detected. Please retry your booking." });
    }

    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

// POST /api/bookings/cancel
router.post("/bookings/cancel", async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // 1. Update booking status
    await db.update(bookings)
      .set({ 
        bookingStatus: "CANCELLED",
        cancelledAt: new Date()
      })
      .where(eq(bookings.id, bookingId));

    // 2. Clear seat segments to free up seats
    await db.delete(seatSegments)
      .where(eq(seatSegments.bookingId, bookingId));

    res.json({ success: true, message: "Booking cancelled successfully" });

  } catch (err) {
    console.error("Cancellation Refused:", err);
    res.status(500).json({ message: "Cancellation failed" });
  }
});

export default router;
