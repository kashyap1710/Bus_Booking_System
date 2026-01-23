import {
  CheckCircle2,
  Bus,
  Calendar,
  CreditCard,
  Utensils,
  Home,
} from "lucide-react";
import RouteIndicator from "./RouteIndicator";

export default function BookingConfirmationScreen({ bookingData, onHome }) {
  const getMealPrice = () =>
    bookingData.meals.veg * 120 +
    bookingData.meals.nonVeg * 150;

  const getSeatPrice = () =>
    bookingData.ticketPrice * bookingData.selectedSeats.length;

  const getTotalAmount = () =>
    getSeatPrice() + getMealPrice();

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-14 flex justify-center">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-900/30 rounded-full mb-6">
            <CheckCircle2 className="text-green-500" size={56} />
          </div>

          <h1 className="text-3xl font-semibold mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400 mb-6">
            Your sleeper bus ticket has been successfully booked
          </p>

          <RouteIndicator
            fromIndex={bookingData.fromStopIndex}
            toIndex={bookingData.toStopIndex}
          />
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg shadow-black/30 p-8 md:p-10">
          {/* Booking ID */}
          <div className="pb-6 mb-6 border-b border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Booking ID</p>
            <p className="text-xl font-semibold text-blue-400">
              {bookingData.bookingId}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Route */}
            <InfoRow
              icon={<Bus />}
              label="Route"
              value={`${bookingData.from} → ${bookingData.to}`}
            />

            {/* Date */}
            <InfoRow
              icon={<Calendar />}
              label="Journey Date"
              value={new Date(bookingData.date).toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            />

            {/* Seats */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center text-blue-400 font-semibold">
                {bookingData.selectedSeats.length}
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Seat Numbers
                </p>
                <div className="flex flex-wrap gap-2">
                  {bookingData.selectedSeats.map((seat, i) => {
                    const isFemale =
                      bookingData.passengerGenders[i] ===
                      "Female";
                    return (
                      <span
                        key={seat}
                        className={`px-3 py-1 rounded-md text-sm font-medium border ${
                          isFemale
                            ? "bg-pink-900/30 text-pink-300 border-pink-700"
                            : "bg-gray-700 text-gray-300 border-gray-600"
                        }`}
                      >
                        {seat}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Meals */}
            {(bookingData.meals.veg > 0 ||
              bookingData.meals.nonVeg > 0) && (
              <InfoRow
                icon={<Utensils />}
                label="Meals Selected"
                value={
                  <>
                    {bookingData.meals.veg > 0 && (
                      <div>Veg Meal × {bookingData.meals.veg}</div>
                    )}
                    {bookingData.meals.nonVeg > 0 && (
                      <div>
                        Non-Veg Meal × {bookingData.meals.nonVeg}
                      </div>
                    )}
                  </>
                }
              />
            )}

            {/* Total */}
            <div className="pt-6 border-t-2 border-green-800/30 flex gap-4">
              <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center">
                <CreditCard className="text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Total Amount Paid
                </p>
                <p className="text-2xl font-semibold text-green-500">
                  ₹{getTotalAmount()}
                </p>
              </div>
            </div>
          </div>

          {/* Passenger Info */}
          <div className="mt-8 bg-gray-700 rounded-xl p-6">
            <h3 className="font-medium mb-3">
              Passenger Information
            </h3>

            <ul className="list-disc list-inside space-y-1 mb-3">
              {bookingData.passengerNames.map((name, i) => (
                <li key={i} className="text-gray-200">
                  {name}{" "}
                  <span className="text-gray-400 text-sm">
                    ({bookingData.selectedSeats[i]})
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-gray-300">
              <span className="text-gray-400">Mobile:</span>{" "}
              {bookingData.mobileNumber}
            </p>
          </div>

          {/* SMS Info */}
          <div className="mt-6 bg-blue-900/20 rounded-lg p-4 text-center text-sm text-blue-200">
            A confirmation SMS has been sent to your mobile number
          </div>

          {/* Home Button */}
          <button
            onClick={onHome}
            className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl text-lg font-medium hover:bg-black flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small helper ---------- */

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <div className="text-lg font-medium text-gray-200">
          {value}
        </div>
      </div>
    </div>
  );
}
