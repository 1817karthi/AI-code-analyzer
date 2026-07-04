import React from 'react'
import { Plus, MessageSquare, Trash2, Clock, FileCode } from 'lucide-react'

export default function Sidebar({ sessions, activeSessionId, onNewSession, onSelectSession, onDeleteSession }) {
  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <button
          id="new-session-btn"
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onNewSession}
        >
          <Plus size={16} />
          New Session
        </button>
      </div>

      {/* Sessions List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {sessions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 16px',
              color: 'var(--text-muted)',
            }}
          >
            <MessageSquare size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: '13px' }}>No sessions yet</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Start a new session to analyze code</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '4px 8px 8px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Recent Sessions
            </p>
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                id={`session-${session.sessionId}`}
                className="glass-card-hover"
                onClick={() => onSelectSession(session.sessionId)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  marginBottom: '4px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: activeSessionId === session.sessionId
                    ? 'rgba(139,92,246,0.12)'
                    : 'transparent',
                  border: activeSessionId === session.sessionId
                    ? '1px solid rgba(139,92,246,0.3)'
                    : '1px solid transparent',
                  transition: 'var(--transition)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: activeSessionId === session.sessionId
                      ? 'rgba(139,92,246,0.3)'
                      : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileCode size={14} color={activeSessionId === session.sessionId ? '#a78bfa' : 'var(--text-muted)'} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: activeSessionId === session.sessionId ? '#a78bfa' : 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {session.title || 'New Session'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Clock size={10} color="var(--text-muted)" />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {formatTime(session.updatedAt || session.createdAt)}
                    </span>
                    {session.codeFiles?.length > 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                        · {session.codeFiles.length} file{session.codeFiles.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className="btn-icon"
                  style={{ flexShrink: 0, width: '24px', height: '24px' }}
                  onClick={(e) => { e.stopPropagation(); onDeleteSession(session.sessionId) }}
                  title="Delete session"
                >
                  <Trash2 size={12} color="var(--error)" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          Sessions are temporary and cleared on page refresh
        </p>
      </div>
    </aside>
  )
}
