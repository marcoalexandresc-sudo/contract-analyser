path = r"C:\Projetos\contract-analyser\src\app\analisar\page.tsx"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: subtitle
old1 = "AI-powered contract analysis &middot; Powered by Anthropic Claude"
new1 = "AI-powered contract analysis &middot; Built by Marco Costa &middot; For portfolio demonstration purposes"

# Fix 2: header title
old2 = "Contract Analyser"
new2 = "Contract Analyser App"

# Fix 3: generated line - remove "Powered by Anthropic Claude"
old3 = "Generated on {new Date().toLocaleString('en-GB')} &middot; Powered by Anthropic Claude"
new3 = "Generated on {new Date().toLocaleString('en-GB')}"

# Fix 4: footer - remove "This tool does not provide legal advice" and add Privacy Policy link
old4 = """        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Built by Marco Costa &middot; Legal Engineer Portfolio &middot;{' '}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
          </p>
          <p className="text-xs text-gray-300 mt-1">This tool does not provide legal advice</p>
        </div>"""
new4 = """        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Built by Marco Costa &middot; Legal Engineer Portfolio &middot;{' '}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
          </p>
        </div>"""

# Fix 5: disclaimer - remove emoji, keep bold only
old5 = "                &#9888;&#65039; <strong>Disclaimer:</strong>"
new5 = "                <strong>Disclaimer:</strong>"

# Fix 6: bullets - change border-left style to disc bullets
old6 = "                  li: ({children}) => <li style={{ fontSize: '13px', color: '#374151', marginBottom: '5px', paddingLeft: '12px', borderLeft: '2px solid #e5e7eb', lineHeight: '1.6' }}>{children}</li>,"
new6 = "                  li: ({children}) => <li style={{ fontSize: '13px', color: '#374151', marginBottom: '5px', lineHeight: '1.6' }}>{children}</li>,"

old7 = "                  ul: ({children}) => <ul style={{ marginBottom: '12px', paddingLeft: '0', listStyle: 'none' }}>{children}</ul>,"
new7 = "                  ul: ({children}) => <ul style={{ marginBottom: '12px', paddingLeft: '18px', listStyle: 'disc' }}>{children}</ul>,"

replacements = [
    (old1, new1),
    (old2, new2),
    (old3, new3),
    (old4, new4),
    (old5, new5),
    (old6, new6),
    (old7, new7),
]

errors = []
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
    else:
        errors.append(f"ERRO: padrao nao encontrado: {old[:60]}...")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

if errors:
    for e in errors:
        print(e)
else:
    print("analisar/page.tsx actualizado com sucesso - todas as alteracoes aplicadas.")
