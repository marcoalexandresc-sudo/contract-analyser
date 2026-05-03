'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export default function Analisar() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const code = sessionStorage.getItem('access_code')
    if (!code) {
      router.push('/acesso')
    }
  }, [router])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') {
      setFile(dropped)
      setError('')
    } else {
      setError('Please upload a PDF file only.')
    }
  }

  async function handleAnalyse() {
    if (!file) {
      setError('Please select a PDF contract to analyse.')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis('')

    try {
      const code = sessionStorage.getItem('access_code')
      const email = sessionStorage.getItem('email')
      const company = sessionStorage.getItem('company')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('code', code || '')
      formData.append('email', email || '')
      formData.append('company', company || '')

      const res = await fetch('/api/analisar', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'limit_reached') {
          setError('Hey there! Since I\'m the one paying for Claude\'s tokens, I\'ve limited this to 1 analysis per visit. \uD83D\uDE04 If you\'d like to see more, you know where to find me. \u2014 Marco Costa')
          return
        }
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setAnalysis(data.analysis)

    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Contract Analyser
          </h1>
          <p className="text-gray-400 text-xs">
            AI-powered contract analysis &middot; Powered by Anthropic Claude
          </p>
        </div>

        {/* Upload area */}
        {!analysis && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-700 text-xs leading-relaxed">
                <strong>&#9888;&#65039; Notice:</strong> For demonstration purposes, we recommend submitting
                sample or non-confidential contracts. Documents are processed by Anthropic Claude (USA),
                stored securely in the EU (Ireland), and permanently deleted after 3 days.
              </p>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => document.getElementById('fileInput')?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-blue-400 bg-blue-50'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={e => {
                  const selected = e.target.files?.[0]
                  if (selected) {
                    setFile(selected)
                    setError('')
                  }
                }}
              />
              <p className="text-3xl mb-3">{file ? '\u2705' : '\uD83D\uDCC4'}</p>
              {file ? (
                <div>
                  <p className="text-green-700 font-medium text-sm">{file.name}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB &middot; Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 font-medium text-sm">Drag your contract here</p>
                  <p className="text-gray-400 text-xs mt-1">or click to select a PDF file (max 20MB)</p>
                </div>
              )}
            </div>

            {error && (
              <div className={`mt-4 text-sm p-4 rounded-xl ${
                error.includes('Hey there')
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-red-500'
              }`}>
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyse}
              disabled={loading || !file}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Analysing contract...
                </span>
              ) : 'Analyse Contract \u2192'}
            </button>

          </div>
        )}

        {/* Analysis result */}
        {analysis && (
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Analysis Report</h2>
                <p className="text-gray-400 text-xs mt-1">
                  Generated on {new Date().toLocaleString('en-GB')} &middot; Powered by Anthropic Claude
                </p>
              </div>
              <button
                onClick={() => { setAnalysis(''); setFile(null) }}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                New analysis
              </button>
            </div>

            {/* Markdown rendered result */}
            <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '13px', lineHeight: '1.8', color: '#1a1a2e' }}>
              <ReactMarkdown
                components={{
                  h1: ({children}) => <h1 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e', marginTop: '28px', marginBottom: '12px', letterSpacing: '0.01em', fontFamily: 'Arial, sans-serif' }}>{children}</h1>,
                  h2: ({children}) => <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '32px', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #e5e7eb', fontFamily: 'Arial, sans-serif' }}>{children}</h2>,
                  h3: ({children}) => <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginTop: '16px', marginBottom: '6px', fontFamily: 'Arial, sans-serif' }}>{children}</h3>,
                  p: ({children}) => <p style={{ fontSize: '13px', color: '#374151', marginBottom: '10px', lineHeight: '1.7' }}>{children}</p>,
                  ul: ({children}) => <ul style={{ marginBottom: '12px', paddingLeft: '0', listStyle: 'none' }}>{children}</ul>,
                  ol: ({children}) => <ol style={{ marginBottom: '12px', paddingLeft: '16px' }}>{children}</ol>,
                  li: ({children}) => <li style={{ fontSize: '13px', color: '#374151', marginBottom: '5px', paddingLeft: '12px', borderLeft: '2px solid #e5e7eb', lineHeight: '1.6' }}>{children}</li>,
                  strong: ({children}) => <strong style={{ fontWeight: '600', color: '#111827' }}>{children}</strong>,
                  table: ({children}) => <div style={{ overflowX: 'auto', marginBottom: '16px' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>{children}</table></div>,
                  thead: ({children}) => <thead style={{ backgroundColor: '#f8fafc' }}>{children}</thead>,
                  th: ({children}) => <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</th>,
                  td: ({children}) => <td style={{ padding: '8px 12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', verticalAlign: 'top' }}>{children}</td>,
                  hr: () => <hr style={{ margin: '24px 0', borderColor: '#f3f4f6' }} />,
                  blockquote: ({children}) => <blockquote style={{ borderLeft: '3px solid #1d4ed8', paddingLeft: '16px', color: '#6b7280', fontStyle: 'italic', margin: '12px 0' }}>{children}</blockquote>,
                  code: ({children}) => <code style={{ backgroundColor: '#f3f4f6', padding: '1px 4px', borderRadius: '3px', fontSize: '11px', fontFamily: 'monospace' }}>{children}</code>,
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <p className="text-gray-400 text-xs leading-relaxed">
                &#9888;&#65039; <strong>Disclaimer:</strong> This analysis is generated by AI and is intended
                for informational purposes only. It does not constitute legal advice and should
                not be relied upon as a substitute for consultation with a qualified lawyer.
              </p>
            </div>

          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Built by Marco Costa &middot; Legal Engineer Portfolio &middot;{' '}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
          </p>
          <p className="text-xs text-gray-300 mt-1">This tool does not provide legal advice</p>
        </div>

      </div>
    </main>
  )
}
