/**
 * SELL-OUT RISK PREDICTION MODEL
 * Type: Rule-Based Heuristic / Simulation
 * 
 * This model calculates the probability of a bus selling out based on:
 * 1. Time Decay (Days remaining until travel)
 * 2. Seasonality (Weekend vs Weekday)
 * 3. Supply Scarcity (Current Occupancy %)
 */

import { loadModel, predictRisk } from './knnModel.js';

// Attempt to train/load the model on startup
const isModelLoaded = loadModel();

export function predictSellOutRisk(journeyDate, totalSeats, bookedCount) {
    // 0. Immediate "Sold Out" Check (Deterministic, always keeps this)
    if (totalSeats > 0 && bookedCount >= totalSeats) {
        return {
            score: 105, // >100 to sort at top
            label: "Sold Out",
            features: {
                daysLeft: 0,
                isWeekend: false,
                occupancyRate: "100%"
            }
        };
    }

    // 1. Feature Engineering
    const travelDate = new Date(journeyDate);
    const today = new Date();
    
    // Calculate Days Left (Lead Time)
    const diffTime = travelDate - today;
    const daysLeft = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0); 

    // Calculate Weekday (0=Sun, 6=Sat)
    const dayOfWeek = travelDate.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6);

    // Calculate Occupancy Ratio
    const occupancyRate = totalSeats > 0 ? (bookedCount / totalSeats) : 0;

    // 2. Machine Learning Inference (K-Nearest Neighbors)
    let mlResult = null;
    if (isModelLoaded) {
        mlResult = predictRisk(daysLeft, isWeekend, occupancyRate);
    }

    // 3. Fallback / Hybrid Logic
    // If ML prediction exists, use it. Otherwise, use legacy heuristic.
    if (mlResult) {
        return {
            score: mlResult.score,
            label: mlResult.label,
            features: {
                daysLeft,
                isWeekend,
                occupancyRate: (occupancyRate * 100).toFixed(1) + "%",
                modelType: "ML (KNN)" // Debug info
            }
        };
    }

    // --- LEGACY FALLBACK (Rule Based) ---
    // Kept for safety if CSV is missing
    let probability = 10; 

    if (daysLeft <= 1) probability += 50;
    else if (daysLeft <= 3) probability += 30;
    else if (daysLeft <= 7) probability += 15;

    if (isWeekend) probability += 20;

    probability += (occupancyRate * 50);

    if (occupancyRate > 0.9) probability = Math.max(probability, 90);

    probability = Math.min(Math.round(probability), 99);
    probability = Math.max(probability, 10);

    let label = "Safe";
    if (probability > 80) label = "High Risk";
    else if (probability > 50) label = "Medium Risk";

    return {
        score: probability,
        label: label,
        features: {
            daysLeft,
            isWeekend,
            occupancyRate: (occupancyRate * 100).toFixed(1) + "%",
            modelType: "Heuristic (Fallback)"
        }
    };
}
