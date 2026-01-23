CREATE TABLE "booking_meals" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"meal_id" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"seat_id" integer NOT NULL,
	"journey_date" date NOT NULL,
	"booking_datetime" timestamp DEFAULT now(),
	"from_station_index" integer NOT NULL,
	"to_station_index" integer NOT NULL,
	"booking_status" varchar(30) NOT NULL,
	"seat_status" varchar(30) NOT NULL,
	"cancelled_at" timestamp,
	"confirmation_time" timestamp,
	"total_amount" numeric(10, 2) NOT NULL,
	"prediction_score" numeric(5, 2),
	"booking_lead_time" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"gender" varchar(10),
	"is_active" boolean DEFAULT true,
	"last_booking_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "meals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"is_available" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "seat_segments" (
	"id" serial PRIMARY KEY NOT NULL,
	"seat_id" integer NOT NULL,
	"booking_id" integer NOT NULL,
	"journey_date" date NOT NULL,
	"from_index" integer NOT NULL,
	"to_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seats" (
	"id" serial PRIMARY KEY NOT NULL,
	"seat_number" varchar(10) NOT NULL,
	"seat_type" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "seats_seat_number_unique" UNIQUE("seat_number")
);
--> statement-breakpoint
CREATE TABLE "stations" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_name" varchar(100) NOT NULL,
	"station_index" integer NOT NULL,
	CONSTRAINT "stations_station_index_unique" UNIQUE("station_index")
);
--> statement-breakpoint
ALTER TABLE "booking_meals" ADD CONSTRAINT "booking_meals_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_meals" ADD CONSTRAINT "booking_meals_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_seat_id_seats_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_segments" ADD CONSTRAINT "seat_segments_seat_id_seats_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_segments" ADD CONSTRAINT "seat_segments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;