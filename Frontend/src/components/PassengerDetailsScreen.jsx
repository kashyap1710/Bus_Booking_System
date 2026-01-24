import { useState } from "react";
import { Mail, User, ArrowLeft, Loader2 } from "lucide-react";
import RouteIndicator from "./RouteIndicator";
import axios from "axios";

export default function PassengerDetailsScreen({
  bookingData,
  updateBookingData,
  onNext,
  onBack,
  showToast,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ages = bookingData.passengerAges.map((a) => parseInt(a) || 0);
    const hasAdult = ages.some((age) => age >= 12);

    if (ages.length !== bookingData.selectedSeats.length) {
      showToast("Please enter ages for all passengers", "error");
      return;
    }

    if (
      bookingData.passengerGenders.length !==
        bookingData.selectedSeats.length ||
      bookingData.passengerGenders.some((g) => !g)
    ) {
      showToast("Please select gender for all passengers", "error");
      return;
    }

    if (
      (bookingData.selectedSeats.length === 1 && ages[0] < 12) ||
      (bookingData.selectedSeats.length > 1 && !hasAdult)
    ) {
      if (bookingData.selectedSeats.length === 1) {
        showToast("The passenger must be 12 years or older.", "error");
      } else {
        showToast("At least one passenger must be 12 years or older.", "error");
      }
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: bookingData.email, // Send email
        journeyDate: bookingData.date,
        fromIndex: bookingData.fromStopIndex,
        toIndex: bookingData.toStopIndex,
        seatIds: bookingData.selectedSeats,
        passengerGenders: bookingData.passengerGenders, // Send genders
        passengerNames: bookingData.passengerNames, // Send names
        meals: [
          ...(bookingData.meals.veg > 0 ? [{ mealId: 1, qty: bookingData.meals.veg }] : []),
          ...(bookingData.meals.nonVeg > 0 ? [{ mealId: 2, qty: bookingData.meals.nonVeg }] : [])
        ],
        totalAmount: bookingData.ticketPrice * bookingData.selectedSeats.length + 
                     (bookingData.meals.veg * 120 + bookingData.meals.nonVeg * 150)
      };

      const response = await axios.post("http://localhost:5000/api/bookings", payload);

      if (response.data.success) {
        updateBookingData({ bookingId: response.data.bookingId });
        showToast("Booking Successful!", "success");
        onNext();
      }
    } catch (error) {
      console.error("Booking Error:", error);
      showToast(error.response?.data?.message || "Booking failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const seatPrice = bookingData.ticketPrice * bookingData.selectedSeats.length;

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <ArrowLeft className="text-gray-400" />
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-3xl font-semibold mb-2 text-white">Passenger Details</h1>
            <p className="text-gray-400 mb-5">
              {bookingData.from} → {bookingData.to}
            </p>
            <RouteIndicator
              fromIndex={bookingData.fromStopIndex}
              toIndex={bookingData.toStopIndex}
            />
          </div>

          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-gray-800 rounded-2xl shadow-lg shadow-black/30 p-8"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-6">
                Passenger Details
              </h3>

              <div className="space-y-6">
                {bookingData.selectedSeats.map((seat, index) => (
                  <div
                    key={seat}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                  >
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">
                        Passenger {index + 1} Name (Seat {seat})
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={bookingData.passengerNames[index] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Allow only letters and spaces
                            if (/^[a-zA-Z\s]*$/.test(val)) {
                              const arr = [...bookingData.passengerNames];
                              arr[index] = val;
                              updateBookingData({ passengerNames: arr });
                            }
                          }}
                          className="w-full pl-12 px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter name"
                          required
                        />
                      </div>
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="110"
                        value={bookingData.passengerAges[index] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          // Prevent infinite zeros or leading zeros (e.g. 00, 01)
                          if (val.length > 1 && val.startsWith("0")) return;

                          if (
                            val === "" ||
                            (parseInt(val) >= 0 && parseInt(val) <= 110)
                          ) {
                            const arr = [...bookingData.passengerAges];
                            arr[index] = val;
                            updateBookingData({ passengerAges: arr });
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="Age"
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Gender
                      </label>
                      <select
                        value={bookingData.passengerGenders[index] || ""}
                        onChange={(e) => {
                          const arr = [...bookingData.passengerGenders];
                          arr[index] = e.target.value;
                          updateBookingData({ passengerGenders: arr });
                        }}
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                ))}

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) =>
                        updateBookingData({ email: e.target.value })
                      }
                      className="w-full pl-12 px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 disabled:bg-blue-800 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Processing Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-gray-800 rounded-2xl shadow-lg shadow-black/30 p-6 h-fit text-white">
            <h3 className="text-lg font-medium mb-6">Booking Summary</h3>

            <SummaryItem label="Route">
              {bookingData.from} → {bookingData.to}
            </SummaryItem>

            <SummaryItem label="Date">
              {new Date(bookingData.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </SummaryItem>

            <SummaryItem label="Seat Numbers">
              {bookingData.selectedSeats.join(", ")}
            </SummaryItem>

            <div className="flex justify-between py-3 text-gray-300">
              <span>Seats Price ({bookingData.selectedSeats.length})</span>
              <span>₹{seatPrice}</span>
            </div>

            <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
              <span className="font-medium">Total Amount</span>
              <span className="text-2xl font-semibold text-blue-400">
                ₹{seatPrice}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper ---------- */
function SummaryItem({ label, children }) {
  return (
    <div className="border-b border-gray-700 py-4">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="font-medium text-gray-200">{children}</p>
    </div>
  );
}
