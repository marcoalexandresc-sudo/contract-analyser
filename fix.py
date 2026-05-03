path = r"C:\Projetos\contract-analyser\src\app\analisar\page.tsx"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

errors = []

# Fix 1: "Contract Analyser App App" -> "Contract Analyser App"
old1 = "Contract Analyser App App"
new1 = "Contract Analyser App"
if old1 in content:
    content = content.replace(old1, new1)
    print("Fix 1 aplicado: titulo corrigido")
else:
    errors.append("Fix 1 ERRO: 'Contract Analyser App App' nao encontrado")

# Fix 2: Add Home button next to New analysis button
old2 = """              <button
                onClick={() => { setAnalysis(''); setFile(null) }}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                New analysis
              </button>"""
new2 = """              <div className="flex gap-4 items-center">
                <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 underline">
                  &larr; Home
                </Link>
                <button
                  onClick={() => { setAnalysis(''); setFile(null) }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  New analysis
                </button>
              </div>"""
if old2 in content:
    content = content.replace(old2, new2)
    print("Fix 2 aplicado: botao Home adicionado")
else:
    errors.append("Fix 2 ERRO: botao New analysis nao encontrado")

if errors:
    for e in errors:
        print(e)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("page.tsx actualizado.")

# Fix 3: prompt - title formatting instruction
path2 = r"C:\Projetos\contract-analyser\src\app\api\analisar\route.ts"

with open(path2, 'r', encoding='utf-8') as f:
    content2 = f.read()

old3 = "STRICT FORMATTING RULES — follow exactly:"
new3 = """STRICT FORMATTING RULES — follow exactly:
- Start the report with: **Legal report:** [contract title in plain text, not bold]"""

if old3 in content2:
    content2 = content2.replace(old3, new3)
    with open(path2, 'w', encoding='utf-8') as f:
        f.write(content2)
    print("Fix 3 aplicado: titulo do relatorio corrigido no prompt")
else:
    print("Fix 3 ERRO: padrao nao encontrado em route.ts")
