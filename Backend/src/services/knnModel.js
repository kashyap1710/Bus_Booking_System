
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial empty dataset
let trainingData = [];

// Mapping labels to risk scores for regression/averaging
const LABEL_SCORES = {
    'Safe': 10,
    'Medium Risk': 50,
    'High Risk': 80,
    'Sell Out Likely': 95
};

// Normalize features for distance calculation
function normalize(val, min, max) {
    return (val - min) / (max - min);
}

// Load based on file structure
export function loadModel() {
    try {
        // Construct path to CSV relative to this service file
        const csvPath = path.resolve(__dirname, '../../../../mock_training_dataset.csv');
        
        if (!fs.existsSync(csvPath)) {
            console.warn(`[ML Model] Dataset not found at ${csvPath}. Using Rule Based System.`);
            return false;
        }

        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const rows = fileContent.split('\n').filter(r => r.trim() !== '');
        
        // Skip header
        const dataRows = rows.slice(1);
        
        trainingData = dataRows.map(row => {
            const cols = row.split(',');
            if (cols.length < 7) return null;

            // Columns: Journey_Date, Day_Type, Days_Before_Travel, Booked_Seats, Total_Seats, Occupancy_Percent, Outcome_Label
            // We need: Days_Before_Travel, Day_Type (as boolean), Occupancy_Percent, Outcome_Label
            
            const daysLeft = parseFloat(cols[2]);
            const dayType = cols[1].trim(); 
            // Treat Friday, Saturday, Sunday as Weekend (High demand)
            const isWeekend = ['Friday', 'Saturday', 'Sunday'].includes(dayType) ? 1 : 0;
            
            const occupancyStr = cols[5].replace('%', '');
            const occupancyRate = parseFloat(occupancyStr) / 100;

            const label = cols[6].trim();
            const score = LABEL_SCORES[label] || 10;

            return {
                features: { daysLeft, isWeekend, occupancyRate },
                label,
                score
            };
        }).filter(item => item !== null);

        console.log(`[ML Model] Trained on ${trainingData.length} records.`);
        return true;
    } catch (error) {
        console.error("[ML Model] Failed to load dataset:", error);
        return false;
    }
}

// K-Nearest Neighbors Algorithm
export function predictRisk(inputDaysLeft, inputIsWeekend, inputOccupancyRate) {
    if (trainingData.length === 0) {
        // Fallback if data not loaded
        return null;
    }

    // 1. Normalize Inputs (based on approximate dataset ranges)
    // Days: 0-60, Occupancy: 0-1, Weekend: 0-1
    const normDays = normalize(Math.min(inputDaysLeft, 60), 0, 60);
    const normOcc = inputOccupancyRate; // Already 0-1
    const normWeekend = inputIsWeekend ? 1 : 0;

    // 2. Calculate Distances
    const neighbors = trainingData.map(point => {
        const dDays = normalize(Math.min(point.features.daysLeft, 60), 0, 60) - normDays;
        const dOcc = point.features.occupancyRate - normOcc;
        const dWeek = point.features.isWeekend - normWeekend;

        // Euclidean Distance
        // Weighted: Occupancy is very important (weight 2), Time is important (1.5), Weekend (1)
        const distance = Math.sqrt(
            (dDays * 1.5) ** 2 + 
            (dOcc * 2.0) ** 2 + 
            (dWeek * 1.0) ** 2
        );

        return { ...point, distance };
    });

    // 3. Sort by Distance (Ascending)
    neighbors.sort((a, b) => a.distance - b.distance);

    // 4. Select Top K
    const K = 7; 
    const kNearest = neighbors.slice(0, K);

    // 5. Aggregate Results (Weighted Average by Inverse Distance)
    let totalWeight = 0;
    let weightedScore = 0;

    kNearest.forEach(n => {
        const weight = 1 / (n.distance + 0.0001); // Avoid div by zero
        weightedScore += n.score * weight;
        totalWeight += weight;
    });

    let finalScore = weightedScore / totalWeight;

    // Apply Post-Processing / Safety Nets
    // If occupancy > 90%, force extreme risk regardless of neighbors
    if (inputOccupancyRate > 0.9) finalScore = Math.max(finalScore, 95);

    finalScore = Math.min(Math.round(finalScore), 99);
    finalScore = Math.max(finalScore, 10);

    // 6. Determine Label
    let label = "Safe";
    if (finalScore >= 80) label = "High Risk"; // or Sell Out Likely
    else if (finalScore >= 50) label = "Medium Risk";
    
    // Convert generic High Risk to "Sell Out Likely" if score is very high
    if (finalScore >= 90) label = "Sell Out Likely";

    return {
        score: finalScore,
        label: label
    };
}
