import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import RouteIndicator from "./RouteIndicator";

export default function SeatSelectionScreen({
  bookingData,
  updateBookingData,
  onNext,
  onBack,
}) {
  const [seats, setSeats] = useState([
    { id: "U1", label: "1 UB", status: "available" },
    { id: "U4", label: "4 UB", status: "available" },
    { id: "U7", label: "7 UB", status: "available" },
    { id: "U10", label: "10 UB", status: "available" },
    { id: "U13", label: "13 UB", status: "available" },

    { id: "U2", label: "2 UB", status: "available" },
    { id: "U5", label: "5 UB", status: "available" },
    { id: "U8", label: "8 UB", status: "available" },
    { id: "U11", label: "11 UB", status: "available" },
    { id: "U14", label: "14 UB", status: "available" },

    { id: "U3", label: "3 UB", status: "available" },
    { id: "U6", label: "6 UB", status: "available" },
    { id: "U9", label: "9 UB", status: "available" },
    { id: "U12", label: "12 UB", status: "available" },
    { id: "U15", label: "15 UB", status: "available" },

    { id: "L1", label: "1 LB", status: "available" },
    { id: "L4", label: "4 LB", status: "available" },
    { id: "L7", label: "7 LB", status: "available" },
    { id: "L10", label: "10 LB", status: "available" },
    { id: "L13", label: "13 LB", status: "available" },

    { id: "L2", label: "2 LB", status: "available" },
    { id: "L5", label: "5 LB", status: "available" },
    { id: "L8", label: "8 LB", status: "available" },
    { id: "L11", label: "11 LB", status: "available" },
    { id: "L14", label: "14 LB", status: "available" },

    { id: "L3", label: "3 LB", status: "available" },
    { id: "L6", label: "6 LB", status: "available" },
    { id: "L9", label: "9 LB", status: "available" },
    { id: "L12", label: "12 LB", status: "available" },
    { id: "L15", label: "15 LB", status: "available" },
  ]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/availability", {
          params: {
            journeyDate: bookingData.date,
            fromIndex: bookingData.fromStopIndex,
            toIndex: bookingData.toStopIndex,
          },
        });

        const availableSeats = response.data; // Array of seat objects { seatNumber, available, ... }
        
        setSeats((prevSeats) =>
          prevSeats.map((seat) => {
            const apiSeat = availableSeats.find((s) => s.seatNumber === seat.label);
            const isBooked = apiSeat ? !apiSeat.available : false;
            
            // Should not overwrite 'selected' if still valid, unless it became booked
            if (isBooked) return { ...seat, status: "booked", gender: apiSeat.gender }; // Use API gender
            if (seat.status === "selected") return seat;
            return { ...seat, status: "available" };
          })
        );
      } catch (error) {
        console.error("Failed to fetch availability", error);
      }
    };

    fetchAvailability();
  }, [bookingData.date, bookingData.fromStopIndex, bookingData.toStopIndex]);

  const handleSeatClick = (id) => {
    setSeats((prev) => {
      const seat = prev.find((s) => s.id === id);
      if (!seat || seat.status === "booked") return prev;

      const selectedCount = prev.filter((s) => s.status === "selected").length;
      const isSelected = seat.status === "selected";

      if (!isSelected && selectedCount >= bookingData.passengers) return prev;

      const updated = prev.map((s) =>
        s.id === id
          ? { ...s, status: isSelected ? "available" : "selected" }
          : s,
      );

      updateBookingData({
        selectedSeats: updated
          .filter((s) => s.status === "selected")
          .map((s) => s.label),
      });

      return updated;
    });
  };

  const seatClass = (seat) => {
    if (seat.status === "selected")
      return "bg-green-500 border-green-600 text-white";
    if (seat.status === "booked")
      return seat.gender === "Female"
        ? "bg-pink-500 border-pink-600 text-white cursor-not-allowed"
        : "bg-blue-500 border-blue-600 text-white cursor-not-allowed";
    return "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700";
  };

  const renderSeat = (seat) => (
    <button
      key={seat.id}
      onClick={() => handleSeatClick(seat.id)}
      disabled={seat.status === "booked"}
      className={`w-14 h-24 rounded-xl border-2 text-xs font-medium flex items-center justify-center ${seatClass(
        seat,
      )}`}
    >
      {seat.label}
    </button>
  );

  const cols = {
    u1: seats.slice(0, 5),
    u2: seats.slice(5, 10),
    u3: seats.slice(10, 15),
    l1: seats.slice(15, 20),
    l2: seats.slice(20, 25),
    l3: seats.slice(25, 30),
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <ArrowLeft className="text-gray-400" />
          </button>

          <div className="text-center flex-1">
            <h1 className="text-3xl font-semibold text-white">Select Your Sleeper Seat</h1>
            <p className="text-gray-400 mt-1">
              {bookingData.from} → {bookingData.to}
            </p>
            <div className="mt-4">
              <RouteIndicator
                fromIndex={bookingData.fromStopIndex}
                toIndex={bookingData.toStopIndex}
              />
            </div>
          </div>

          <div className="w-10" />
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg shadow-black/30 p-8">
          {/* Legend */}
          <div className="flex justify-center gap-6 text-sm mb-6 flex-wrap">
            <Legend color="bg-gray-700 border-gray-500" label="Available" />
            <Legend color="bg-green-500" label="Selected" />
            <Legend color="bg-blue-500" label="Booked (Male)" />
            <Legend color="bg-pink-500" label="Booked (Female)" />
          </div>

          {/* Seat Layout */}
          <div className="max-w-lg mx-auto">
            <div className="flex justify-end mb-4">
              <div className="w-14 h-14 rounded-lg border border-gray-600 bg-gray-700 flex items-center justify-center text-gray-400">
                🛞
              </div>
            </div>

            <div className="flex justify-center gap-40 relative">
              {/* Upper */}
              <Berth
                title="Upper Berth"
                left={cols.u1}
                r1={cols.u2}
                r2={cols.u3}
                renderSeat={renderSeat}
              />

              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600" />

              {/* Lower */}
              <Berth
                title="Lower Berth"
                left={cols.l1}
                r1={cols.l2}
                r2={cols.l3}
                renderSeat={renderSeat}
              />
            </div>
          </div>

          {bookingData.selectedSeats.length > 0 && (
            <div className="mt-6 bg-blue-900/20 p-4 rounded-xl text-center text-white">
              Selected Seats:{" "}
              <span className="font-medium text-blue-400">
                {bookingData.selectedSeats.join(", ")}
              </span>
            </div>
          )}

          <button
            onClick={onNext}
            disabled={
              bookingData.selectedSeats.length !== bookingData.passengers
            }
            className="w-full mt-6 py-4 rounded-xl bg-blue-600 text-white text-lg font-medium
                       hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded border ${color}`} />
      <span className="text-gray-300">{label}</span>
    </div>
  );
}

function Berth({ title, left, r1, r2, renderSeat }) {
  return (
    <div>
      <h3 className="text-center text-xs font-medium text-gray-400 uppercase mb-3">
        {title}
      </h3>
      <div className="flex gap-8">
        <div className="space-y-2">{left.map(renderSeat)}</div>
        <div className="w-6" />
        <div className="space-y-2">
          {r1.map((s, i) => (
            <div key={s.id} className="flex gap-1">
              {renderSeat(s)}
              {renderSeat(r2[i])}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
