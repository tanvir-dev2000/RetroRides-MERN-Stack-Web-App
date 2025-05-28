const express = require('express');
const router = express.Router();
const { getGeminiReply } = require('../utils/geminiApi');

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    const reply = await getGeminiReply(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Gemini API error", details: err.message });
  }
});

module.exports = router;
