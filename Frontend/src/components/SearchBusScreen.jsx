import { useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { busStops, calculateFare } from "../App";

export default function SearchBusScreen({
  bookingData,
  updateBookingData,
  onNext,
  onCancelTicket
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    if (
      bookingData.date &&
      bookingData.fromStopIndex < bookingData.toStopIndex
    ) {
      setIsLoading(true);
      setTimeout(() => {
        updateBookingData({
          selectedSeats: [],
          meals: { veg: 0, nonVeg: 0 },
          passengerNames: [],
          passengerAges: [],
          passengerGenders: [],
          ticketPrice: calculateFare(
            bookingData.fromStopIndex,
            bookingData.toStopIndex
          ),
        });
        setIsLoading(false);
        onNext();
      }, 1500);
    }
  };

  const handleFromChange = (value) => {
    const index = busStops.findIndex((stop) => stop.name === value);
    updateBookingData({ from: value, fromStopIndex: index });
  };

  const handleToChange = (value) => {
    const index = busStops.findIndex((stop) => stop.name === value);
    updateBookingData({ to: value, toStopIndex: index });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 px-4">
      <div className="text-center mt-10 mb-10">
        <h1 className="text-4xl font-semibold mb-2">
          Sleeper Bus Booking
        </h1>
        <p className="text-lg text-gray-400">
          Choose Your Journey
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-lg shadow-black/30 p-8 space-y-6"
      >
        {/* From */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            From
          </label>
          <select
            value={bookingData.from}
            onChange={(e) => handleFromChange(e.target.value)}
            className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {busStops.map((stop, index) => (
              <option
                key={stop.name}
                value={stop.name}
                disabled={index >= bookingData.toStopIndex}
              >
                {stop.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            To
          </label>
          <select
            value={bookingData.to}
            onChange={(e) => handleToChange(e.target.value)}
            className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {busStops.map((stop, index) => (
              <option
                key={stop.name}
                value={stop.name}
                disabled={index <= bookingData.fromStopIndex}
              >
                {stop.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Journey Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) =>
                updateBookingData({ date: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 pr-12 text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
            />
            <Calendar
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Passengers (Max 6)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={bookingData.passengers}
            onChange={(e) => {
              const val = e.target.value;
              // Allow only legitimate digits
              if (val === "") {
                updateBookingData({ passengers: "" });
                return;
              }
              // Regex to ensure only numbers are typed
              if (!/^\d+$/.test(val)) return;

              let num = parseInt(val);
              
              // If number > 6, ignore the last keystroke (don't update state)
              if (num > 6) return;
              if (num < 1) num = 1;

              updateBookingData({ passengers: num });
            }}
            onBlur={() => {
              if (!bookingData.passengers) {
                updateBookingData({ passengers: 1 });
              }
            }}
            className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-300">
              Estimated Total Fare
            </p>
            <p className="text-xs text-gray-400">
              (₹
              {calculateFare(
                bookingData.fromStopIndex,
                bookingData.toStopIndex
              )}{" "}
              × {parseInt(bookingData.passengers) || 0} passengers)
            </p>
          </div>

          <div className="text-2xl font-bold text-blue-400">
            ₹
            {calculateFare(
              bookingData.fromStopIndex,
              bookingData.toStopIndex
            ) * (parseInt(bookingData.passengers) || 0)}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-blue-600 text-white py-4 rounded-xl
                     text-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-800"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Searching...
            </>
          ) : (
            "Search Bus"
          )}
        </button>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onCancelTicket}
            className="text-red-400 text-sm hover:underline hover:text-red-300 transition"
          >
            Manage / Cancel Bookings
          </button>
        </div>
      </form>
    </div>
  );
}
