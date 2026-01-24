import express from "express";
import { db } from "../db/index.js";
import { bookings, seatSegments, bookingMeals, seats, customers, stations, meals as mealsTable } from "../db/schema.js";
import { inArray, eq, and, lt, gt, sql } from "drizzle-orm";
import { sendBookingConfirmation } from "../services/email.service.js";

const router = express.Router();

// POST /api/bookings
router.post("/bookings", async (req, res) => {
  try {
    console.log("Booking Request Body:", req.body); // Log explicitly inside the route

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

    // Resolve seat numbers (strings) to IDs (integers)
    const seatRecords = await db.select().from(seats).where(inArray(seats.seatNumber, seatIds));
    
    if (seatRecords.length !== seatIds.length) {
      return res.status(400).json({ message: "Invalid seat numbers provided" });
    }

    // 🔴 Validation: Check if any of these seats are ALREADY booked for overlapping segments
    const seatIdsIntegers = seatRecords.map(s => s.id);
    const conflicts = await db.select().from(seatSegments).where(
      and(
        inArray(seatSegments.seatId, seatIdsIntegers),
        eq(seatSegments.journeyDate, journeyDate),
        lt(seatSegments.fromIndex, Number(toIndex)),
        gt(seatSegments.toIndex, Number(fromIndex))
      )
    );

    if (conflicts.length > 0) {
      return res.status(400).json({ 
        message: "One or more seats are already booked for this route segment.",
        conflict: conflicts
      });
    }

    // 👤 Find or Create Customer
    let customer = await db.query.customers.findFirst({
      where: eq(customers.email, email)
    });

    if (!customer) {
      const [newCustomer] = await db.insert(customers).values({
        email,
      }).returning();
      customer = newCustomer;
    }

    const [booking] = await db.insert(bookings).values({
      customerId: customer.id,
      journeyDate,
      fromStationIndex: fromIndex,
      toStationIndex: toIndex,
      bookingStatus: "CONFIRMED",
      totalAmount
    }).returning();

    // Map each seatId string to its corresponding gender from the request arrays
    // Assuming seatIds[i] corresponds to passengerGenders[i]
    for (let i = 0; i < seatIds.length; i++) {
      const seatNo = seatIds[i];
      const gender = passengerGenders ? passengerGenders[i] : null;
      
      const seatRecord = seatRecords.find(s => s.seatNumber === seatNo);
      
      if (seatRecord) {
        await db.insert(seatSegments).values({
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
        await db.insert(bookingMeals).values({
          bookingId: booking.id,
          mealId: m.mealId,
          quantity: m.qty
        });
      }
    }

    // 📧 Send Email Notification (Non-blocking)
    try {
      if (email) {
        // Fetch Station Names
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
          bookingId: booking.id,
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

    res.json({ success: true, bookingId: booking.id });

  } catch (err) {
    console.error("❌ BOOKING FAILED:", err); // Verified detailed logging
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
