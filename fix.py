import os

analisar_route_path = r"C:\Projetos\contract-analyser\src\app\api\analisar\route.ts"
with open(analisar_route_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace arrow helpers — labels below instead of above
old_arrow_h = '''  // Arrow helper (horizontal)
  const arrowH = (x1: number, x2: number, ay: number, label: string | null) => {
    doc.setDrawColor(156, 163, 175)
    doc.setLineWidth(0.3)
    doc.line(x1, ay, x2 - 1, ay)
    // arrowhead
    doc.setFillColor(156, 163, 175)
    doc.triangle(x2, ay, x2 - 2, ay - 1, x2 - 2, ay + 1, 'F')
    if (label) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(5.5)
      doc.setTextColor(156, 163, 175)
      doc.text(label, (x1 + x2) / 2, ay - 1.5, { align: 'center' })
    }
    doc.setLineWidth(0.2)
  }'''

new_arrow_h = '''  // Arrow helper (horizontal) — label below the arrow
  const arrowH = (x1: number, x2: number, ay: number, label: string | null) => {
    doc.setDrawColor(156, 163, 175)
    doc.setLineWidth(0.3)
    doc.line(x1, ay, x2 - 1, ay)
    doc.setFillColor(156, 163, 175)
    doc.triangle(x2, ay, x2 - 2, ay - 1, x2 - 2, ay + 1, 'F')
    if (label) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(5.5)
      doc.setTextColor(156, 163, 175)
      doc.text(label, (x1 + x2) / 2, ay + 2.5, { align: 'center' })
    }
    doc.setLineWidth(0.2)
  }'''

content = content.replace(old_arrow_h, new_arrow_h)

# Replace vertical arrow helper — label to the left, centred vertically
old_arrow_v = '''  // Arrow helper (vertical)
  const arrowV = (ax: number, y1: number, y2: number, label: string | null) => {
    doc.setDrawColor(156, 163, 175)
    doc.setLineWidth(0.3)
    doc.line(ax, y1, ax, y2 - 1)
    doc.setFillColor(156, 163, 175)
    doc.triangle(ax, y2, ax - 1, y2 - 2, ax + 1, y2 - 2, 'F')
    if (label) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(5.5)
      doc.setTextColor(156, 163, 175)
      doc.text(label, ax - 3, (y1 + y2) / 2, { align: 'right', baseline: 'middle' })
    }
    doc.setLineWidth(0.2)
  }'''

new_arrow_v = '''  // Arrow helper (vertical) — label to the right of the arrow
  const arrowV = (ax: number, y1: number, y2: number, label: string | null) => {
    doc.setDrawColor(156, 163, 175)
    doc.setLineWidth(0.3)
    doc.line(ax, y1, ax, y2 - 1)
    doc.setFillColor(156, 163, 175)
    doc.triangle(ax, y2, ax - 1, y2 - 2, ax + 1, y2 - 2, 'F')
    if (label) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(5.5)
      doc.setTextColor(156, 163, 175)
      doc.text(label, ax + 2, (y1 + y2) / 2, { align: 'left', baseline: 'middle' })
    }
    doc.setLineWidth(0.2)
  }'''

content = content.replace(old_arrow_v, new_arrow_v)

# Fix the manual left-pointing arrows in Delivery row — label below
old_del1 = '''  doc.setFont('helvetica', 'normal'); doc.setFontSize(5.5); doc.setTextColor(156, 163, 175)
  doc.text('PDF', (c3x + c2x + c2w) / 2, r3y + bh/2 - 1.5, { align: 'center' })'''

new_del1 = '''  doc.setFont('helvetica', 'normal'); doc.setFontSize(5.5); doc.setTextColor(156, 163, 175)
  doc.text('PDF', (c3x + c2x + c2w) / 2, r3y + bh/2 + 2.5, { align: 'center' })'''

content = content.replace(old_del1, new_del1)

with open(analisar_route_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"OK: {analisar_route_path}")
print("\nFix concluido.")
