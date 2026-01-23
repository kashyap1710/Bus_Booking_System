import express from "express";
import dotenv from "dotenv";
import bookingRoutes from "./routes/booking.routes.js";
import { db } from "./db/index.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/bookings", bookingRoutes);

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
  console.log(`Server running on port ${PORT}`);
});
