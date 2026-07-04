import React, { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Code, ChevronDown } from 'lucide-react'

const LANGUAGE_OPTIONS = [
  'javascript', 'typescript', 'python', 'java', 'go', 'cpp', 'c',
  'csharp', 'ruby', 'php', 'rust', 'swift', 'kotlin', 'html', 'css',
  'sql', 'shell', 'json', 'yaml', 'markdown', 'plaintext',
]

export default function CodeEditor({ files, activeFile, onActiveFileChange, onPasteCode, pastedCode, onPastedCodeChange }) {
  const [pasteLanguage, setPasteLanguage] = useState('javascript')
  const [isPasteMode, setIsPasteMode] = useState(files.length === 0)

  // Show paste mode if no files
  const showPaste = isPasteMode || files.length === 0

  const activeFileObj = files.find(f => f.filename === activeFile)

  const handleSubmitPaste = () => {
    if (pastedCode.trim()) {
      const ext = LANGUAGE_OPTIONS.find(l => l === pasteLanguage) ? pasteLanguage : 'txt'
      const extMap = {
        javascript: 'js', typescript: 'ts', python: 'py', java: 'java',
        go: 'go', cpp: 'cpp', c: 'c', csharp: 'cs', ruby: 'rb',
        php: 'php', rust: 'rs', swift: 'swift', kotlin: 'kt',
        html: 'html', css: 'css', sql: 'sql', shell: 'sh',
        json: 'json', yaml: 'yml', markdown: 'md',
      }
      const filename = `pasted-code.${extMap[pasteLanguage] || 'txt'}`
      onPasteCode(pastedCode, filename, pasteLanguage)
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d0d1f' }}>
      {/* Tabs Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0,0,0,0.3)',
          gap: 0,
          overflowX: 'auto',
        }}
      >
        {/* File Tabs */}
        {files.map((file) => (
          <button
            key={file.filename}
            onClick={() => { setIsPasteMode(false); onActiveFileChange(file.filename) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              background: (!showPaste && activeFile === file.filename)
                ? 'rgba(139,92,246,0.12)'
                : 'transparent',
              borderBottom: (!showPaste && activeFile === file.filename)
                ? '2px solid #8b5cf6'
                : '2px solid transparent',
              border: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              color: (!showPaste && activeFile === file.filename) ? '#a78bfa' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              transition: 'var(--transition)',
            }}
          >
            <Code size={12} />
            {file.filename}
          </button>
        ))}

        {/* Paste Tab */}
        <button
          onClick={() => setIsPasteMode(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            background: showPaste ? 'rgba(139,92,246,0.12)' : 'transparent',
            borderBottom: showPaste ? '2px solid #8b5cf6' : '2px solid transparent',
            border: 'none',
            color: showPaste ? '#a78bfa' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            transition: 'var(--transition)',
          }}
        >
          + Paste Code
        </button>
      </div>

      {/* Editor Area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {showPaste ? (
          // Paste Mode
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Paste Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(0,0,0,0.2)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Language:</span>
              <div style={{ position: 'relative' }}>
                <select
                  id="paste-language-select"
                  value={pasteLanguage}
                  onChange={(e) => setPasteLanguage(e.target.value)}
                  style={{
                    appearance: 'none',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    padding: '5px 28px 5px 10px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {LANGUAGE_OPTIONS.map(l => (
                    <option key={l} value={l} style={{ background: '#0d0d1f' }}>{l}</option>
                  ))}
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              </div>
              <button
                id="submit-paste-btn"
                className="btn-primary"
                style={{ marginLeft: 'auto', padding: '6px 16px', fontSize: '12px' }}
                onClick={handleSubmitPaste}
                disabled={!pastedCode.trim()}
              >
                Load Code →
              </button>
            </div>

            {/* Monaco for paste */}
            <div style={{ flex: 1 }}>
              <Editor
                height="100%"
                language={pasteLanguage}
                value={pastedCode}
                onChange={(val) => onPastedCodeChange(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  minimap: { enabled: false },
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  formatOnPaste: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  placeholder: '// Paste your code here…',
                }}
              />
            </div>
          </div>
        ) : activeFileObj ? (
          // File View Mode
          <Editor
            height="100%"
            language={activeFileObj.language || 'plaintext'}
            value={activeFileObj.content || ''}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 13,
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              minimap: { enabled: true, scale: 1 },
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              smoothScrolling: true,
              wordWrap: 'on',
              folding: true,
              renderIndentGuides: true,
            }}
          />
        ) : (
          // Empty state
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <Code size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', fontWeight: 500 }}>No code loaded</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Upload files or paste code to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
