const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const LANGUAGE_LABELS = {
  js: 'JavaScript', jsx: 'React JSX', ts: 'TypeScript', tsx: 'React TSX',
  py: 'Python', java: 'Java', go: 'Go', cpp: 'C++', c: 'C',
  cs: 'C#', rb: 'Ruby', php: 'PHP', rs: 'Rust', swift: 'Swift',
  kt: 'Kotlin', scala: 'Scala', html: 'HTML', css: 'CSS',
  scss: 'SCSS', json: 'JSON', sql: 'SQL', sh: 'Shell',
};

function buildCodeContext(codeFiles) {
  if (!codeFiles || codeFiles.length === 0) return '';
  return codeFiles
    .map(
      (f) =>
        `### File: ${f.filename} (${f.language})\n\`\`\`${f.language}\n${f.content}\n\`\`\``
    )
    .join('\n\n');
}

function buildSystemPrompt(actionType, codeContext, targetLanguage) {
  const base = `You are an expert AI code assistant with deep knowledge across all programming languages and frameworks. 
You analyze code and provide clear, accurate, and helpful responses.
Always format code blocks with proper markdown syntax highlighting.
Be concise but thorough.`;

  const codeSection = codeContext
    ? `\n\n## Code to Analyze:\n${codeContext}`
    : '';

  const actionPrompts = {
    explain: `${base}\n\nTask: Provide a comprehensive explanation of what this code does. Include:
- High-level overview
- Key functions/classes and their purposes  
- Data flow and logic
- Any notable patterns or architecture decisions${codeSection}`,

    debug: `${base}\n\nTask: Perform a thorough code review and bug analysis. Identify:
- Bugs and logical errors
- Security vulnerabilities
- Edge cases not handled
- Bad practices
- Provide specific fixes with corrected code examples${codeSection}`,

    optimize: `${base}\n\nTask: Analyze the code for performance and quality improvements. Suggest:
- Performance optimizations
- Memory efficiency improvements
- Code readability improvements
- Better algorithms or data structures
- Provide optimized code examples${codeSection}`,

    convert: `${base}\n\nTask: Convert the provided code to ${targetLanguage || 'the requested language'}. 
- Maintain the same logic and functionality
- Use idiomatic patterns for the target language
- Add appropriate comments
- Explain any significant differences${codeSection}`,

    document: `${base}\n\nTask: Generate comprehensive documentation for this code. Include:
- File/module overview
- JSDoc/docstrings for all functions and classes
- Parameter and return type documentation
- Usage examples
- Any important notes or warnings${codeSection}`,

    chat: `${base}${codeSection}`,
  };

  return actionPrompts[actionType] || actionPrompts.chat;
}

async function analyzeWithGemini({ codeFiles, question, actionType, targetLanguage }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const codeContext = buildCodeContext(codeFiles);
  const systemPrompt = buildSystemPrompt(actionType, codeContext, targetLanguage);

  const userMessage = question || getDefaultQuestion(actionType);

  const prompt = `${systemPrompt}\n\n## User Question:\n${userMessage}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

function getDefaultQuestion(actionType) {
  const defaults = {
    explain: 'Please explain this code in detail.',
    debug: 'Please find all bugs, security issues, and problems in this code.',
    optimize: 'Please suggest optimizations and improvements for this code.',
    convert: 'Please convert this code to the target language.',
    document: 'Please generate comprehensive documentation for this code.',
  };
  return defaults[actionType] || 'Please analyze this code.';
}

module.exports = { analyzeWithGemini, LANGUAGE_LABELS };
