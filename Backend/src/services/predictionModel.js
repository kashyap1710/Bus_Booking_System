/**
 * SELL-OUT RISK PREDICTION MODEL
 * Type: Rule-Based Heuristic / Simulation
 * 
 * This model calculates the probability of a bus selling out based on:
 * 1. Time Decay (Days remaining until travel)
 * 2. Seasonality (Weekend vs Weekday)
 * 3. Supply Scarcity (Current Occupancy %)
 */

export function predictSellOutRisk(journeyDate, totalSeats, bookedCount) {
    // 1. Feature Engineering
    const travelDate = new Date(journeyDate);
    const today = new Date();
    
    // Calculate Days Left (Lead Time)
    const diffTime = travelDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Calculate Weekday (0=Sun, 6=Sat)
    const dayOfWeek = travelDate.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6);

    // Calculate Occupancy Ratio
    const occupancyRate = totalSeats > 0 ? (bookedCount / totalSeats) : 0;

    // 2. Inference Logic (The "Weights")
    let probability = 10; // Base Bias

    // Feature A: Time Decay (Closer = Higher Risk)
    // If booking for today/tomorrow, urgency is extreme.
    if (daysLeft <= 1) probability += 50;
    else if (daysLeft <= 3) probability += 30;
    else if (daysLeft <= 7) probability += 15;

    // Feature B: Seasonality (Weekend Boost)
    if (isWeekend) {
        probability += 20;
    }

    // Feature C: Scarcity (The "Social Proof" factor)
    // As seats fill up, panic buying sets in.
    probability += (occupancyRate * 50);

    // 3. Activation / Normalization
    // Cap risk at 99% and floor at 10%
    probability = Math.min(Math.round(probability), 99);
    probability = Math.max(probability, 10);

    // 4. Classification
    let label = "Safe";
    if (probability > 80) label = "High Risk";
    else if (probability > 50) label = "Medium Risk";

    return {
        score: probability,
        label: label,
        features: {
            daysLeft,
            isWeekend,
            occupancyRate: (occupancyRate * 100).toFixed(1) + "%"
        }
    };
}
