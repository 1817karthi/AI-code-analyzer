import React, { useRef, useEffect, useState } from 'react'
import MessageBubble from './MessageBubble'
import { Send, Trash2, Bot, Sparkles } from 'lucide-react'

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <Bot size={15} color="#a78bfa" />
      </div>
      <div style={{
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '4px 16px 16px 16px',
        display: 'flex',
        gap: '5px',
        alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="typing-dot"
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#a78bfa', animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatPanel({ messages, onSendMessage, onClearChat, isLoading, hasCode }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    if (!input.trim() || isLoading || !hasCode) return
    onSendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
      {/* Chat Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0,0,0,0.2)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} color="#8b5cf6" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>AI Assistant</span>
          <span className="badge badge-green" style={{ fontSize: '10px' }}>Online</span>
        </div>
        {messages.length > 0 && (
          <button
            id="clear-chat-btn"
            className="btn-icon"
            onClick={onClearChat}
            title="Clear chat"
          >
            <Trash2 size={14} color="var(--error)" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        id="chat-messages"
        style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}
      >
        {messages.length === 0 ? (
          // Welcome state
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
            <div style={{
              width: '64px', height: '64px', margin: '0 auto 16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
              border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}>
              <Bot size={28} color="#a78bfa" />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Ready to analyze your code
            </p>
            <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
              Upload files or paste code, then use quick actions or ask me anything!
            </p>

            {/* Suggestion chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
              {[
                'Explain the overall architecture',
                'Find potential security vulnerabilities',
                'What does this function do?',
                'How can I improve performance?',
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => { if (hasCode) { onSendMessage(suggestion) } }}
                  disabled={!hasCode}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(139,92,246,0.06)',
                    border: '1px solid rgba(139,92,246,0.18)',
                    borderRadius: '8px',
                    color: hasCode ? '#a78bfa' : 'var(--text-muted)',
                    fontSize: '12px',
                    cursor: hasCode ? 'pointer' : 'not-allowed',
                    textAlign: 'left',
                    transition: 'var(--transition)',
                    opacity: hasCode ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (hasCode) e.currentTarget.style.background = 'rgba(139,92,246,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(139,92,246,0.06)'
                  }}
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))
        )}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(0,0,0,0.2)',
        flexShrink: 0,
      }}>
        {!hasCode && (
          <div style={{
            marginBottom: '8px', padding: '8px 12px',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '8px', fontSize: '12px', color: '#fbbf24',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            ⚠️ Upload or paste code first to start chatting
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            id="chat-input"
            ref={inputRef}
            className="input-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasCode ? 'Ask anything about your code… (Enter to send)' : 'Upload code to start chatting'}
            disabled={!hasCode || isLoading}
            rows={1}
            style={{
              resize: 'none',
              minHeight: '42px',
              maxHeight: '120px',
              overflowY: 'auto',
              lineHeight: '1.5',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            id="send-message-btn"
            className="btn-primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !hasCode}
            style={{
              padding: '10px 14px',
              flexShrink: 0,
              opacity: (!input.trim() || isLoading || !hasCode) ? 0.5 : 1,
            }}
          >
            <Send size={15} />
          </button>
        </div>
        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center' }}>
          Shift+Enter for new line · Enter to send
        </p>
      </div>
    </div>
  )
}
