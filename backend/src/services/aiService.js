const { GoogleGenerativeAI } = require('@google/generative-ai');
const AIAudit = require('../models/AIAudit');

/**
 * AI Service: Manages interactions with Gemini AI
 * Focuses on medical safety, privacy, and patient assistance.
 */
class AIService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            console.warn('WARNING: Gemini API Key is missing. AI Assistant will run in MOCK mode.');
            this.mockMode = true;
        } else {
            const genAI = new GoogleGenerativeAI(apiKey);
            this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            this.mockMode = false;
        }
    }

    /**
     * System instruction to enforce safety and boundaries
     */
    getSystemPrompt() {
        return `
            You are a professional Medical Assistant for "Hospital Automate".
            Your goal is to answer patient's health-related questions SAFELY and RESPONSIBLY.

            CORE DIRECTIVES:
            1. SIMPLE LANGUAGE: Explain medical terms and vitals in simple, patient-friendly terms.
            2. NO DIAGNOSIS: Never diagnose a condition. Say "Only your doctor can provide a definitive diagnosis."
            3. NO PRESCRIPTION: Never recommend specific medicines or dosages.
            4. HOSPITAL GUIDANCE: Guide patients on hospital processes (appointments, diet, reports).
            5. EMERGENCY TRIGGER: If the question mentions "chest pain", "shortness of breath", "severe bleeding", or symptoms of a stroke/heart attack, STOP everything and say: "URGENT: Please notify the clinical staff immediately or use the RED EMERGENCY button on your dashboard. These symptoms require immediate medical attention."

            DISCLAIMER: Every response MUST end with "Disclaimer: This information is for guidance only. Please consult your attending doctor for medical decisions."
        `.trim();
    }

    /**
     * Process a patient question with context
     */
    async askPatientQuestion(patientId, question, context) {
        // Anonymized context for safety
        const anonymizedContext = {
            age: context.age,
            gender: context.gender,
            diagnosis: context.diagnosisSummary,
            vitals: context.vitals
        };

        let aiResponse;

        if (this.mockMode) {
            aiResponse = `[MOCK RESPONSE] Based on your vitals (SpO2: ${context.vitals?.spo2}%), your oxygen saturation is within a normal range. It measures how much oxygen your red blood cells are carrying. \n\nDisclaimer: This information is for guidance only. Please consult your attending doctor for medical decisions.`;
        } else {
            try {
                const prompt = `
                    System Context: ${this.getSystemPrompt()}
                    Patient Context (Anonymized): ${JSON.stringify(anonymizedContext)}
                    
                    Patient Question: "${question}"
                    
                    Respond as the Patient Assistant:
                `;

                const result = await this.model.generateContent(prompt);
                aiResponse = result.response.text();
            } catch (error) {
                console.error('Gemini AI Error:', error);
                aiResponse = "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again or ask your nurse.";
            }
        }

        // Audit Log for Admin Review
        await AIAudit.create({
            patientId,
            question,
            response: aiResponse,
            context: anonymizedContext
        });

        return aiResponse;
    }
}

module.exports = new AIService();
