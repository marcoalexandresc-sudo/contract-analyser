import os

# ─── HELPER: bloco logo HTML para emails ────────────────────────────────────
EMAIL_LOGO_HEADER = """
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
        <div style="width: 32px; height: 32px; background: #1d4ed8; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span style="font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: white; letter-spacing: 1px;">CA</span>
        </div>
        <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #111827;">Contract Analyser</span>
      </div>
"""

# ─── HELPER: bloco logo JSX para páginas ────────────────────────────────────
APP_LOGO_JSX = """          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm tracking-wide">CA</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Contract Analyser</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">AI-powered</p>
          </div>"""

# ─────────────────────────────────────────────
# 1. FAVICON SVG em /public
# ─────────────────────────────────────────────
favicon_path = r"C:\Projetos\contract-analyser\public\favicon.svg"
favicon_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#1d4ed8"/>
  <text x="16" y="22" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="white" text-anchor="middle" letter-spacing="1">CA</text>
</svg>"""

os.makedirs(os.path.dirname(favicon_path), exist_ok=True)
with open(favicon_path, 'w', encoding='utf-8') as f:
    f.write(favicon_content)
print(f"OK: {favicon_path}")

# ─────────────────────────────────────────────
# 2. layout.tsx — favicon + metadata em inglês
# ─────────────────────────────────────────────
layout_path = r"C:\Projetos\contract-analyser\src\app\layout.tsx"
layout_content = """import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contract Analyser",
  description: "AI-powered contract analysis for legal engineers.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
"""
with open(layout_path, 'w', encoding='utf-8') as f:
    f.write(layout_content)
print(f"OK: {layout_path}")

# ─────────────────────────────────────────────
# 3. page.tsx — logo no cabeçalho (página inicial)
# ─────────────────────────────────────────────
page_path = r"C:\Projetos\contract-analyser\src\app\page.tsx"
with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

old = """        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contract Analyser App</h1>
          <p className="text-gray-400 text-xs">AI-powered</p>
        </div>"""

new = """        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm tracking-wide">CA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Contract Analyser</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">AI-powered</p>
        </div>"""

content = content.replace(old, new)
with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"OK: {page_path}")

# ─────────────────────────────────────────────
# 4. analisar/page.tsx — logo no cabeçalho
# ─────────────────────────────────────────────
analisar_page_path = r"C:\Projetos\contract-analyser\src\app\analisar\page.tsx"
with open(analisar_page_path, 'r', encoding='utf-8') as f:
    content = f.read()

old = """        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Contract Analyser App
          </h1>
          <p className="text-gray-400 text-xs">
            AI-powered
          </p>
        </div>"""

new = """        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm tracking-wide">CA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Contract Analyser</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">AI-powered</p>
        </div>"""

content = content.replace(old, new)
with open(analisar_page_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"OK: {analisar_page_path}")

# ─────────────────────────────────────────────
# 5. solicitar/route.ts — logo no email do código
# ─────────────────────────────────────────────
solicitar_path = r"C:\Projetos\contract-analyser\src\app\api\solicitar\route.ts"
with open(solicitar_path, 'r', encoding='utf-8') as f:
    content = f.read()

old = """        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 24px;">

          <p style="font-size: 14px; color: #111827; margin: 0 0 16px;">Hi,</p>"""

new = """        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 24px;">

          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; height: 32px; background: #1d4ed8; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: white; letter-spacing: 1px;">CA</span>
            </div>
            <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #111827;">Contract Analyser</span>
          </div>

          <p style="font-size: 14px; color: #111827; margin: 0 0 16px;">Hi,</p>"""

content = content.replace(old, new)
with open(solicitar_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"OK: {solicitar_path}")

# ─────────────────────────────────────────────
# 6. analisar/route.ts — logo no email da análise
# ─────────────────────────────────────────────
analisar_route_path = r"C:\Projetos\contract-analyser\src\app\api\analisar\route.ts"
with open(analisar_route_path, 'r', encoding='utf-8') as f:
    content = f.read()

old = """          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 24px;">

            <p style="font-size: 14px; color: #111827; margin: 0 0 16px;">Hi,</p>

            <p style="font-size: 14px; color: #111827; margin: 0 0 16px;">Please find your contract analysis report attached to this email as a PDF.</p>"""

new = """          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 24px;">

            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
              <div style="width: 32px; height: 32px; background: #1d4ed8; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: white; letter-spacing: 1px;">CA</span>
              </div>
              <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #111827;">Contract Analyser</span>
            </div>

            <p style="font-size: 14px; color: #111827; margin: 0 0 16px;">Hi,</p>

            <p style="font-size: 14px; color: #111827; margin: 0 0 16px;">Please find your contract analysis report attached to this email as a PDF.</p>"""

content = content.replace(old, new)
with open(analisar_route_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"OK: {analisar_route_path}")

print("\nFix concluido. 6 ficheiros actualizados.")
