import axios from "axios";

async function testBooking() {
  console.log("🚀 Sending Test Booking Request...");
  try {
    const response = await axios.post("http://localhost:5000/api/bookings", {
      email: "debug_user@example.com",
      journeyDate: "2026-01-23",
      fromIndex: 0,
      toIndex: 6,
      seatIds: ["4 UB"],
      passengerGenders: ["Male"], // Assuming single seat
      meals: [],
      totalAmount: 1390
    });
    console.log("✅ Success:", response.data);
  } catch (err) {
    if (err.response) {
      console.error("❌ Failed Status:", err.response.status);
      console.error("❌ Failed Data:", err.response.data);
    } else {
      console.error("❌ Network Error:", err.message);
    }
  }
}

testBooking();
