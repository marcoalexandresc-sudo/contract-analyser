import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'
import { jsPDF } from 'jspdf'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const resend = new Resend(process.env.RESEND_API_KEY)

function generateAnalysisPdf(analysisText: string, generatedDate: string): Buffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = 210
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://contract-analyser.vercel.app'

  let y = 20

  const addPage = () => {
    doc.addPage()
    y = 20
  }

  const checkPageBreak = (needed: number) => {
    if (y + needed > 270) addPage()
  }

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(17, 24, 39)
  doc.text('CONTRACT ANALYSER APP', pageWidth / 2, y, { align: 'center' })
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(107, 114, 128)
  doc.text(`Analysis Report \u00b7 Generated on ${generatedDate}`, pageWidth / 2, y, { align: 'center' })
  y += 8

  doc.setDrawColor(229, 231, 235)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  // Parse and render markdown
  const lines = analysisText.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Skip empty lines but add small space
    if (line.trim() === '') {
      y += 3
      continue
    }

    // Skip horizontal rules
    if (line.trim() === '---') {
      checkPageBreak(8)
      doc.setDrawColor(243, 244, 246)
      doc.line(margin, y, pageWidth - margin, y)
      y += 6
      continue
    }

    // H2 headings (## )
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '').trim()
      checkPageBreak(12)
      y += 4
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(29, 78, 216)
      doc.text(text.toUpperCase(), margin, y)
      y += 2
      doc.setDrawColor(219, 234, 254)
      doc.line(margin, y, pageWidth - margin, y)
      y += 5
      continue
    }

    // H1 headings (# ) — report title
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '').trim()
      checkPageBreak(10)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(17, 24, 39)
      const wrapped = doc.splitTextToSize(text, contentWidth)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 6 + 4
      continue
    }

    // Bold line (starts and ends with **)
    if (line.trim().startsWith('**') && !line.trim().startsWith('**-') && line.trim().endsWith('**') && line.trim().length > 4) {
      const text = line.trim().replace(/\*\*/g, '')
      checkPageBreak(7)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(17, 24, 39)
      doc.text(text, margin, y)
      y += 6
      continue
    }

    // Bullet points (- )
    if (line.trim().startsWith('- ')) {
      const text = line.trim().replace(/^- /, '')
      checkPageBreak(6)

      // Warning flag
      if (text.startsWith('\u26a0\ufe0f') || text.startsWith('\u26a0')) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(234, 88, 12)
        const cleanText = text.replace(/^\u26a0\ufe0f?\s*/, '\u26a0 ')
        const wrapped = doc.splitTextToSize(cleanText, contentWidth - 4)
        doc.text(wrapped, margin + 2, y)
        y += wrapped.length * 5
      } else {
        // Parse bold within bullet
        doc.setFontSize(9)
        doc.setTextColor(55, 65, 81)

        if (text.includes('**')) {
          const parts = text.split(/\*\*/)
          let x = margin + 4
          doc.text('\u2022', margin, y)

          const availableWidth = contentWidth - 4
          const fullText = text.replace(/\*\*/g, '')
          const wrapped = doc.splitTextToSize(fullText, availableWidth)

          if (wrapped.length > 1) {
            doc.setFont('helvetica', 'normal')
            doc.text(wrapped, margin + 4, y)
            y += wrapped.length * 5
          } else {
            for (let p = 0; p < parts.length; p++) {
              if (p % 2 === 0) {
                doc.setFont('helvetica', 'normal')
              } else {
                doc.setFont('helvetica', 'bold')
              }
              if (parts[p]) {
                doc.text(parts[p], x, y)
                x += doc.getTextWidth(parts[p])
              }
            }
            y += 5
          }
        } else {
          doc.setFont('helvetica', 'normal')
          doc.text('\u2022', margin, y)
          const wrapped = doc.splitTextToSize(text, contentWidth - 4)
          doc.text(wrapped, margin + 4, y)
          y += wrapped.length * 5
        }
      }
      continue
    }

    // Regular text (bold prefix like **Legal report:** text)
    if (line.trim().startsWith('**')) {
      const parts = line.trim().split(/\*\*/)
      checkPageBreak(7)
      doc.setFontSize(10)
      doc.setTextColor(17, 24, 39)

      const fullText = line.trim().replace(/\*\*/g, '')
      const wrapped = doc.splitTextToSize(fullText, contentWidth)

      if (wrapped.length > 1 || !line.includes('**')) {
        doc.setFont('helvetica', 'bold')
        doc.text(wrapped, margin, y)
        y += wrapped.length * 6
      } else {
        let x = margin
        for (let p = 0; p < parts.length; p++) {
          if (p % 2 === 0) {
            doc.setFont('helvetica', 'normal')
          } else {
            doc.setFont('helvetica', 'bold')
          }
          if (parts[p]) {
            doc.text(parts[p], x, y)
            x += doc.getTextWidth(parts[p])
          }
        }
        y += 6
      }
      continue
    }

    // Default text
    checkPageBreak(6)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(55, 65, 81)
    const wrapped = doc.splitTextToSize(line.trim(), contentWidth)
    doc.text(wrapped, margin, y)
    y += wrapped.length * 5
  }

  // Footer
  checkPageBreak(20)
  y += 6
  doc.setDrawColor(229, 231, 235)
  doc.line(margin, y, pageWidth - margin, y)
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(156, 163, 175)
  doc.text('Disclaimer:', margin, y)
  doc.setFont('helvetica', 'normal')
  const disclaimer = 'This analysis is generated by AI for informational purposes only. It does not constitute legal advice and should not be relied upon as a substitute for consultation with a qualified lawyer.'
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 20)
  doc.text(disclaimerLines, margin + 18, y)
  y += disclaimerLines.length * 4 + 4

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(156, 163, 175)
  doc.text('Built by Marco Costa \u00b7 For portfolio demonstration purposes \u00b7 ', margin, y)
  const linkX = margin + doc.getTextWidth('Built by Marco Costa \u00b7 For portfolio demonstration purposes \u00b7 ')
  doc.setTextColor(29, 78, 216)
  doc.textWithLink('Privacy Policy', linkX, y, { url: `${appUrl}/privacy-policy` })

  return Buffer.from(doc.output('arraybuffer'))
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const code = formData.get('code') as string
    const email = formData.get('email') as string
    const company = formData.get('company') as string

    if (!file || !code) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Please upload a PDF file.' }, { status: 400 })
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 20MB limit.' }, { status: 400 })
    }

    const { data, error: codeError } = await supabaseAdmin
      .from('access_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (codeError || !data) {
      return NextResponse.json({ error: 'Invalid access code.' }, { status: 403 })
    }

    if (data.analysis_count >= 1) {
      return NextResponse.json({ error: 'limit_reached' }, { status: 403 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Pdf = buffer.toString('base64')

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64Pdf,
              },
            },
            {
              type: 'text',
              text: `You are a senior attorney at a top-tier international law firm. Analyse the attached contract and produce a structured legal report.

STRICT FORMATTING RULES \u2014 follow exactly:
- Start the report with: **Legal report:** [contract title in plain text, not bold]
- NEVER use markdown tables. Tables are forbidden.
- Use bullet points (starting with -) for ALL lists and structured content.
- The only emoji allowed throughout the report is \u26a0\ufe0f for flags and warnings.
- In section 7 only, use a single small circle: \ud83d\udfe2 for low, \ud83d\udfe1 for medium, \ud83d\udd34 for high \u2014 followed by normal text (no caps lock).
- No other emojis anywhere.
- All section headings in sentence case (not caps lock).
- Consistent font size throughout \u2014 no oversized headings.
- Be concise, precise, and legally rigorous.

---

## Executive summary

- **Contract type:** [type]
- **Parties:** [Party A] / [Party B]
- **Purpose:** [one sentence]
- **Duration:** [dates]
- **Value:** [amount if applicable]
- **Overall risk:** [low / medium / high] \u2014 [one sentence justification]

---

## 1. Parties involved

- **[Party name]** \u2014 [legal status], [role], [NIF/registration if present]
- **[Party name]** \u2014 [legal status], [role], [NIF/registration if present]
- \u26a0\ufe0f [Flag any missing or unclear identification]

---

## 2. Main obligations

**[Party A]:**
- [obligation]
- [obligation]

**[Party B]:**
- [obligation]
- [obligation]

- \u26a0\ufe0f [Flag any critical gaps in obligations]

---

## 3. Termination clauses

- **Trigger:** [condition]
- **Notice period:** [duration]
- **Cure period:** [duration]
- **Effect:** [retroactive / non-retroactive]
- \u26a0\ufe0f **Missing provisions:** [list gaps \u2014 force majeure, insolvency, termination for convenience, etc.]
- \u26a0\ufe0f **Undefined terms:** [flag any vague trigger language]

---

## 4. Liability

- **Liability cap:** [present / absent \u2014 amount if present]
- **Consequential damages exclusion:** [present / absent]
- **Indemnification:** [present / absent]
- **Insurance requirements:** [present / absent]
- \u26a0\ufe0f **Critical gaps:** [list]

---

## 5. Risk register

**High \u2014 requires immediate attention before signing:**
- [Issue] \u2014 [one-line impact]

**Medium \u2014 should be negotiated:**
- [Issue] \u2014 [one-line impact]

**Low \u2014 minor points:**
- [Issue] \u2014 [one-line impact]

---

## 6. Key dates and deadlines

- **Execution date:** [date]
- **Start date:** [date]
- **End date:** [date]
- **Payment dates:** [specified / not specified]
- **Notice periods:** [duration]
- **Auto-renewal:** [present / absent]
- \u26a0\ufe0f **Missing deadlines:** [list]

---

## 7. Overall risk assessment

\ud83d\udfe2 Low / \ud83d\udfe1 Medium / \ud83d\udd34 High

- [Justification point 1]
- [Justification point 2]
- [Justification point 3]

---

## 8. Recommended improvements

- **[Issue]:** [specific recommended clause language or action]
- **[Issue]:** [specific recommended clause language or action]`
            }
          ]
        }
      ]
    })

    const analysisResult = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Analysis could not be completed.'

    const generatedDate = new Date().toLocaleString('en-GB')

    // Generate PDF
    const pdfBuffer = generateAnalysisPdf(analysisResult, generatedDate)
    const pdfBase64 = pdfBuffer.toString('base64')

    const fileName = `${code}-${Date.now()}.pdf`
    await supabaseAdmin.storage
      .from('contracts')
      .upload(fileName, buffer, { contentType: 'application/pdf', upsert: false })

    await supabaseAdmin
      .from('access_codes')
      .update({ analysis_count: data.analysis_count + 1, last_accessed_at: new Date().toISOString() })
      .eq('code', code.toUpperCase().trim())

    await supabaseAdmin
      .from('analyses')
      .insert({
        access_code: code.toUpperCase().trim(),
        email,
        company,
        contract_text: '',
        analysis_result: analysisResult,
      })

    // Send PDF to user
    if (email) {
      await resend.emails.send({
        from: 'Contract Analyser <contractanalyzer@lawper.pt>',
        to: email,
        subject: `Your contract analysis \u2014 Contract Analyser App`,
        attachments: [
          {
            filename: 'contract-analysis.pdf',
            content: pdfBase64,
          }
        ],
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="color: #1d4ed8; margin-bottom: 16px;">Your contract analysis is ready</h2>
            <p style="color: #374151; font-size: 14px; line-height: 1.6;">Please find your contract analysis report attached to this email as a PDF.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
              <strong>Disclaimer:</strong> This analysis is generated by AI for informational purposes only. It does not constitute legal advice.
            </p>
            <p style="color: #9ca3af; font-size: 11px; margin-top: 8px;">Built by Marco Costa &middot; For portfolio demonstration purposes</p>
          </div>
        `
      })
    }

    // Send notification to operator
    await resend.emails.send({
      from: 'Contract Analyser <contractanalyzer@lawper.pt>',
      to: process.env.OPERATOR_EMAIL!,
      subject: `New analysis - ${company || 'Unknown'} (${email})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1d4ed8;">New Contract Analysis</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr><td style="padding: 8px; background: #f3f4f6; font-weight: bold; width: 30%;">Email</td><td style="padding: 8px;">${email}</td></tr>
            <tr><td style="padding: 8px; background: #f3f4f6; font-weight: bold;">Company</td><td style="padding: 8px;">${company}</td></tr>
            <tr><td style="padding: 8px; background: #f3f4f6; font-weight: bold;">Date</td><td style="padding: 8px;">${generatedDate}</td></tr>
            <tr><td style="padding: 8px; background: #f3f4f6; font-weight: bold;">Code</td><td style="padding: 8px;">${code}</td></tr>
          </table>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">Contract Analyser &middot; Marco Costa</p>
        </div>
      `
    })

    return NextResponse.json({ success: true, analysis: analysisResult })

  } catch (error) {
    console.error('Error analysing contract:', error)
    return NextResponse.json({ error: 'Internal error. Please try again.' }, { status: 500 })
  }
}
