import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Verify admin password
    const password = request.headers.get('x-admin-password')
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorised.' },
        { status: 401 }
      )
    }

    // Fetch all access codes
    const { data, error } = await supabaseAdmin
      .from('access_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch data.' },
        { status: 500 }
      )
    }

    // Generate CSV
    const headers = [
      'Email',
      'Company',
      'Code',
      'Created At',
      'First Accessed At',
      'Last Accessed At',
      'Access Count',
      'Analysis Count',
      'Active'
    ]

    const rows = (data || []).map(row => [
      row.email || '',
      row.company || '',
      row.code || '',
      row.created_at || '',
      row.first_accessed_at || '',
      row.last_accessed_at || '',
      row.access_count || 0,
      row.analysis_count || 0,
      row.is_active ? 'Yes' : 'No'
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contract-analyser-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch {
    return NextResponse.json(
      { error: 'Internal error.' },
      { status: 500 }
    )
  }
}