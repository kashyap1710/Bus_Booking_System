# Prediction Approach: Sell-Out Risk Model

## 1. Problem Statement Alignment

The requirement asks for a **"Confirmation Booking Prediction"**.
In the context of an **Instant Booking System** (where there is no "Waitlist"), "Confirmation" is guaranteed _unless_ the bus sells out.

Therefore, we interpret **Confirmation Probability** as the inverse of **Sell-Out Risk**:

> **Confirmation Probability (%) = 100% - Sell Out Risk (%)**

- _Example_: If there is an **85% Sell-Out Risk** (High Demand), the user effectively has only a **15% Chance of Confirmation** if they delay booking.
- _Implementation_: We model the "Risk" because it acts as a stronger CTA (Call to Action) for the user to "Book Now".

## 2. Prediction Logic & Model Choice

**Model Type**: Rule-Based Heuristic (Simulated Decision Tree).  
**Why this model?**:
In the absence of years of historical booking data, a **Heuristic Model** is the industry standard for MVP (Minimum Viable Product). It encodes expert knowledge about travel patterns directly into logic.

### The Algorithm

The model calculates a `Risk Score (0-100%)` based on three weighted factors:

1.  **Time Decay (Weight: 50%)**:
    - _Assumption_: Urgency increases exponentially as the travel date approaches.
    - _Logic_: Same-day travel gets a massive +50% risk score boost.
2.  **Seasonality (Weight: 20%)**:
    - _Assumption_: Weekends (Fri-Sun) have naturally higher traffic.
    - _Logic_: If `Day == Weekend`, add +20% risk.
3.  **Scarcity (Weight: 50%)**:
    - _Assumption_: "Social Proof" drives panic buying. If a bus is 80% full, the last 20% sells out continuously.
    - _Logic_: `Current_Occupancy_Rate * 50`.

---

## 2. Mock Training Dataset

We simulated a dataset of **10 distinct scenarios** to validate our weights. This dataset demonstrates the correlation between "Weekend/Proximity" and "Sell-Out".

**File**: [mock_training_dataset.csv](./mock_training_dataset.csv)

### Sample Data Preview:

| Day Type | Days Before | Booked | Risk Result                              |
| -------- | ----------- | ------ | ---------------------------------------- |
| Weekday  | 15          | 2/30   | **Safe** (Low probability of filling up) |
| Sunday   | 3           | 25/30  | **Sell Out Likely** (High Urgency)       |
| Weekday  | 0 (Today)   | 28/30  | **Sell Out Likely** (Last Minute Rush)   |

---

## 3. Training Methodology

Since this is a simulated model, "Training" involved **Parameter Tuning** using the mock dataset:

1.  **Run 1**: We initially set "Weekend Weight" to 10%. The model predicted "Safe" for Saturday/Sunday (False Negative).
2.  **Adjustment**: We increased "Weekend Weight" to 20%.
3.  **Run 2**: The model correctly flagged Saturday trips as "High Risk".

This manual tuning ensures the model behaves realistically without requiring a Neural Network.

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
      "occupancyRate": "60%"
    }
  }
}
```

**User Interface**:

- **< 50%**: 🌱 Green Badge ("Safe")
- **50% - 80%**: ⚠️ Amber Badge ("Medium Risk")
- **> 80%**: 🔥 Red Badge ("High Sell-Out Chance")
