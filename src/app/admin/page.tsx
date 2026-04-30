'use client'

import { useState, useEffect } from 'react'

interface AccessCode {
  id: string
  code: string
  email: string
  company: string
  created_at: string
  first_accessed_at: string | null
  last_accessed_at: string | null
  access_count: number
  analysis_count: number
  is_active: boolean
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<AccessCode[]>([])

  async function handleLogin() {
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (!res.ok) {
        setError('Invalid password.')
        return
      }

      setAuthenticated(true)
      loadData()

    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function loadData() {
    try {
      const res = await fetch('/api/admin/dados', {
        headers: { 'x-admin-password': password }
      })
      const json = await res.json()
      setData(json.data || [])
    } catch {
      setError('Failed to load data.')
    }
  }

  async function handleExport() {
    const res = await fetch('/api/admin/export', {
      headers: { 'x-admin-password': password }
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contract-analyser-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  function formatDate(date: string | null) {
    if (!date) return '—'
    return new Date(date).toLocaleString('en-GB')
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-10">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Panel</h1>
            <p className="text-gray-400 text-xs">Contract Analyser · Marco Costa</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Admin password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Verifying...' : 'Login →'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-400 text-xs mt-1">
              {data.length} access codes · Contract Analyser
            </p>
          </div>
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            Export CSV ↓
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Codes', value: data.length },
            { label: 'Accessed', value: data.filter(d => d.access_count > 0).length },
            { label: 'Analysed', value: data.filter(d => d.analysis_count > 0).length },
            { label: 'Pending', value: data.filter(d => d.access_count === 0).length },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Created</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">First Access</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Last Access</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Accesses</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Analyses</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No access codes yet.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-700">{row.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-700 capitalize">{row.company || '—'}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">{row.code}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(row.first_accessed_at)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(row.last_accessed_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.access_count > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {row.access_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.analysis_count > 0
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {row.analysis_count}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Contract Analyser · Admin Panel · Marco Costa
          </p>
        </div>

      </div>
    </main>
  )
}