path = r"C:\Projetos\contract-analyser\src\app\page.tsx"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: title
content = content.replace(
    'Contract Analyser\n          </h1>',
    'Contract Analyser App\n          </h1>'
)

# Fix 2: subtitle - remove "Powered by Anthropic Claude"
content = content.replace(
    'AI-powered contract analysis \xc2\xb7 Powered by Anthropic Claude',
    'AI-powered contract analysis'
)
content = content.replace(
    'AI-powered contract analysis Â· Powered by Anthropic Claude',
    'AI-powered contract analysis'
)

# Fix 3: footer
content = content.replace(
    'Built by Marco Costa Â· Legal Engineer Portfolio',
    'Built by Marco Costa · For portfolio demonstration purposes'
)
content = content.replace(
    'Built by Marco Costa \xc2\xb7 Legal Engineer Portfolio',
    'Built by Marco Costa · For portfolio demonstration purposes'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("page.tsx actualizado - titulo, subtitulo e footer corrigidos. 'This tool does not provide legal advice' mantido.")
