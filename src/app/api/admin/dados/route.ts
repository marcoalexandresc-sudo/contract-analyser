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

    return NextResponse.json({ data })

  } catch {
    return NextResponse.json(
      { error: 'Internal error.' },
      { status: 500 }
    )
  }
}