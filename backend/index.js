const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// AI Assistant System Prompt
const SYSTEM_PROMPT = `
You are a professional Hospital AI Assistant. 
Your goal is to help patients and staff with hospital-related questions and provide basic health guidance.

CORE RULES:
1. Provide helpful information about hospital processes, departments, and general health tips.
2. For any serious medical symptoms (like chest pain, severe injury, or breathing issues), ALWAYS explicitly recommend consulting a doctor or visiting an emergency room immediately.
3. Be polite, professional, and clear.
`.trim();

/**
 * @route   POST /api/chat
 * @desc    Get an AI response from Groq
 * @access  Public
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message }
            ],
            model: 'llama3-8b-8192',
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

        res.json({ reply: aiResponse });

    } catch (error) {
        console.error('Groq API Error:', error);
        res.status(500).json({
            error: 'Server Error',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Hospital AI Backend' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Hospital Automation Backend running on port ${PORT}`);
});

module.exports = app; // Export for Vercel/Testing
