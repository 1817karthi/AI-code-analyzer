const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const Session = require('../models/Session');

// Detect language from file extension
function detectLanguage(filename) {
  const ext = path.extname(filename).toLowerCase().slice(1);
  const langMap = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', java: 'java', go: 'go', cpp: 'cpp', c: 'c',
    cs: 'csharp', rb: 'ruby', php: 'php', rs: 'rust', swift: 'swift',
    kt: 'kotlin', scala: 'scala', html: 'html', css: 'css',
    scss: 'scss', json: 'json', sql: 'sql', sh: 'shell', bash: 'shell',
    md: 'markdown', yaml: 'yaml', yml: 'yaml', xml: 'xml',
    vue: 'vue', dart: 'dart', lua: 'lua', r: 'r',
  };
  return langMap[ext] || 'plaintext';
}

// POST /api/upload — upload files
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

    let session = await Session.findOne({ sessionId });
    if (!session) {
      session = new Session({ sessionId, codeFiles: [], messages: [] });
    }

    const uploadedFiles = [];

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const content = fs.readFileSync(file.path, 'utf-8');
        const language = detectLanguage(file.originalname);
        
        // Remove existing file with same name if present
        session.codeFiles = session.codeFiles.filter(f => f.filename !== file.originalname);
        
        session.codeFiles.push({
          filename: file.originalname,
          language,
          content,
          size: file.size,
        });
        uploadedFiles.push({ filename: file.originalname, language, size: file.size });

        // Clean up uploaded temp file
        fs.unlinkSync(file.path);
      }
    }

    // Handle pasted code
    if (req.body.pastedCode && req.body.pastedCode.trim()) {
      const filename = req.body.pastedFilename || 'pasted-code.txt';
      const language = detectLanguage(filename);
      
      session.codeFiles = session.codeFiles.filter(f => f.filename !== filename);
      session.codeFiles.push({
        filename,
        language,
        content: req.body.pastedCode,
        size: Buffer.byteLength(req.body.pastedCode, 'utf8'),
      });
      uploadedFiles.push({ filename, language });
    }

    // Auto-title the session
    if (session.title === 'New Session' && session.codeFiles.length > 0) {
      session.title = session.codeFiles[0].filename;
    }

    await session.save();

    res.json({
      success: true,
      files: uploadedFiles,
      allFiles: session.codeFiles.map(f => ({
        filename: f.filename,
        language: f.language,
        size: f.size,
        contentPreview: f.content.slice(0, 200),
      })),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// DELETE /api/upload/file — remove a file from session
router.delete('/file', async (req, res) => {
  try {
    const { sessionId, filename } = req.body;
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    session.codeFiles = session.codeFiles.filter(f => f.filename !== filename);
    await session.save();

    res.json({ success: true, allFiles: session.codeFiles.map(f => ({ filename: f.filename, language: f.language })) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
