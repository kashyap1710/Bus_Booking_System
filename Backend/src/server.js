import express from "express";
import dotenv from "dotenv";
import bookingRoutes from "./routes/booking.routes.js";
import { db } from "./db/index.js";
import availabilityRoutes from "./routes/availability.routes.js";


import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug Middleware to log incoming
app.use("/api/availability", availabilityRoutes);

app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Backend running 🚍");
});

app.get("/db-test", async (req, res) => {
  try {
    await db.execute("select 1");
    res.send("DB connected");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});
