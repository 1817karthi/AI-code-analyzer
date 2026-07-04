const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// GET /api/sessions — list all sessions (current session only - returns the one sessionId)
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({}, 'sessionId title codeFiles createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20);
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sessions/:id — get a specific session with all messages
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.id });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sessions — create a new empty session
router.post('/', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const existing = await Session.findOne({ sessionId });
    if (existing) return res.json({ session: existing });

    const session = new Session({ sessionId, codeFiles: [], messages: [] });
    await session.save();
    res.json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/sessions/:id
router.delete('/:id', async (req, res) => {
  try {
    await Session.findOneAndDelete({ sessionId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/sessions/:id/messages — clear chat history
router.delete('/:id/messages', async (req, res) => {
  try {
    await Session.findOneAndUpdate({ sessionId: req.params.id }, { messages: [] });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
