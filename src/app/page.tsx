'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!email) {
      setError('Please enter your professional email address.')
      return
    }
    if (!consent) {
      setError('Please accept the Privacy Policy to continue.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/solicitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)

    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="text-5xl mb-4">\ud83d\udce8</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Check your inbox
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We&apos;ve sent your access code to <strong>{email}</strong>.
            Please check your inbox and follow the instructions.
          </p>
          <Link
            href="/acesso"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-center"
          >
            Enter Access Code &rarr;
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Contract Analyser App
          </h1>
          <p className="text-gray-400 text-xs">
            AI-powered contract analysis
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="you@yourcompany.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <label htmlFor="consent" className="text-xs text-gray-500 leading-relaxed">
              I have read and agree to the{' '}
              <Link href="/privacy-policy" className="text-blue-500 underline" target="_blank">
                Privacy Policy
              </Link>
              . I understand that submitted documents are processed by Anthropic Claude (USA)
              and stored securely on Supabase servers in the EU (Ireland).
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors mt-2"
          >
            {loading ? 'Sending...' : 'Request Access \u2192'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Built by Marco Costa &middot; For portfolio demonstration purposes
          </p>
          <p className="text-xs text-gray-300 mt-1">
            This tool does not provide legal advice
          </p>
        </div>

      </div>
    </main>
  )
}
