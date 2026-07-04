const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { analyzeWithGemini } = require('../services/gemini');

// POST /api/analyze
router.post('/', async (req, res) => {
  try {
    const { sessionId, question, actionType = 'chat', targetLanguage } = req.body;

    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found. Please upload code first.' });

    if (session.codeFiles.length === 0) {
      return res.status(400).json({ error: 'No code files found. Please upload or paste code first.' });
    }

    const userMessage = question || getDefaultMessage(actionType);

    // Save user message
    session.messages.push({ role: 'user', content: userMessage });

    // Get AI response
    const aiResponse = await analyzeWithGemini({
      codeFiles: session.codeFiles,
      question: userMessage,
      actionType,
      targetLanguage,
    });

    // Save AI response
    session.messages.push({ role: 'assistant', content: aiResponse });
    await session.save();

    res.json({
      success: true,
      response: aiResponse,
      messageCount: session.messages.length,
    });
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

function getDefaultMessage(actionType) {
  const map = {
    explain: '🔍 Explain this code',
    debug: '🐛 Find bugs and security issues',
    optimize: '⚡ Optimize this code',
    convert: '🔄 Convert this code',
    document: '📝 Generate documentation',
  };
  return map[actionType] || 'Analyze this code';
}

module.exports = router;
