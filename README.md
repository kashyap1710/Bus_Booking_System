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

## 🏃‍♂️ How to Run

1.  **Backend**:
    ```bash
    cd Backend
    npm install
    npm run dev
    ```
2.  **Frontend**:
    ```bash
    cd Frontend
    npm install
    npm run dev
    ```

## 📸 Prototype Info (Part 2)

This live code repository serves as the **High-Fidelity Prototype**.
Run the application locally to test the User Flow: `http://localhost:5173`.

## 🧪 Quality Assurance (Part 1)

- [Test Cases & QA Document](./Test_Cases.txt)
- [System Architecture Documentation](./Sleeper_Bus_System_Documentation.txt)

## 🧠 Data Science (Part 4)

- [Prediction Approach & Model](./PREDICTION_APPROACH.md)
- [Mock Training Dataset](./mock_training_dataset.csv)
