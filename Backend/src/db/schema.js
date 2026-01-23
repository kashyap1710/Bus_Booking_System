import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  date,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

/* ---------- CUSTOMERS ---------- */
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 100 }),
  email: varchar('email', { length: 100 }).unique(),
  phone: varchar('phone', { length: 15 }),
  gender: varchar('gender', { length: 10 }),
  isActive: boolean('is_active').default(true),
  lastBookingDate: timestamp('last_booking_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/* ---------- STATIONS ---------- */
export const stations = pgTable(
  'stations',
  {
    id: serial('id').primaryKey(),
    cityName: varchar('city_name', { length: 50 }),
    stationIndex: integer('station_index'),
  },
  (table) => ({
    stationIdx: uniqueIndex('station_index_unique').on(
      table.stationIndex,
    ),
  }),
);

/* ---------- SEATS ---------- */
export const seats = pgTable(
  'seats',
  {
    id: serial('id').primaryKey(),
    seatNumber: varchar('seat_number', { length: 10 }),
    seatType: varchar('seat_type', { length: 10 }),
    isActive: boolean('is_active').default(true),
  },
  (table) => ({
    seatNum: uniqueIndex('seat_number_unique').on(table.seatNumber),
  }),
);

/* ---------- MEALS ---------- */
export const meals = pgTable('meals', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }),
  price: integer('price'),
  isAvailable: boolean('is_available').default(true),
});

/* ---------- BOOKINGS ---------- */
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id'),
  seatId: integer('seat_id'),
  journeyDate: date('journey_date'),
  bookingDatetime: timestamp('booking_datetime').defaultNow(),
  fromStationIndex: integer('from_station_index'),
  toStationIndex: integer('to_station_index'),
  bookingStatus: varchar('booking_status', { length: 20 }),
  seatStatus: varchar('seat_status', { length: 20 }),
  cancelledAt: timestamp('cancelled_at'),
  confirmationTime: timestamp('confirmation_time'),
  totalAmount: integer('total_amount'),
  predictionScore: integer('prediction_score'),
  bookingLeadTime: integer('booking_lead_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/* ---------- SEAT SEGMENTS ---------- */
export const seatSegments = pgTable('seat_segments', {
  id: serial('id').primaryKey(),
  seatId: integer('seat_id'),
  bookingId: integer('booking_id'),
  journeyDate: date('journey_date'),
  fromIndex: integer('from_index'),
  toIndex: integer('to_index'),
});

/* ---------- BOOKING MEALS ---------- */
export const bookingMeals = pgTable('booking_meals', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id'),
  mealId: integer('meal_id'),
  quantity: integer('quantity'),
});
