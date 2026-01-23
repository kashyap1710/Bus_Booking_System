import express from "express";
import { db } from "../db/index.js";
import { bookings } from "../db/schema.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  const data = await db.select().from(bookings).limit(5);
  res.json(data);
});

export default router;
