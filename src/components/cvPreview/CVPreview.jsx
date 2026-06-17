import React from "react"
import { ClassicTemplate } from "./classicTemplate.jsx"
import { ModernTemplate } from "./modernTemplate.jsx"
import { MinimalTemplate } from "./minimalTemplate.jsx"
import { ExecutiveTemplate } from "./executiveTemplate.jsx"
import { CreativeTemplate } from "./creativeTemplate.jsx"
import { TimelineTemplate } from "./timelineTemplate.jsx"
import { ImpactTemplate } from "./impactTemplate.jsx"
import { AcademiqueTemplate } from "./academiqueTemplate.jsx"
import { StartupTemplate } from "./startupTemplate.jsx"

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
      className={`cv-paper template-${cvData.template} variant-${cvData.settings?.templateVariant || "premium"} ${cvData.settings?.multiPage ? "multi-page" : ""} ${cvData.settings?.printDense ? "print-dense" : ""} ${className}`.trim()}
    >
      {templates[cvData.template] || templates.classic}
    </div>
  )
}

export default React.memo(CVPreview)
