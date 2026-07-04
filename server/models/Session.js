const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const codeFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  language: { type: String, default: 'plaintext' },
  content: { type: String, required: true },
  size: { type: Number },
});

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    title: { type: String, default: 'New Session' },
    codeFiles: [codeFileSchema],
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
