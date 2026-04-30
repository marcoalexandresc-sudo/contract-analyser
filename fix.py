path = r"C:\Projetos\contract-analyser\src\app\api\validate\route.ts"

content = """import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const code = body.code

    if (!code) return NextResponse.json({ error: 'Please enter a code.' }, { status: 400 })

    const r = await supabaseAdmin
      .from('access_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    const data = r.data
    const error = r.error

    if (error || !data) return NextResponse.json({ error: 'Invalid code.' }, { status: 404 })
    if (data.analysis_count >= 1) return NextResponse.json({ error: 'limit_reached' }, { status: 403 })

    await supabaseAdmin
      .from('access_codes')
      .update({ access_count: data.access_count + 1, last_accessed_at: new Date().toISOString() })
      .eq('code', code.toUpperCase().trim())

    return NextResponse.json({ success: true, email: data.email, company: data.company })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 })
  }
}
"""

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("validate/route.ts limpo - logs de debug removidos.")
