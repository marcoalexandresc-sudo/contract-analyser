import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const BLOCKED_DOMAINS = [
  'hotmail.com', 'yahoo.com', 'outlook.com',
  'live.com', 'sapo.pt', 'iol.pt', 'mail.com'
]

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const part1 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${part1}-${part2}`
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email.' }, { status: 400 })
    }

    const domain = email.split('@')[1].toLowerCase()

    if (BLOCKED_DOMAINS.includes(domain)) {
      return NextResponse.json(
        { error: 'Please use your professional email address.' },
        { status: 400 }
      )
    }

    const company = domain.split('.')[0]

    const { data: existing } = await supabaseAdmin
      .from('access_codes')
      .select('code')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    let code = existing?.code

    if (!code) {
      code = generateCode()
      await supabaseAdmin
        .from('access_codes')
        .insert({ code, email, company })
    }

    await resend.emails.send({
      from: 'Contract Analyser <contractanalyzer@lawper.pt>',
      to: email,
      subject: 'Your access code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 24px;">

          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; height: 32px; background: #1d4ed8; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: white; letter-spacing: 1px;">CA</span>
            </div>
            <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #111827;">Contract Analyser</span>
          </div>

          <p style="font-size: 14px; color: #111827; margin: 0 0 16px;">Hi,</p>

          <p style="font-size: 14px; color: #111827; margin: 0 0 16px;">Here is your access code:</p>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 24px; text-align: center; margin: 0 0 16px;">
            <span style="font-size: 18px; font-weight: 700; letter-spacing: 5px; color: #1d4ed8; font-family: 'Courier New', monospace;">
              ${code}
            </span>
          </div>

          <p style="font-size: 14px; color: #111827; margin: 0 0 16px;">
            Enter this code at
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/acesso" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">Contract Analyser App</a>
            to run your analysis.
          </p>

          <p style="font-size: 14px; color: #111827; margin: 0 0 24px;">I built this app purely for demonstration purposes.</p>

          <p style="font-size: 14px; color: #111827; margin: 0;">Best,<br/>Marco Costa</p>

        </div>
      `
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error requesting access:', error)
    return NextResponse.json({ error: 'Internal error. Please try again.' }, { status: 500 })
  }
}
