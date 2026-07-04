import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Bot, User } from 'lucide-react'
import { useState } from 'react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '5px',
        color: copied ? '#34d399' : '#94a3b8',
        padding: '3px 8px',
        fontSize: '11px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.15s ease',
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

const ACTION_LABELS = {
  explain: { label: '🔍 Explain', color: '#818cf8' },
  debug: { label: '🐛 Debug', color: '#f87171' },
  optimize: { label: '⚡ Optimize', color: '#fbbf24' },
  convert: { label: '🔄 Convert', color: '#34d399' },
  document: { label: '📝 Document', color: '#a78bfa' },
  chat: { label: '💬 Chat', color: '#94a3b8' },
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isUser
            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            : 'linear-gradient(135deg, #0f172a, #1e293b)',
          border: isUser
            ? '1px solid rgba(139,92,246,0.5)'
            : '1px solid rgba(255,255,255,0.1)',
          boxShadow: isUser ? '0 0 12px rgba(139,92,246,0.3)' : 'none',
        }}
      >
        {isUser ? <User size={15} color="white" /> : <Bot size={15} color="#a78bfa" />}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '88%',
          background: isUser
            ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))'
            : 'rgba(255,255,255,0.04)',
          border: isUser
            ? '1px solid rgba(139,92,246,0.3)'
            : '1px solid rgba(255,255,255,0.07)',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          padding: '12px 16px',
          position: 'relative',
        }}
      >
        {isUser ? (
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {message.content}
          </p>
        ) : (
          <div className="prose-ai">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const code = String(children).replace(/\n$/, '')
                  if (!inline && match) {
                    return (
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(0,0,0,0.4)',
                          padding: '6px 12px',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {match[1]}
                          </span>
                          <CopyButton text={code} />
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            fontSize: '12.5px',
                            fontFamily: 'JetBrains Mono, Fira Code, monospace',
                            background: 'rgba(0,0,0,0.3)',
                            padding: '14px',
                          }}
                          {...props}
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    )
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', textAlign: isUser ? 'right' : 'left' }}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  )
}
