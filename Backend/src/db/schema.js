import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  date,
  numeric,
} from "drizzle-orm/pg-core";

/* =======================
   CUSTOMERS
======================= */
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).unique().notNull(),
  gender: varchar("gender", { length: 10 }),
  isActive: boolean("is_active").default(true),
  lastBookingDate: timestamp("last_booking_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* =======================
   STATIONS
======================= */
export const stations = pgTable("stations", {
  id: serial("id").primaryKey(),
  cityName: varchar("city_name", { length: 100 }).notNull(),
  stationIndex: integer("station_index").unique().notNull(),
});

/* =======================
   SEATS
======================= */
export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  seatNumber: varchar("seat_number", { length: 10 }).unique().notNull(),
  seatType: varchar("seat_type", { length: 20 }).notNull(),
  isActive: boolean("is_active").default(true),
});

/* =======================
   MEALS
======================= */
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  price: integer("price").notNull(), // price in paise
  isAvailable: boolean("is_available").default(true),
});
/* =======================
   BOOKINGS
======================= */
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),

  customerId: integer("customer_id")
    .references(() => customers.id)
    .notNull(),


  journeyDate: date("journey_date").notNull(),
  bookingDatetime: timestamp("booking_datetime").defaultNow(),

  fromStationIndex: integer("from_station_index").notNull(),
  toStationIndex: integer("to_station_index").notNull(),

  bookingStatus: varchar("booking_status", { length: 30 }).notNull(),
  seatStatus: varchar("seat_status", { length: 30 }).notNull(),

  cancelledAt: timestamp("cancelled_at"),
  confirmationTime: timestamp("confirmation_time"),

  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),

  predictionScore: numeric("prediction_score", { precision: 5, scale: 2 }),
  bookingLeadTime: integer("booking_lead_time"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* =======================
   SEAT SEGMENTS
======================= */
export const seatSegments = pgTable("seat_segments", {
  id: serial("id").primaryKey(),

  seatId: integer("seat_id")
    .references(() => seats.id)
    .notNull(),

  bookingId: integer("booking_id")
    .references(() => bookings.id)
    .notNull(),

  journeyDate: date("journey_date").notNull(),
  fromIndex: integer("from_index").notNull(),
  toIndex: integer("to_index").notNull(),
  gender: varchar("gender", { length: 10 }), // "Male" or "Female"
});

/* =======================
   BOOKING MEALS
======================= */
export const bookingMeals = pgTable("booking_meals", {
  id: serial("id").primaryKey(),

  bookingId: integer("booking_id")
    .references(() => bookings.id)
    .notNull(),

  mealId: integer("meal_id")
    .references(() => meals.id)
    .notNull(),

  quantity: integer("quantity").notNull(),
});
