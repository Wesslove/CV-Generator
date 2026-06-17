import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = fs.readFileSync(path.join(root, 'src/components/CVPreview.jsx'), 'utf8')
const outDir = path.join(root, 'src/components/cvPreview')
fs.mkdirSync(outDir, { recursive: true })

const sharedStart = src.indexOf('// ── Render bullets')
const sharedEnd = src.indexOf('// TEMPLATE CLASSIC')
const sharedBody = src.slice(sharedStart, sharedEnd).trim()

const sharedFile = `import React from "react"

export function getSkillLabel(level, t) {
  const keys = ["", "notions", "beginner", "intermediate", "advanced", "expert"]
  return level > 0 && level <= 5 ? t(keys[level]) : ""
}

${sharedBody}
`
fs.writeFileSync(path.join(outDir, 'shared.jsx'), sharedFile)

const templates = [
  ['CLASSIC', 'classicTemplate.jsx', 'ClassicTemplate'],
  ['MODERN', 'modernTemplate.jsx', 'ModernTemplate'],
  ['MINIMAL', 'minimalTemplate.jsx', 'MinimalTemplate'],
  ['EXECUTIVE', 'executiveTemplate.jsx', 'ExecutiveTemplate'],
  ['CREATIVE', 'creativeTemplate.jsx', 'CreativeTemplate'],
  ['TIMELINE', 'timelineTemplate.jsx', 'TimelineTemplate'],
  ['IMPACT', 'impactTemplate.jsx', 'ImpactTemplate'],
  ['ACADÉMIQUE', 'academiqueTemplate.jsx', 'AcademiqueTemplate'],
  ['STARTUP', 'startupTemplate.jsx', 'StartupTemplate'],
]

for (let i = 0; i < templates.length; i++) {
  const [marker, fileName, fnName] = templates[i]
  const start = src.indexOf(`// TEMPLATE ${marker}`)
  const nextMarker = i + 1 < templates.length
    ? src.indexOf(`// TEMPLATE ${templates[i + 1][0]}`)
    : src.indexOf('// Composant principal')
  let block = src.slice(start, nextMarker)
  block = block.replace(/^\/\/ TEMPLATE .+\n\/\/ ─+\n/, '')
  block = block.replace(`function ${fnName}`, `export function ${fnName}`)
  block = block.replace(/SKILL_LABELS\[s\.level\]/g, 'getSkillLabel(s.level, t)')
  const needsSkillLabel = marker === 'MODERN'
  const importLine = needsSkillLabel
    ? `import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList, getSkillLabel } from "./shared.jsx"`
    : `import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList } from "./shared.jsx"`
  fs.writeFileSync(
    path.join(outDir, fileName),
    `${importLine}\n\n${block.trim()}\n`
  )
}

  const imports = templates.map(([, fileName, fnName]) =>
    `import { ${fnName} } from "./${fileName.replace('.jsx', '')}.jsx"`
  ).join('\n')

const mainFile = `import React from "react"
${imports}

function CVPreview({ cvData, t: tProp, className = "" }) {
  const t = tProp || ((k) => k)
  const templates = {
    classic:    <ClassicTemplate    cv={cvData} t={t} />,
    modern:     <ModernTemplate     cv={cvData} t={t} />,
    minimal:    <MinimalTemplate    cv={cvData} t={t} />,
    executive:  <ExecutiveTemplate  cv={cvData} t={t} />,
    creative:   <CreativeTemplate   cv={cvData} t={t} />,
    timeline:   <TimelineTemplate   cv={cvData} t={t} />,
    impact:     <ImpactTemplate     cv={cvData} t={t} />,
    academique: <AcademiqueTemplate cv={cvData} t={t} />,
    startup:    <StartupTemplate    cv={cvData} t={t} />,
  }
  return (
    <div
      id="cv-preview"
      className={\`cv-paper template-\${cvData.template} variant-\${cvData.settings?.templateVariant || "premium"} \${cvData.settings?.multiPage ? "multi-page" : ""} \${cvData.settings?.printDense ? "print-dense" : ""} \${className}\`.trim()}
    >
      {templates[cvData.template] || templates.classic}
    </div>
  )
}

export default React.memo(CVPreview)
`
fs.writeFileSync(path.join(outDir, 'CVPreview.jsx'), mainFile)
console.log('CVPreview split complete')
