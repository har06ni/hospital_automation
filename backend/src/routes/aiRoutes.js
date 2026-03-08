const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const aiService = require('../services/aiService');

/**
 * @route   POST /api/ai/patient-ask
 * @desc    Get an AI response for a patient's question
 * @access  Private (Patient only)
 */
router.post('/patient-ask', protect, authorize('patient'), async (req, res) => {
    try {
        const { question, context } = req.body;

        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        // AIService handles the sanitization andGemini interaction
        const response = await aiService.askPatientQuestion(
            req.user._id,
            question,
            context || {}
        );

        res.json({ response });
    } catch (error) {
        console.error('AI Route Error:', error);
        res.status(500).json({ message: 'Error processing AI request' });
    }
});

module.exports = router;
