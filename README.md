# Sleeper Bus Booking System

A full-stack web application for booking sleeper bus tickets between inter-city routes (Ahmedabad - Mumbai).

## 🚀 Key Features (Requirement Part 1)

1.  **Dynamic Route Search**: Search availability based on Date, Origin, and Destination.
2.  **Visual Seat Selection**: Interactive map of Upper/Lower berths with real-time status (Available/Booked).
3.  **Gender-Specific Booking**: Booked seats are color-coded (Blue for Male, Pink for Female) for safety visibility.
4.  **Meal Integration**: Add Veg/Non-Veg meals directly during the checkout flow.
5.  **Smart Partial Booking**: Sophisticated availability engine allows different users to book the _same seat_ for non-overlapping route segments (e.g., A->B and B->C).
6.  **Email Notifications**: instant HTML ticket receipts sent via SMTP.
7.  **Ticket Management**: dedicated interface to cancel regular bookings.

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Drizzle ORM

## 🏃‍♂️ How to Run (Step-by-Step)

### Prerequisites

- Node.js (v16+)
- PostgreSQL Database

### 1. Backend Setup

1.  Navigate to the backend folder:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Database Setup**:
    - Ensure PostgreSQL is running.
    - Create a `.env` file (refer to `.env.example` if available) with your DB credentials.
    - Run migrations to create tables:
      ```bash
      npm run db:generate
      npm run db:migrate
      ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    _Server runs on `http://localhost:5000`_

### 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    _Access the app at `http://localhost:5173`_

## 📸 Prototype Info (Part 2)

This live code repository serves as the **High-Fidelity Prototype**.
Run the application locally to test the User Flow: `http://localhost:5173`.

## 🧪 Quality Assurance (Part 1)

- [Test Cases & QA Document](./Test_Cases.txt)
- [System Architecture Documentation](./Sleeper_Bus_System_Documentation.txt)

## 📊 Sample API Test Result

**Endpoint**: `GET /api/availability`
**Scenario**: Checking availability for a future date (2026-05-20).

**Response Data**:

```json
{
  "seats": [
    {
      "id": 1,
      "seatNumber": "1 LB",
      "available": true,@
      "gender": null
    },
    {
      "id": 13,
      "seatNumber": "1 UB",
      "available": true,
      "gender": null
    },
    "... (truncated for brevity, 30 seats total) ..."
  ],
  "prediction": {
    "score": 10,
    "label": "Safe",
    "features": {
      "daysLeft": 115,
      "isWeekend": false,
      "occupancyRate": "0.0%"
    }
  }
}
```

## 🧠 Data Science Module

- [Prediction Approach & Model](./PREDICTION_APPROACH.md)
- [Training Dataset](./mock_training_dataset.csv)
