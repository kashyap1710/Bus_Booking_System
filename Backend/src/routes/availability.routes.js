import express from "express";
import { db } from "../db/index.js";
import { seats, seatSegments } from "../db/schema.js";
import { and, lt, gt, eq } from "drizzle-orm";
import { predictSellOutRisk } from "../services/predictionModel.js";

const router = express.Router();

/**
 * GET /api/availability
 * query params:
 *  - journeyDate (YYYY-MM-DD)
 *  - fromIndex
 *  - toIndex
 */
router.get("/", async (req, res) => {
  const { journeyDate, fromIndex, toIndex } = req.query;

  if (!journeyDate || fromIndex == null || toIndex == null) {
    return res.status(400).json({ message: "Missing query params" });
  }

  // 1️⃣ Get all seats
  const allSeats = await db.select().from(seats);

  // 2️⃣ Get conflicting seat segments
  const conflicts = await db
    .select({ 
      seatId: seatSegments.seatId,
      gender: seatSegments.gender,
      passengerName: seatSegments.passengerName,
      bookingId: seatSegments.bookingId
    })
    .from(seatSegments)
    .where(
      and(
        eq(seatSegments.journeyDate, journeyDate),
        lt(seatSegments.fromIndex, Number(toIndex)),
        gt(seatSegments.toIndex, Number(fromIndex))
      )
    );

  const blockedSeatIds = new Set(conflicts.map(c => c.seatId));
  
  // Create maps for quick lookup
  const seatInfoMap = {};
  conflicts.forEach(c => {
    seatInfoMap[c.seatId] = {
      gender: c.gender,
      passengerName: c.passengerName || "Confirmed Passenger",
      bookingId: c.bookingId
    };
  });

  // 3️⃣ Mark availability
  const result = allSeats.map(seat => ({
    ...seat,
    available: !blockedSeatIds.has(seat.id),
    gender: seatInfoMap[seat.id]?.gender || null,
    passengerName: seatInfoMap[seat.id]?.passengerName || null,
    bookingId: seatInfoMap[seat.id]?.bookingId || null
  }));

  // 4. ,? Predict Sell-Out Risk (using dedicated Model)
  const totalSeats = allSeats.length;
  const bookedCount = blockedSeatIds.size;
  
  const prediction = predictSellOutRisk(journeyDate, totalSeats, bookedCount);

  res.json({ seats: result, prediction }); // Changed response structure to include prediction
});

export default router;
