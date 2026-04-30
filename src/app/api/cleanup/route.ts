import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { error } = await supabaseAdmin
      .rpc('delete_expired_data')

    if (error) {
      console.error('Cleanup error:', error)
      return NextResponse.json(
        { error: 'Cleanup failed.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Expired data deleted successfully.',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Internal error.' },
      { status: 500 }
    )
  }
}