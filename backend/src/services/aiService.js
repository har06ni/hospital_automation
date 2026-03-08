const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const AIAudit = require('../models/AIAudit');

/**
 * AI Service: Manages interactions with Gemini AI and Groq
 * Focuses on medical safety, privacy, and patient assistance.
 */
class AIService {
    constructor() {
        // Initialize Gemini
        const geminiKey = process.env.GEMINI_API_KEY;
        if (geminiKey && geminiKey !== 'dummy_gemini_key' && geminiKey !== 'your_gemini_api_key_here') {
            const genAI = new GoogleGenerativeAI(geminiKey);
            this.geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        }

        // Initialize Groq
        const groqKey = process.env.GROQ_API_KEY;
        if (groqKey && groqKey !== 'your_groq_api_key_here') {
            this.groq = new Groq({ apiKey: groqKey });
        }

        this.mockMode = (!this.geminiModel && !this.groq);
        if (this.mockMode) {
            console.warn('WARNING: All AI API Keys are missing. AI Assistant will run in MOCK mode.');
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
            aiResponse = `[MOCK RESPONSE] Using Groq engine (Mock): Regarding your question "${question}", please ensure you follow your prescribed recovery plan. \n\nDisclaimer: This information is for guidance only. Please consult your attending doctor for medical decisions.`;
        } else {
            const prompt = `
                System Context: ${this.getSystemPrompt()}
                Patient Context (Anonymized): ${JSON.stringify(anonymizedContext)}
                
                Patient Question: "${question}"
                
                Respond as the Medical Patient Assistant:
            `;

            try {
                if (this.groq) {
                    // Use Groq if available (preferred)
                    const chatCompletion = await this.groq.chat.completions.create({
                        messages: [
                            { role: 'system', content: this.getSystemPrompt() },
                            { role: 'user', content: `Patient Context: ${JSON.stringify(anonymizedContext)}\n\nQuestion: ${question}` }
                        ],
                        model: 'mixtral-8x7b-32768',
                    });
                    aiResponse = chatCompletion.choices[0].message.content;
                } else if (this.geminiModel) {
                    // Fallback to Gemini
                    const result = await this.geminiModel.generateContent(prompt);
                    aiResponse = result.response.text();
                }
            } catch (error) {
                console.error('AI Provider Error:', error);
                aiResponse = "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again or ask your nurse.";
            }
        }

        // Audit Log for Admin Review
        try {
            await AIAudit.create({
                patientId,
                question,
                response: aiResponse,
                context: anonymizedContext
            });
        } catch (auditError) {
            console.error('Audit Logging Failed:', auditError);
        }

        return aiResponse;
    }
}

module.exports = new AIService();
