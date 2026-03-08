const axios = require('axios');

/**
 * Sends vitals to the AI/ML model and returns a risk prediction.
 * Falls back to a rule-based mock if the service is unreachable.
 */
const predictClinicalRisk = async (vitals, history) => {
    try {
        const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, {
            vitals,
            history: history.slice(0, 5) // Only send recent history
        }, { timeout: 2000 });

        return response.data;
    } catch (error) {
        console.warn('AI/ML Service unreachable, falling back to heuristic engine.');

        // Mock heuristic logic for simulation
        let riskScore = 0.1;
        let suggestion = "Monitor vitals per standard protocol.";

        if (vitals.spo2 < 92) {
            riskScore = 0.95;
            suggestion = "CRITICAL: Urgent Oxygen Therapy & Intubation readiness required.";
        } else if (vitals.spo2 < 95) {
            riskScore = 0.65;
            suggestion = "WARNING: Potential respiratory distress. Increase monitoring frequency.";
        }

        if (vitals.heartRate > 120 || vitals.heartRate < 50) {
            riskScore = Math.max(riskScore, 0.85);
            suggestion += " Cardiac distress detected.";
        }

        return {
            riskScore,
            prediction: riskScore > 0.8 ? 'High Risk' : (riskScore > 0.5 ? 'Moderate Risk' : 'Low Risk'),
            suggestion
        };
    }
};

module.exports = { predictClinicalRisk };
