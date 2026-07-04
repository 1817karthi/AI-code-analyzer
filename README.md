# AI Code Assistant

A full-stack web app where you can upload code files or paste source code, then ask an AI to explain, debug, optimize, convert, or document it.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS v4 + Monaco Editor
- **Backend**: Node.js + Express + Multer
- **Database**: MongoDB + Mongoose  
- **AI**: Google Gemini 1.5 Flash
- **Syntax Highlighting**: Prism.js + react-syntax-highlighter

## Setup

### 1. Configure Environment

Edit `server/.env` and fill in your keys:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-code-analyzer
GEMINI_API_KEY=your_key_here
```

- **Gemini API Key**: [Get one free at Google AI Studio](https://aistudio.google.com/app/apikey)
- **MongoDB**: Either [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB

### 2. Run the Backend

```bash
cd server
npm run dev
```

Server starts at `http://localhost:5000`

### 3. Run the Frontend

```bash
cd client
npm run dev
```

App opens at `http://localhost:5173`

## Features

- 📁 **Drag & Drop Upload** — Upload 30+ code file types (JS, TS, Python, Java, Go, C++, etc.)
- 💻 **Monaco Editor** — VS Code-like editor with syntax highlighting
- 🔍 **Explain** — AI explains what the code does
- 🐛 **Debug** — Finds bugs, security issues, and bad practices
- ⚡ **Optimize** — Suggests performance improvements
- 🔄 **Convert** — Converts code to any other language
- 📝 **Document** — Generates JSDoc/docstrings
- 💬 **Free Chat** — Ask any question about your code
- 📋 **Session History** — Sidebar shows all sessions (current browser session)
