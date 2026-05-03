import os

# ─────────────────────────────────────────────
# FICHEIRO 1: analisar/page.tsx — mensagem do limite
# ─────────────────────────────────────────────
page_path = r"C:\Projetos\contract-analyser\src\app\analisar\page.tsx"

with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

old = r"""          setError('Hey there! Since I\'m the one paying for Claude\'s tokens, I\'ve limited this to 1 analysis per visit. \uD83D\uDE04 If you\'d like to see more, you know where to find me. \u2014 Marco Costa')"""

new = r"""          setError('limit_reached')"""

content = content.replace(old, new)

# Corrigir também o estilo e o render da mensagem de limite
old2 = r"""            <div className={`mt-4 text-sm p-4 rounded-xl ${
                error.includes('Hey there')
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-red-500'
              }`}>
                {error}
              </div>"""

new2 = r"""            <div className={`mt-4 text-sm p-4 rounded-xl ${
                error === 'limit_reached'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-red-500'
              }`}>
                {error === 'limit_reached' ? (
                  <span>
                    Hi, I&apos;ve limited this to 1 analysis per visit. 😄 If you&apos;d like to see more, you know where to reach me!
                    <br /><br />
                    Best,<br />Marco Costa
                  </span>
                ) : error}
              </div>"""

content = content.replace(old2, new2)

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"OK: {page_path}")

# ─────────────────────────────────────────────
# FICHEIRO 2: analisar/route.ts — fix [!] duplicado
# ─────────────────────────────────────────────
route_path = r"C:\Projetos\contract-analyser\src\app\api\analisar\route.ts"

with open(route_path, 'r', encoding='utf-8') as f:
    content = f.read()

# O Claude devolve "⚠ [!] texto" — o cleanText converte ⚠ em [!]
# resultando em "[!] [!] texto". Corrigir para remover [!] duplicado depois de Alert:
old = r"""      if (text.startsWith('[!]')) {
        const alertLabel = '[!] Alert:'
        const rest = text.replace(/^\[!\]\s*\*?\*?Alert:\*?\*?\s*/i, '').replace(/\*\*/g, '').trim()"""

new = r"""      if (text.startsWith('[!]')) {
        const alertLabel = '[!] Alert:'
        // Remove qualquer prefixo [!] extra e asteriscos, ficando só com o texto limpo
        const rest = text.replace(/^\[!\]\s*/i, '').replace(/^\*?\*?Alert:\*?\*?\s*/i, '').replace(/^\[!\]\s*/i, '').replace(/\*\*/g, '').trim()"""

content = content.replace(old, new)

with open(route_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"OK: {route_path}")

print("\nFix concluido. Dois ficheiros actualizados.")
print("\nNOTA: Vai ao Vercel -> Settings -> Environment Variables")
print("e verifica se NEXT_PUBLIC_APP_URL esta definido como o URL real da app (nao localhost).")
