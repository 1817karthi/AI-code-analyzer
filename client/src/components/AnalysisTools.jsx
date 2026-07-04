import React, { useState } from 'react'
import { Search, Bug, Zap, RefreshCw, FileText, ChevronDown } from 'lucide-react'

const TOOLS = [
  {
    id: 'explain',
    icon: Search,
    label: 'Explain',
    description: 'Understand what the code does',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.25)',
  },
  {
    id: 'debug',
    icon: Bug,
    label: 'Debug',
    description: 'Find bugs & security issues',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.10)',
    border: 'rgba(239,68,68,0.22)',
  },
  {
    id: 'optimize',
    icon: Zap,
    label: 'Optimize',
    description: 'Improve performance',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.22)',
  },
  {
    id: 'convert',
    icon: RefreshCw,
    label: 'Convert',
    description: 'Translate to another language',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.10)',
    border: 'rgba(16,185,129,0.22)',
  },
  {
    id: 'document',
    icon: FileText,
    label: 'Document',
    description: 'Generate docs & comments',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.25)',
  },
]

const CONVERT_LANGS = [
  'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'C++', 'C#', 'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby',
]

export default function AnalysisTools({ onAction, isLoading, hasCode }) {
  const [showConvertMenu, setShowConvertMenu] = useState(false)
  const [targetLang, setTargetLang] = useState('TypeScript')

  const handleToolClick = (toolId) => {
    if (!hasCode) return
    if (toolId === 'convert') {
      setShowConvertMenu(!showConvertMenu)
      return
    }
    onAction(toolId)
  }

  const handleConvert = (lang) => {
    setTargetLang(lang)
    setShowConvertMenu(false)
    onAction('convert', `Convert this code to ${lang}`, lang)
  }

  return (
    <div
      style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(0,0,0,0.2)',
      }}
    >
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Quick Actions
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', position: 'relative' }}>
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          const isConvert = tool.id === 'convert'
          return (
            <div key={tool.id} style={{ position: 'relative' }}>
              <button
                id={`tool-${tool.id}-btn`}
                onClick={() => handleToolClick(tool.id)}
                disabled={!hasCode || isLoading}
                title={tool.description}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  background: tool.bg,
                  border: `1px solid ${tool.border}`,
                  borderRadius: '8px',
                  color: tool.color,
                  cursor: hasCode && !isLoading ? 'pointer' : 'not-allowed',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'var(--transition)',
                  opacity: hasCode && !isLoading ? 1 : 0.4,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (hasCode && !isLoading) {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = `0 4px 12px ${tool.color}30`
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {isLoading && isConvert && showConvertMenu ? (
                  <div style={{ width: '12px', height: '12px', border: `2px solid ${tool.color}30`, borderTop: `2px solid ${tool.color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                ) : (
                  <Icon size={13} />
                )}
                {tool.label}
                {isConvert && <ChevronDown size={11} />}
              </button>

              {/* Convert dropdown */}
              {isConvert && showConvertMenu && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    marginBottom: '6px',
                    background: '#1a1a2e',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '6px',
                    zIndex: 50,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    minWidth: '140px',
                  }}
                >
                  {CONVERT_LANGS.map(lang => (
                    <button
                      key={lang}
                      id={`convert-to-${lang.toLowerCase()}-btn`}
                      onClick={() => handleConvert(lang)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '7px 10px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(139,92,246,0.15)'
                        e.currentTarget.style.color = '#a78bfa'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }}
                    >
                      → {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', border: '2px solid rgba(139,92,246,0.3)', borderTop: '2px solid #8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Analyzing…
          </div>
        )}
      </div>
    </div>
  )
}
