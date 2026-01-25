ALTER TABLE "bookings" DROP CONSTRAINT "bookings_seat_id_seats_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "full_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "meals" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "seat_segments" ADD COLUMN "gender" varchar(10);--> statement-breakpoint
ALTER TABLE "seat_segments" ADD COLUMN "passenger_name" varchar(100);--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "seat_id";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "booking_datetime";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "seat_status";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "confirmation_time";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "gender";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "last_booking_date";--> statement-breakpoint
ALTER TABLE "meals" DROP COLUMN "is_available";--> statement-breakpoint
ALTER TABLE "seats" DROP COLUMN "seat_type";--> statement-breakpoint
ALTER TABLE "seats" DROP COLUMN "is_active";