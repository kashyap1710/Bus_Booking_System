import express from "express";
import { db } from "../db/index.js";
import { seats, seatSegments } from "../db/schema.js";
import { and, lt, gt, eq } from "drizzle-orm";

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
      gender: seatSegments.gender 
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
  
  // Create a map for quick gender lookup
  const seatGenderMap = {};
  conflicts.forEach(c => {
    seatGenderMap[c.seatId] = c.gender;
  });

  // 3️⃣ Mark availability
  const result = allSeats.map(seat => ({
    ...seat,
    available: !blockedSeatIds.has(seat.id),
    gender: seatGenderMap[seat.id] || null // Return gender if booked
  }));

  res.json(result);
});

export default router;
