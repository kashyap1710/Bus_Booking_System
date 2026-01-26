import { useState } from "react";
import SearchBusScreen from "./components/SearchBusScreen";
import SeatSelectionScreen from "./components/SeatSelectionScreen";
import MealSelectionScreen from "./components/MealSelectionScreen";
import PassengerDetailsScreen from "./components/PassengerDetailsScreen.jsx";
import BookingConfirmationScreen from "./components/BookingConfirmationScreen";
import CancelTicketScreen from "./components/CancelTicketScreen";
import Toast from "./components/Toast";

/* ---------------- BUS STOPS ---------------- */

export const busStops = [
  { name: "Ahmedabad", color: "bg-green-500", distance: 0, time: "05:00 PM" },
  { name: "Vadodara", color: "bg-gray-500", distance: 110, time: "07:00 PM" },
  { name: "Bharuch", color: "bg-gray-500", distance: 190, time: "08:30 PM" },
  { name: "Surat", color: "bg-yellow-500", distance: 265, time: "10:00 PM" },
  { name: "Vapi", color: "bg-pink-500", distance: 385, time: "12:30 AM" },
  { name: "Virar", color: "bg-purple-500", distance: 535, time: "03:30 AM" },
  { name: "Mumbai", color: "bg-blue-500", distance: 595, time: "05:00 AM" },
];

/* ---------------- FARE CALCULATION ---------------- */

export const calculateFare = (fromIndex, toIndex) => {
  const distance = Math.abs(
    busStops[toIndex].distance - busStops[fromIndex].distance,
  );
  // Base fare: ₹200 + ₹2 per km
  return Math.round(200 + distance * 2);
};

/* ---------------- APP ---------------- */

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(1);

  const [bookingData, setBookingData] = useState({
    from: "Ahmedabad",
    to: "Mumbai",
    date: new Date().toISOString().split("T")[0],
    selectedSeats: [],
    passengers: 1,
    meals: {
      veg: 0,
      nonVeg: 0,
    },
    passengerNames: [],
    passengerAges: [],
    passengerGenders: [],
    email: "",
    bookingId: "",
    fromStopIndex: 0,
    toStopIndex: 6,
    ticketPrice: calculateFare(0, 6),
  });

  const updateBookingData = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const goToNextScreen = () => {
    setCurrentScreen((prev) => Math.min(5, prev + 1));
  };

  const goToPreviousScreen = () => {
    setCurrentScreen((prev) => Math.max(1, prev - 1));
  };

  const goHome = () => {
    setBookingData({
      from: "Ahmedabad",
      to: "Mumbai",
      date: new Date().toISOString().split("T")[0],
      selectedSeats: [],
      passengers: 1,
      meals: {
        veg: 0,
        nonVeg: 0,
      },
      passengerNames: [],
      passengerAges: [],
      passengerGenders: [],
      email: "",
      bookingId: "",
      fromStopIndex: 0,
      toStopIndex: 6,
      ticketPrice: calculateFare(0, 6),
    });
    setCurrentScreen(1);
  };

  /* ---------------- TOAST ---------------- */
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      {currentScreen === 1 && (
        <SearchBusScreen
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onNext={goToNextScreen}
          onCancelTicket={() => setCurrentScreen(6)}
        />
      )}

      {currentScreen === 2 && (
        <SeatSelectionScreen
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onNext={goToNextScreen}
          onBack={goToPreviousScreen}
        />
      )}

      {currentScreen === 3 && (
        <MealSelectionScreen
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onNext={goToNextScreen}
          onBack={goToPreviousScreen}
        />
      )}

      {currentScreen === 4 && (
        <PassengerDetailsScreen
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onNext={goToNextScreen}
          onBack={goToPreviousScreen}
          showToast={showToast}
        />
      )}

      {currentScreen === 5 && (
        <BookingConfirmationScreen
          bookingData={bookingData}
          onHome={goHome}
        />
      )}

      {currentScreen === 6 && (
        <CancelTicketScreen
          bookingData={bookingData}
          onBack={goHome}
        />
      )}
    </div>
  );
}
