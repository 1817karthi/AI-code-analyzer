import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileCode, X, CheckCircle, AlertCircle } from 'lucide-react'

const LANG_COLORS = {
  javascript: '#f7df1e', typescript: '#3178c6', python: '#3572A5',
  java: '#b07219', go: '#00add8', cpp: '#f34b7d', c: '#555555',
  csharp: '#178600', ruby: '#701516', php: '#4F5D95', rust: '#dea584',
  swift: '#F05138', kotlin: '#7F52FF', html: '#e34c26', css: '#563d7c',
  json: '#292929', sql: '#e38c00', shell: '#89e051', vue: '#41b883',
  default: '#8b5cf6',
}

function getLangColor(lang) {
  return LANG_COLORS[lang] || LANG_COLORS.default
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

export default function FileUpload({ uploadedFiles, onFilesSelected, onRemoveFile, isUploading }) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    setDragActive(false)
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles)
    }
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    multiple: true,
    maxSize: 5 * 1024 * 1024,
    accept: {
      'text/*': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.cpp', '.c',
        '.cs', '.rb', '.php', '.rs', '.swift', '.kt', '.scala', '.html', '.css',
        '.scss', '.json', '.yaml', '.yml', '.xml', '.sql', '.sh', '.bash',
        '.md', '.txt', '.r', '.m', '.lua', '.dart', '.vue'],
    },
  })

  const isActive = isDragActive || dragActive

  return (
    <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        id="file-dropzone"
        style={{
          border: `2px dashed ${isActive ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: '14px',
          padding: '32px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: isActive
            ? 'rgba(139,92,246,0.08)'
            : 'rgba(255,255,255,0.02)',
          transform: isActive ? 'scale(1.01)' : 'scale(1)',
          boxShadow: isActive ? '0 0 24px rgba(139,92,246,0.2)' : 'none',
        }}
      >
        <input {...getInputProps()} id="file-input" />
        <div
          style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 12px',
            borderRadius: '12px',
            background: isActive
              ? 'rgba(139,92,246,0.3)'
              : 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)',
          }}
        >
          {isUploading ? (
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(139,92,246,0.3)',
                borderTop: '2px solid #8b5cf6',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          ) : (
            <Upload size={22} color={isActive ? '#a78bfa' : 'var(--text-muted)'} />
          )}
        </div>
        <p style={{ fontSize: '14px', fontWeight: 500, color: isActive ? '#a78bfa' : 'var(--text-primary)', marginBottom: '4px' }}>
          {isUploading ? 'Uploading…' : isActive ? 'Drop files here!' : 'Drop code files here'}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          or click to browse · max 5MB per file
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
          JS · TS · Python · Java · Go · C++ · Rust · and 30+ more
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Loaded Files ({uploadedFiles.length})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {uploadedFiles.map((file, i) => (
              <div
                key={`${file.filename}-${i}`}
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  transition: 'var(--transition)',
                }}
              >
                {/* Lang dot */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getLangColor(file.language),
                    flexShrink: 0,
                    boxShadow: `0 0 6px ${getLangColor(file.language)}80`,
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {file.filename}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '10px' }}>{file.language}</span>
                    {file.size && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatSize(file.size)}</span>
                    )}
                  </div>
                </div>

                <CheckCircle size={14} color="var(--success)" style={{ flexShrink: 0 }} />

                <button
                  className="btn-icon"
                  style={{ width: '24px', height: '24px', flexShrink: 0 }}
                  onClick={() => onRemoveFile(file.filename)}
                  title="Remove file"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
