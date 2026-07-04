import React from 'react'
import { Code2, Zap, ExternalLink } from 'lucide-react'

export default function Navbar({ sessionId }) {
  return (
    <nav
      className="navbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'rgba(8, 8, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        height: '56px',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(139,92,246,0.4)',
          }}
        >
          <Code2 size={18} color="white" />
        </div>
        <div>
          <span
            className="gradient-text"
            style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}
          >
            AI Code Assistant
          </span>
        </div>
      </div>

      {/* Center - Model Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '999px',
        }}
      >
        <Zap size={12} color="#a78bfa" />
        <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 500 }}>
          Gemini 1.5 Flash
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {sessionId && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Session: {sessionId.slice(0, 8)}…
          </span>
        )}
        <a
          href="https://aistudio.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
          style={{ fontSize: '12px', textDecoration: 'none' }}
        >
          <ExternalLink size={14} />
          AI Studio
        </a>
      </div>
    </nav>
  )
}
