# Contract Analyser App

A full-stack web application that allows users to upload contract PDFs and receive a structured AI-powered legal analysis. Built as a portfolio demonstration of legal engineering and software development skills.

**Live demo:** [contract-analyser-iota.vercel.app](https://contract-analyser-iota.vercel.app)

---

## What it does

1. User submits a professional email address
2. App sends a one-time access code via email
3. User uploads a contract PDF and submits it for analysis
4. Claude (Anthropic) reads the PDF natively and generates a structured legal report
5. Report is generated as a PDF and sent to the user by email
6. A one-page technical overview of the app is included as a second attachment

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, Server Components, API Routes) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API (claude-opus-4-5) |
| Email | Resend |
| Database | Supabase (PostgreSQL) |
| File storage | Supabase Storage |
| PDF generation | jsPDF |
| Deployment | Vercel |

---

## Key features

- Access control via professional email + one-time access code
- Email domain validation — blocks personal email providers (Gmail, Hotmail, Yahoo, etc.)
- Native PDF reading by Claude — no intermediate text extraction
- Structured legal analysis across 8 sections
- Automatic PDF report generation and email delivery to user
- Usage limits enforced per access code (1 analysis per visit)
- Automated data retention — analyses deleted after 3 days, access codes after 30 days
- GDPR-compliant Privacy Policy with AI Act compliance section
- Admin panel with usage tracking

---

## Application flow

```
User (email) → Resend (sends access code) → Supabase DB (stores code)
     ↓
User (access code + PDF) → Next.js API → Supabase DB (validates code)
                                       → Anthropic API (Claude analyses PDF)
                                                ↓
                                          jsPDF (generates report)
                                                ↓
                                      Resend (emails PDF to user)
                                                ↓
                               Supabase Storage + DB (stores data)
                                                ↓
                               Vercel cron (deletes data after 3/30 days)
```

---

## Legal analysis structure

Each analysis covers:

1. Executive summary
2. Parties involved
3. Main obligations
4. Termination clauses
5. Liability
6. Risk register (High / Medium / Low)
7. Overall risk assessment
8. Recommended improvements

---

## Setup

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY
#          RESEND_API_KEY, OPERATOR_EMAIL, NEXT_PUBLIC_APP_URL, ADMIN_PASSWORD

# Run locally
npm run dev
```

---

## About

Built by **Marco Costa** — Legal Engineer  
For portfolio and recruitment purposes. Not a commercial product.
