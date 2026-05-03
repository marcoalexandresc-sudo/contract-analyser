import os

# ─────────────────────────────────────────────
# LOGO HTML compatível com todos os clientes de email
# usa <table> em vez de flexbox
# ─────────────────────────────────────────────
EMAIL_LOGO = """          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6; width: 100%;">
            <tr>
              <td style="width: 40px; vertical-align: middle;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 32px; height: 32px; background: #1d4ed8; border-radius: 6px;">
                  <tr>
                    <td style="text-align: center; vertical-align: middle; font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: white; letter-spacing: 1px;">CA</td>
                  </tr>
                </table>
              </td>
              <td style="vertical-align: middle; padding-left: 10px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #111827;">Contract Analyser</td>
            </tr>
          </table>"""

# ─────────────────────────────────────────────
# 1. solicitar/route.ts — logo + bloquear domínios
# ─────────────────────────────────────────────
solicitar_path = r"C:\Projetos\contract-analyser\src\app\api\solicitar\route.ts"
with open(solicitar_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Bloquear domínios pessoais
old_domains = """const BLOCKED_DOMAINS = [
  'hotmail.com', 'yahoo.com', 'outlook.com',
  'live.com', 'sapo.pt', 'iol.pt', 'mail.com'
]"""

new_domains = """const BLOCKED_DOMAINS = [
  'gmail.com', 'googlemail.com',
  'hotmail.com', 'hotmail.co.uk', 'hotmail.fr',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.es',
  'outlook.com', 'outlook.pt',
  'live.com', 'live.co.uk',
  'icloud.com', 'me.com', 'mac.com',
  'sapo.pt', 'iol.pt', 'mail.com',
  'protonmail.com', 'proton.me',
  'aol.com', 'msn.com'
]"""

content = content.replace(old_domains, new_domains)

# Corrigir logo — remover div flexbox, substituir por tabela
old_logo_solicitar = """          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
            <div style="width: 32px; height: 32px; background: #1d4ed8; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: white; letter-spacing: 1px;">CA</span>
            </div>
            <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #111827;">Contract Analyser</span>
          </div>"""

content = content.replace(old_logo_solicitar, EMAIL_LOGO)

with open(solicitar_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"OK: {solicitar_path}")

# ─────────────────────────────────────────────
# 2. analisar/route.ts — logo corrigido
# ─────────────────────────────────────────────
analisar_route_path = r"C:\Projetos\contract-analyser\src\app\api\analisar\route.ts"
with open(analisar_route_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_logo_analisar = """            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
              <div style="width: 32px; height: 32px; background: #1d4ed8; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; color: white; letter-spacing: 1px;">CA</span>
              </div>
              <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #111827;">Contract Analyser</span>
            </div>"""

content = content.replace(old_logo_analisar, EMAIL_LOGO)

with open(analisar_route_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"OK: {analisar_route_path}")

print("\nFix concluido. 2 ficheiros actualizados.")
print("Dominios bloqueados: gmail, hotmail, yahoo, outlook, live, icloud, sapo, iol, protonmail, aol, msn")
