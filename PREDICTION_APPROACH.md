# Prediction Approach: Sell-Out Risk Model

## 1. Problem Statement Alignment

The requirement asks for a **"Confirmation Booking Prediction"**.
In the context of an **Instant Booking System** (where there is no "Waitlist"), "Confirmation" is guaranteed _unless_ the bus sells out.

Therefore, **Confirmation Probability** is interpreted as the inverse of **Sell-Out Risk**:

> **Confirmation Probability (%) = 100% - Sell Out Risk (%)**

- _Example_: If there is an **85% Sell-Out Risk** (High Demand), the user effectively has only a **15% Chance of Confirmation** if they delay booking.
- _Implementation_: The "Risk" is modeled because it acts as a stronger CTA (Call to Action) for the user to "Book Now".

## 2. Prediction Logic & Model Choice

**Model Type**: K-Nearest Neighbors (KNN) Machine Learning.
**Why this model?**:
A data-driven approach allows the system to learn from historical patterns rather than relying on static rules. The KNN algorithm effectively clusters similar booking scenarios to predict outcomes based on past events.

### The Algorithm

The model calculates a `Risk Score (0-100%)` by finding the 7 most similar historical trips based on:

1.  **Time Decay (Distance)**:
    - Normalizes the days remaining until travel.
    - Closely matches scenarios with similar lead times.
2.  **Seasonality (Distance)**:
    - Distinguishes between Weekday and Weekend demand patterns.
3.  **Scarcity (Distance)**:
    - Compares current occupancy rates with historical data.
    - Heavily weighted to reflect the "Social Proof" effect.

---

## 2. Training Dataset

A dataset of **800+ scenarios** is used to train the model, providing a robust historical basis for predictions.

**File**: [mock_training_dataset.csv](./mock_training_dataset.csv)

### Sample Data Preview:

| Day Type | Days Before | Booked | Risk Result                              |
| -------- | ----------- | ------ | ---------------------------------------- |
| Weekday  | 15          | 2/30   | **Safe** (Low probability of filling up) |
| Sunday   | 3           | 25/30  | **Sell Out Likely** (High Urgency)       |
| Weekday  | 0 (Today)   | 28/30  | **Sell Out Likely** (Last Minute Rush)   |

---

## 3. Methodology

The system loads the dataset into memory on startup. When a prediction is requested:

1.  **Normalization**: Input features are scaled to a 0-1 range.
2.  **Neighbor Search**: The algorithm calculates the Euclidean distance to all training points.
3.  **Voting**: The 7 nearest neighbors are selected, and their risk scores are aggregated (weighted by proximity).
4.  **Classification**: The final score is mapped to a label (Safe, Medium Risk, High Risk).

---

## 4. Final Prediction Output

The API outputs a JSON object used by the Frontend to display the "Risk Badge".

**API Response**:

```json
{
  "prediction": {
    "score": 85,
    "label": "High Risk",
    "features": {
      "daysLeft": 2,
      "isWeekend": true,
      "occupancyRate": "60%",
      "modelType": "ML"
    }
  }
}
```

**User Interface**:

- **< 50%**: 🌱 Green Badge ("Safe")
- **50% - 80%**: ⚠️ Amber Badge ("Medium Risk")
- **> 80%**: 🔥 Red Badge ("High Sell-Out Chance")
- **100%**: 🛑 Red Badge ("Sold Out")
