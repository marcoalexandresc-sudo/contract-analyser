'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Acesso() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit() {
    if (!code) {
      setError('Please enter your access code.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'limit_reached') {
          setError('Hey there! Since I\'m the one paying for Claude\'s tokens, I\'ve limited this to 1 analysis per visit. 😄 If you\'d like to see more, you know where to find me. — Marco Costa')
          return
        }
        setError(data.error || 'Invalid access code. Please check and try again.')
        return
      }

      // Save session data
      sessionStorage.setItem('access_code', code.toUpperCase().trim())
      sessionStorage.setItem('email', data.email)
      sessionStorage.setItem('company', data.company)

      // Redirect to analysis page
      router.push('/analisar')

    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enter Access Code
          </h1>
          <p className="text-gray-400 text-sm">
            Enter the code we sent to your email address.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="XXXX-XXXX"
            maxLength={9}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Error or humor message */}
          {error && (
            <div className={`text-sm p-4 rounded-xl ${
              error.includes('Hey there')
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-red-500'
            }`}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            {loading ? 'Verifying...' : 'Access →'}
          </button>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            ← Request a new code
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Built by Marco Costa · Legal Engineer Portfolio
          </p>
          <p className="text-xs text-gray-300 mt-1">
            This tool does not provide legal advice
          </p>
        </div>

      </div>
    </main>
  )
}