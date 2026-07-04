import React, { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import FileUpload from '../components/FileUpload'
import CodeEditor from '../components/CodeEditor'
import AnalysisTools from '../components/AnalysisTools'
import ChatPanel from '../components/ChatPanel'
import {
  uploadCode,
  uploadPasted,
  analyzeCode,
  getSessions,
  getSession,
  createSession,
  deleteSession,
  clearMessages,
  removeFile,
} from '../services/api'
import { Upload, Code } from 'lucide-react'

// Generate a session ID for this browser session
function getOrCreateSessionId() {
  let id = sessionStorage.getItem('ai_code_session_id')
  if (!id) {
    id = uuidv4()
    sessionStorage.setItem('ai_code_session_id', id)
  }
  return id
}

export default function HomePage() {
  const [sessionId] = useState(getOrCreateSessionId)
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [codeFiles, setCodeFiles] = useState([])
  const [activeFile, setActiveFile] = useState(null)
  const [messages, setMessages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pastedCode, setPastedCode] = useState('')
  const [centerTab, setCenterTab] = useState('upload') // 'upload' | 'editor'
  const [error, setError] = useState(null)

  const hasCode = codeFiles.length > 0

  // Initialize session on mount
  useEffect(() => {
    initSession()
    fetchSessions()
  }, [])

  const initSession = async () => {
    try {
      await createSession(sessionId)
      setActiveSessionId(sessionId)
    } catch (err) {
      console.error('Session init error:', err)
    }
  }

  const fetchSessions = async () => {
    try {
      const res = await getSessions()
      setSessions(res.data.sessions || [])
    } catch (err) {
      console.error('Fetch sessions error:', err)
    }
  }

  const refreshSession = async (sid) => {
    try {
      const res = await getSession(sid)
      const s = res.data.session
      setCodeFiles(s.codeFiles || [])
      setMessages(s.messages || [])
      if (s.codeFiles?.length > 0) {
        setActiveFile(s.codeFiles[0].filename)
        setCenterTab('editor')
      }
    } catch (err) {
      console.error('Refresh session error:', err)
    }
  }

  const handleSelectSession = async (sid) => {
    setActiveSessionId(sid)
    await refreshSession(sid)
    fetchSessions()
  }

  const handleNewSession = () => {
    const newId = uuidv4()
    sessionStorage.setItem('ai_code_session_id', newId)
    window.location.reload()
  }

  const handleDeleteSession = async (sid) => {
    try {
      await deleteSession(sid)
      if (sid === activeSessionId) {
        handleNewSession()
      } else {
        fetchSessions()
      }
    } catch (err) {
      setError('Failed to delete session')
    }
  }

  // File Upload Handler
  const handleFilesSelected = async (files) => {
    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('sessionId', activeSessionId || sessionId)
      files.forEach(f => formData.append('files', f))

      const res = await uploadCode(formData)
      setCodeFiles(res.data.allFiles)
      if (res.data.allFiles.length > 0) {
        setActiveFile(res.data.allFiles[0].filename)
        setCenterTab('editor')
      }
      fetchSessions()
      // Reload full file content
      await refreshSession(activeSessionId || sessionId)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  // Paste Code Handler
  const handlePasteCode = async (code, filename, language) => {
    setIsUploading(true)
    setError(null)
    try {
      await uploadPasted(activeSessionId || sessionId, code, filename)
      await refreshSession(activeSessionId || sessionId)
      setCenterTab('editor')
      fetchSessions()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  // Remove file
  const handleRemoveFile = async (filename) => {
    try {
      await removeFile(activeSessionId || sessionId, filename)
      const updated = codeFiles.filter(f => f.filename !== filename)
      setCodeFiles(updated)
      if (activeFile === filename) {
        setActiveFile(updated[0]?.filename || null)
      }
      if (updated.length === 0) setCenterTab('upload')
    } catch (err) {
      setError(err.message)
    }
  }

  // Send AI message
  const handleSendMessage = async (question, actionType = 'chat', targetLanguage) => {
    setIsLoading(true)
    setError(null)
    const userMsg = { role: 'user', content: question, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])

    try {
      const res = await analyzeCode(activeSessionId || sessionId, question, actionType, targetLanguage)
      const aiMsg = { role: 'assistant', content: res.data.response, timestamp: new Date() }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      const errMsg = { role: 'assistant', content: `❌ Error: ${err.message}`, timestamp: new Date() }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Quick action
  const handleQuickAction = (actionType, question, targetLanguage) => {
    const actionMessages = {
      explain: '🔍 Explain this code in detail',
      debug: '🐛 Find all bugs, security vulnerabilities, and issues in this code',
      optimize: '⚡ Analyze and suggest performance optimizations for this code',
      document: '📝 Generate comprehensive documentation for this code',
    }
    const msg = question || actionMessages[actionType]
    handleSendMessage(msg, actionType, targetLanguage)
  }

  // Clear chat
  const handleClearChat = async () => {
    try {
      await clearMessages(activeSessionId || sessionId)
      setMessages([])
    } catch (err) {
      setMessages([])
    }
  }

  return (
    <div
      className="bg-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 420px',
        gridTemplateRows: '56px 1fr',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Navbar */}
      <div style={{ gridColumn: '1 / -1', gridRow: '1' }}>
        <Navbar sessionId={activeSessionId || sessionId} />
      </div>

      {/* Sidebar */}
      <div style={{ gridColumn: '1', gridRow: '2', overflow: 'hidden', borderRight: '1px solid var(--border-subtle)' }}>
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId || sessionId}
          onNewSession={handleNewSession}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Center Panel */}
      <div style={{
        gridColumn: '2', gridRow: '2', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--border-subtle)',
      }}>
        {/* Center Tab Switch */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0,0,0,0.3)', flexShrink: 0,
        }}>
          {[
            { id: 'upload', icon: Upload, label: 'Upload / Files' },
            { id: 'editor', icon: Code, label: 'Code Editor' },
          ].map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}-btn`}
              onClick={() => setCenterTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '11px 18px',
                background: centerTab === tab.id ? 'rgba(139,92,246,0.12)' : 'transparent',
                borderBottom: centerTab === tab.id ? '2px solid #8b5cf6' : '2px solid transparent',
                border: 'none',
                color: centerTab === tab.id ? '#a78bfa' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'var(--transition)',
              }}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.id === 'upload' && hasCode && (
                <span className="badge badge-green" style={{ fontSize: '10px' }}>
                  {codeFiles.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Center Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {centerTab === 'upload' ? (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <FileUpload
                uploadedFiles={codeFiles}
                onFilesSelected={handleFilesSelected}
                onRemoveFile={handleRemoveFile}
                isUploading={isUploading}
              />
            </div>
          ) : (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <CodeEditor
                  files={codeFiles}
                  activeFile={activeFile}
                  onActiveFileChange={setActiveFile}
                  onPasteCode={handlePasteCode}
                  pastedCode={pastedCode}
                  onPastedCodeChange={setPastedCode}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Toolbar */}
        <AnalysisTools
          onAction={handleQuickAction}
          isLoading={isLoading}
          hasCode={hasCode}
        />

        {/* Error Toast */}
        {error && (
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
              padding: '10px 16px', background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px',
              color: '#f87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
              zIndex: 100,
            }}
          >
            ⚠️ {error}
            <button
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 600 }}
            >✕</button>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      <div style={{ gridColumn: '3', gridRow: '2', overflow: 'hidden' }}>
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          isLoading={isLoading}
          hasCode={hasCode}
        />
      </div>
    </div>
  )
}
