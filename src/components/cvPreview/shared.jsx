/* eslint-disable react-refresh/only-export-components */
import React from "react"

export function getSkillLabel(level, t) {
  const keys = ["", "notions", "beginner", "intermediate", "advanced", "expert"]
  return level > 0 && level <= 5 ? t(keys[level]) : ""
}

// ── Render bullets or fallback to description ────────────────
export function BulletsList({ item, className }) {
  const bullets = item.bullets || (item.description ? [item.description] : null)
  if (!bullets || bullets.filter(b => b.trim()).length === 0) return null
  const filtered = bullets.filter(b => b.trim())
  if (filtered.length === 1) return <p className={className || "tl-desc"}>{filtered[0]}</p>
  return (
    <ul className="cv-bullets">
      {filtered.map((b, i) => <li key={i}>{b}</li>)}
    </ul>
  )
}

// ── Custom sections renderer ─────────────────────────────────
export function CustomSectionsList({ sections, titleClass }) {
  if (!sections || sections.length === 0) return null
  return sections.map(sec => {
    if (!sec.title && (!sec.items || sec.items.length === 0)) return null
    return (
      <section key={sec.id}>
        <h3 className={titleClass}>{sec.title}</h3>
        {(sec.items || []).map(item => (
          <div key={item.id} className="custom-section-entry">
            {(item.bullets || []).filter(b => b.trim()).map((b, i) => (
              <div key={i} className="custom-bullet-row">
                <span className="custom-bullet-dot">•</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        ))}
      </section>
    )
  })
}

export function SkillBar({ level }) {
  return (
    <div className="skill-bar-track">
      {[1,2,3,4,5].map((i) => (
        <span key={i} className="skill-dot"
          style={{ background: i <= level ? "var(--accent)" : "#e5e7eb" }} />
      ))}
    </div>
  )
}

// ── Shared sub-components ────────────────────────────────────
export function CertsList({ certs, titleClass, t }) {
  if (!certs || certs.length === 0) return null
  return (
    <section>
      <h3 className={titleClass}>{t("tplCerts")}</h3>
      {certs.map((c) => (
        <div key={c.id} className="cert-item">
          <div className="cert-top">
            <strong>{c.name}</strong>
            {c.date && <span className="cert-date">{c.date}</span>}
          </div>
          {c.issuer && <div className="cert-issuer">{c.issuer}</div>}
        </div>
      ))}
    </section>
  )
}

export function ProjectsList({ projects, titleClass, t }) {
  if (!projects || projects.length === 0) return null
  return (
    <section>
      <h3 className={titleClass}>{t("tplProjects")}</h3>
      {projects.map((p) => (
        <div key={p.id} className="proj-item">
          <div className="proj-top">
            <strong>{p.name}</strong>
            {p.stack && <span className="proj-stack">{p.stack}</span>}
          </div>
          <BulletsList item={p} className="proj-desc" />
          {p.url && <a className="proj-url" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
        </div>
      ))}
    </section>
  )
}

// ────────────────────────────────────────────────────────────
