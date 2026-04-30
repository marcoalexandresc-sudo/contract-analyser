import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Blocked personal email domains
const BLOCKED_DOMAINS = [
  'hotmail.com', 'yahoo.com', 'outlook.com',
  'live.com', 'sapo.pt', 'iol.pt', 'mail.com'
]

// Generates a random code in the format XXXX-XXXX
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const part1 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${part1}-${part2}`
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email.' },
        { status: 400 }
      )
    }

    // Extract domain
    const domain = email.split('@')[1].toLowerCase()

    // Block personal email domains
    if (BLOCKED_DOMAINS.includes(domain)) {
      return NextResponse.json(
        { error: 'Please use your professional email address.' },
        { status: 400 }
      )
    }

    // Detect company from domain
    const company = domain.split('.')[0]

    // Check if this email already has an active code
    const { data: existing } = await supabaseAdmin
      .from('access_codes')
      .select('code')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    let code = existing?.code

    // If no code exists, create a new one
    if (!code) {
      code = generateCode()
      await supabaseAdmin
        .from('access_codes')
        .insert({ code, email, company })
    }

    // Send email with access code
    await resend.emails.send({
      from: 'Contract Analyser <onboarding@resend.dev>',
      to: email,
      subject: 'Your access code — Contract Analyser App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          
          <h2 style="color: #1d4ed8; margin-bottom: 24px;">Contract Analyser</h2>
          
          <p>Hi,</p>
          <p>Here is your access code:</p>
          
          <div style="background: #f3f4f6; padding: 24px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #1d4ed8;">
              ${code}
            </span>
          </div>
          
          <p>
            Enter this code at 
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/acesso" style="color: #1d4ed8;">
              Contract Analyser
            </a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 16px;">
            Try as many analyses as you like — see what happens when you reach the limit.
          </p>
          
          <br/>
          <p>Best,<br/>Marco Costa</p>
          
        </div>
      `
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error requesting access:', error)
    return NextResponse.json(
      { error: 'Internal error. Please try again.' },
      { status: 500 }
    )
  }
}