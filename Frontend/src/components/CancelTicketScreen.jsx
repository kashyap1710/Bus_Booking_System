import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import RouteIndicator from "./RouteIndicator";

export default function CancelTicketScreen({
  bookingData,
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

  const [lastUpdate, setLastUpdate] = useState(Date.now());

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

        const availableSeats = response.data.seats;
        
        setSeats((prevSeats) =>
          prevSeats.map((seat) => {
            const apiSeat = availableSeats.find((s) => s.seatNumber === seat.label);
            const isBooked = apiSeat ? !apiSeat.available : false;
            
            if (isBooked) return { 
              ...seat, 
              status: "booked", 
              gender: apiSeat.gender,
              passengerName: apiSeat.passengerName, 
              bookingId: apiSeat.bookingId 
            }; 
            return { ...seat, status: "available" };
          })
        );
      } catch (error) {
        console.error("Failed to fetch availability", error);
      }
    };

    fetchAvailability();
  }, [bookingData.date, bookingData.fromStopIndex, bookingData.toStopIndex, lastUpdate]);

  // Handle Cancellation
  const handleCancelSeat = async (seat) => {
    if (!seat.bookingId) return;
    
    // Using native confirm for simplicity
    if (confirm(`Are you sure you want to cancel the ticket for ${seat.passengerName || "this passenger"}?`)) {
      try {
        await axios.post("http://localhost:5000/api/bookings/cancel", { bookingId: seat.bookingId });
        alert("Booking cancelled successfully!");
        setLastUpdate(Date.now()); // Re-fetch data
      } catch (error) {
        console.error("Cancellation failed", error);
        alert("Failed to cancel booking.");
      }
    }
  };

  const seatClass = (seat) => {
    if (seat.status === "booked")
      return seat.gender === "Female"
        ? "bg-pink-500 border-pink-600 text-white cursor-pointer hover:bg-pink-600"
        : "bg-blue-500 border-blue-600 text-white cursor-pointer hover:bg-blue-600";
    return "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed opacity-50";
  };

  const renderSeat = (seat) => {
    const isBooked = seat.status === "booked";

    return (
      <div key={seat.id} className="relative group">
        <button
          onClick={() => isBooked && handleCancelSeat(seat)}
          disabled={!isBooked}
          className={`w-14 h-24 rounded-xl border-2 text-xs font-medium flex flex-col items-center justify-center relative ${seatClass(
            seat
          )}`}
        >
          <span>{seat.label}</span>
          
          {isBooked && (
            <span className="text-[10px] mt-1 truncate w-full px-1 opacity-80">
              {seat.passengerName ? seat.passengerName.split(" ")[0] : "Booked"}
            </span>
          )}
        </button>

        {/* Hover Tooltip for Full Name */}
        {isBooked && seat.passengerName && (
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none">
            {seat.passengerName}
          </div>
        )}
      </div>
    );
  };

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
            <h1 className="text-3xl font-semibold text-white">Cancel Ticket</h1>
            <p className="text-red-400 mt-1 text-sm">
              Tap a booked seat to cancel it
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
            <Legend color="bg-gray-700 border-gray-500 opacity-50" label="Empty" />
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
        </div>
      </div>
    </div>
  );
}

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
