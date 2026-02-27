// CVForm.jsx
import React, { useState } from "react"

const TEMPLATES = ["classic", "modern", "minimal", "executive", "creative", "timeline"]

function SectionHeader({ onAdd, addLabel }) {
  return (
    <div className="section-header">
      {onAdd && (
        <button className="btn-add" onClick={onAdd}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {addLabel}
        </button>
      )}
    </div>
  )
}

function RemoveBtn({ onClick, title }) {
  return (
    <button className="btn-remove" onClick={onClick} title={title}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  )
}

function ReorderBtns({ i, max, onUp, onDown, upTitle, downTitle }) {
  return (
    <>
      <button className="btn-reorder" disabled={i === 0}       onClick={onUp}   title={upTitle}>▲</button>
      <button className="btn-reorder" disabled={i === max - 1} onClick={onDown} title={downTitle}>▼</button>
    </>
  )
}

function CompletionBar({ score, checks, label }) {
  const color = score < 40 ? "#ef4444" : score < 70 ? "#f59e0b" : "#22c55e"
  const missing = checks.filter(c => !c.done)
  return (
    <div className="completion-widget">
      <div className="completion-header">
        <span className="completion-label">{label}</span>
        <span className="completion-pct" style={{ color }}>{score}%</span>
      </div>
      <div className="completion-track">
        <div className="completion-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      {missing.length > 0 && (
        <div className="completion-missing">
          {missing.slice(0, 3).map(c => <span key={c.key} className="completion-tip">+ {c.label}</span>)}
          {missing.length > 3 && <span className="completion-tip">+{missing.length - 3}</span>}
        </div>
      )}
    </div>
  )
}

export default function CVForm({
  cvData, errors = {}, completionScore, completionChecks,
  onChange, onBlur, onPhoto, onAdd, onUpdate, onRemove, onReorder, onTemplateChange, t
}) {
  const [openSection, setOpenSection] = useState("personal")
  const toggle = (s) => setOpenSection(openSection === s ? null : s)

  const handleSetting = (key, val) =>
    onChange({ target: { name: "settings", value: { ...cvData.settings, [key]: val } } })

  const FONT_OPTIONS = [
    { value: "classic", label: t("fontClassic"), hint: t("fontClassicHint") },
    { value: "modern",  label: t("fontModern"),  hint: t("fontModernHint")  },
    { value: "elegant", label: t("fontElegant"), hint: t("fontElegantHint") },
    { value: "tech",    label: t("fontTech"),    hint: t("fontTechHint")    },
  ]
  const DENSITY_OPTIONS = [
    { value: "compact", label: t("compact") },
    { value: "normal",  label: t("normal")  },
    { value: "airy",    label: t("airy")    },
  ]
  const LANG_LEVELS = [t("langNotions"), t("langSchool"), t("langFluent"), t("langBilingual"), t("langNative")]
  const SKILL_LEVELS = [t("notions"), t("beginner"), t("intermediate"), t("advanced"), t("expert")]

  return (
    <div className="cv-form">
      <h2 className="form-heading">{t("formTitle")}</h2>

      <CompletionBar score={completionScore} checks={completionChecks || []} label={t("completion")} />

      {/* ── Switcher templates mobile ── */}
      <div className="mobile-template-switcher">
        <span className="mobile-template-label">Template</span>
        <div className="mobile-template-btns">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl}
              className={`tpl-btn-light ${cvData.template === tpl ? "active" : ""}`}
              onClick={() => onTemplateChange && onTemplateChange(tpl)}
            >
              {tpl.charAt(0).toUpperCase() + tpl.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Apparence ── */}
      <div className="settings-block">
        <div className="settings-block-title">{t("appearance")}</div>
        <div className="field-group">
          <label className="field-label">{t("mainColor")}</label>
          <div className="color-picker-row">
            <input type="color" value={cvData.settings.accent}
              onChange={(e) => handleSetting("accent", e.target.value)} className="color-input" />
            <span className="color-hex">{cvData.settings.accent}</span>
            {["#2563eb","#dc2626","#16a34a","#7c3aed","#ea580c","#0f172a"].map(c => (
              <button key={c} className="color-swatch" style={{ background: c }}
                onClick={() => handleSetting("accent", c)} title={c} />
            ))}
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">{t("font")}</label>
          <div className="font-options">
            {FONT_OPTIONS.map(f => (
              <button key={f.value} className={`font-option ${cvData.settings.font === f.value ? "active" : ""}`}
                onClick={() => handleSetting("font", f.value)}>
                <span className="font-option-label">{f.label}</span>
                <span className="font-option-hint">{f.hint}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">{t("density")}</label>
          <div className="density-options">
            {DENSITY_OPTIONS.map(d => (
              <button key={d.value} className={`density-btn ${cvData.settings.density === d.value ? "active" : ""}`}
                onClick={() => handleSetting("density", d.value)}>{d.label}</button>
            ))}
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">{t("interfaceLang")}</label>
          <select value={cvData.settings.language}
            onChange={(e) => handleSetting("language", e.target.value)} className="field-input">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* ── Informations personnelles ── */}
      <Accordion open={openSection === "personal"} onToggle={() => toggle("personal")} title={t("personal")}>
        <div className="photo-upload-area">
          {cvData.photo ? (
            <div className="photo-preview-wrap">
              <img src={cvData.photo} alt="Photo" className="photo-thumb" />
              <button className="photo-remove" onClick={() => onChange({ target: { name: "photo", value: null } })}>×</button>
            </div>
          ) : (
            <label className="photo-upload-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span>{t("addPhoto")}</span>
              <input type="file" accept="image/*" onChange={onPhoto} hidden />
            </label>
          )}
        </div>
        <Field label={t("fullName")}  name="name"     value={cvData.name}     onChange={onChange} onBlur={onBlur} placeholder={t("phName")}     error={errors.name} />
        <Field label={t("jobTitle")}  name="title"    value={cvData.title}    onChange={onChange} onBlur={onBlur} placeholder={t("phTitle")}    error={errors.title} />
        <div className="field-row">
          <Field label={t("phone")}   name="phone"    value={cvData.phone}    onChange={onChange} placeholder={t("phPhone")} />
          <Field label={t("email")}   name="email"    value={cvData.email}    onChange={onChange} onBlur={onBlur} type="email" placeholder={t("phEmail")} error={errors.email} />
        </div>
        <div className="field-row">
          <Field label={t("location")} name="location" value={cvData.location} onChange={onChange} placeholder={t("phLocation")} />
          <Field label={t("linkedin")} name="linkedin" value={cvData.linkedin} onChange={onChange} placeholder={t("phLinkedin")} />
        </div>
        <Field label={t("summary")} name="summary" value={cvData.summary} onChange={onChange} textarea rows={4} placeholder={t("phSummary")} />
      </Accordion>

      {/* ── Expériences ── */}
      <Accordion open={openSection === "exp"} onToggle={() => toggle("exp")} title={`${t("experiences")} (${cvData.experiences.length})`}>
        <SectionHeader onAdd={() => onAdd("experiences", { company:"", role:"", period:"", description:"" })} addLabel={t("add")} />
        {cvData.experiences.length === 0 && <p className="empty-hint">{t("noExp")}</p>}
        {cvData.experiences.map((exp, i) => (
          <div key={exp.id} className="dynamic-card">
            <div className="card-header">
              <span className="card-num">#{i+1}</span>
              <div>
                <ReorderBtns i={i} max={cvData.experiences.length} upTitle={t("up")} downTitle={t("down")}
                  onUp={() => onReorder("experiences", i, i-1)} onDown={() => onReorder("experiences", i, i+1)} />
                <RemoveBtn onClick={() => onRemove("experiences", exp.id)} title={t("remove")} />
              </div>
            </div>
            <div className="field-row">
              <Field label={t("company")} value={exp.company} onChange={e => onUpdate("experiences", exp.id, "company", e.target.value)} placeholder={t("phCompany")} />
              <Field label={t("role")}    value={exp.role}    onChange={e => onUpdate("experiences", exp.id, "role",    e.target.value)} placeholder={t("phRole")} />
            </div>
            <Field label={t("period")}      value={exp.period}      onChange={e => onUpdate("experiences", exp.id, "period",      e.target.value)} placeholder={t("phPeriod")} />
            <Field label={t("description")} value={exp.description} onChange={e => onUpdate("experiences", exp.id, "description", e.target.value)} textarea rows={3} placeholder={t("phDesc")} />
          </div>
        ))}
      </Accordion>

      {/* ── Formation ── */}
      <Accordion open={openSection === "edu"} onToggle={() => toggle("edu")} title={`${t("educations")} (${cvData.educations.length})`}>
        <SectionHeader onAdd={() => onAdd("educations", { school:"", degree:"", period:"", description:"" })} addLabel={t("add")} />
        {cvData.educations.length === 0 && <p className="empty-hint">{t("noEdu")}</p>}
        {cvData.educations.map((edu, i) => (
          <div key={edu.id} className="dynamic-card">
            <div className="card-header">
              <span className="card-num">#{i+1}</span>
              <div>
                <ReorderBtns i={i} max={cvData.educations.length} upTitle={t("up")} downTitle={t("down")}
                  onUp={() => onReorder("educations", i, i-1)} onDown={() => onReorder("educations", i, i+1)} />
                <RemoveBtn onClick={() => onRemove("educations", edu.id)} title={t("remove")} />
              </div>
            </div>
            <div className="field-row">
              <Field label={t("school")} value={edu.school} onChange={e => onUpdate("educations", edu.id, "school", e.target.value)} placeholder={t("phSchool")} />
              <Field label={t("degree")} value={edu.degree} onChange={e => onUpdate("educations", edu.id, "degree", e.target.value)} placeholder={t("phDegree")} />
            </div>
            <Field label={t("period")}       value={edu.period}      onChange={e => onUpdate("educations", edu.id, "period",      e.target.value)} placeholder={t("phEduPeriod")} />
            <Field label={t("descOptional")} value={edu.description} onChange={e => onUpdate("educations", edu.id, "description", e.target.value)} textarea rows={2} placeholder={t("phEduDesc")} />
          </div>
        ))}
      </Accordion>

      {/* ── Certifications ── */}
      <Accordion open={openSection === "certs"} onToggle={() => toggle("certs")} title={`${t("certifications")} (${cvData.certifications.length})`}>
        <SectionHeader onAdd={() => onAdd("certifications", { name:"", issuer:"", date:"", url:"" })} addLabel={t("add")} />
        {cvData.certifications.length === 0 && <p className="empty-hint">{t("noCert")}</p>}
        {cvData.certifications.map((cert, i) => (
          <div key={cert.id} className="dynamic-card">
            <div className="card-header">
              <span className="card-num">#{i+1}</span>
              <div>
                <ReorderBtns i={i} max={cvData.certifications.length} upTitle={t("up")} downTitle={t("down")}
                  onUp={() => onReorder("certifications", i, i-1)} onDown={() => onReorder("certifications", i, i+1)} />
                <RemoveBtn onClick={() => onRemove("certifications", cert.id)} title={t("remove")} />
              </div>
            </div>
            <Field label={t("certName")} value={cert.name}   onChange={e => onUpdate("certifications", cert.id, "name",   e.target.value)} placeholder={t("phCertName")} />
            <div className="field-row">
              <Field label={t("issuer")} value={cert.issuer} onChange={e => onUpdate("certifications", cert.id, "issuer", e.target.value)} placeholder={t("phIssuer")} />
              <Field label={t("date")}   value={cert.date}   onChange={e => onUpdate("certifications", cert.id, "date",   e.target.value)} placeholder={t("phDate")} />
            </div>
            <Field label={t("link")} value={cert.url} onChange={e => onUpdate("certifications", cert.id, "url", e.target.value)} placeholder={t("phLink")} />
          </div>
        ))}
      </Accordion>

      {/* ── Projets ── */}
      <Accordion open={openSection === "projects"} onToggle={() => toggle("projects")} title={`${t("projects")} (${cvData.projects.length})`}>
        <SectionHeader onAdd={() => onAdd("projects", { name:"", description:"", stack:"", url:"" })} addLabel={t("add")} />
        {cvData.projects.length === 0 && <p className="empty-hint">{t("noProj")}</p>}
        {cvData.projects.map((proj, i) => (
          <div key={proj.id} className="dynamic-card">
            <div className="card-header">
              <span className="card-num">#{i+1}</span>
              <div>
                <ReorderBtns i={i} max={cvData.projects.length} upTitle={t("up")} downTitle={t("down")}
                  onUp={() => onReorder("projects", i, i-1)} onDown={() => onReorder("projects", i, i+1)} />
                <RemoveBtn onClick={() => onRemove("projects", proj.id)} title={t("remove")} />
              </div>
            </div>
            <div className="field-row">
              <Field label={t("projectName")} value={proj.name}  onChange={e => onUpdate("projects", proj.id, "name",  e.target.value)} placeholder={t("phProjectName")} />
              <Field label={t("stack")}        value={proj.stack} onChange={e => onUpdate("projects", proj.id, "stack", e.target.value)} placeholder={t("phStack")} />
            </div>
            <Field label={t("description")} value={proj.description} onChange={e => onUpdate("projects", proj.id, "description", e.target.value)} textarea rows={2} placeholder={t("phProjectDesc")} />
            <Field label={t("link")}         value={proj.url}         onChange={e => onUpdate("projects", proj.id, "url",         e.target.value)} placeholder={t("phUrl")} />
          </div>
        ))}
      </Accordion>

      {/* ── Compétences ── */}
      <Accordion open={openSection === "skills"} onToggle={() => toggle("skills")} title={`${t("skills")} (${cvData.skills.length})`}>
        <SectionHeader onAdd={() => onAdd("skills", { name:"", level:3 })} addLabel={t("addSkill")} />
        {cvData.skills.length === 0 && <p className="empty-hint">{t("noSkill")}</p>}
        <div className="skills-list">
          {cvData.skills.map((skill, i) => (
            <div key={skill.id} className="skill-row">
              <input className="skill-input" type="text" value={skill.name}
                onChange={e => onUpdate("skills", skill.id, "name", e.target.value)} placeholder={t("phSkill")} />
              <select className="skill-level" value={skill.level}
                onChange={e => onUpdate("skills", skill.id, "level", Number(e.target.value))}>
                {SKILL_LEVELS.map((l, idx) => <option key={idx} value={idx+1}>{l}</option>)}
              </select>
              <div>
                <ReorderBtns i={i} max={cvData.skills.length} upTitle={t("up")} downTitle={t("down")}
                  onUp={() => onReorder("skills", i, i-1)} onDown={() => onReorder("skills", i, i+1)} />
                <RemoveBtn onClick={() => onRemove("skills", skill.id)} title={t("remove")} />
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      {/* ── Langues ── */}
      <Accordion open={openSection === "lang"} onToggle={() => toggle("lang")} title={`${t("languages")} (${cvData.languages.length})`}>
        <SectionHeader onAdd={() => onAdd("languages", { name:"", level: LANG_LEVELS[2] })} addLabel={t("addLang")} />
        {cvData.languages.length === 0 && <p className="empty-hint">{t("noLang")}</p>}
        <div className="skills-list">
          {cvData.languages.map((lang, i) => (
            <div key={lang.id} className="skill-row">
              <input className="skill-input" type="text" value={lang.name}
                onChange={e => onUpdate("languages", lang.id, "name", e.target.value)} placeholder={t("phLang")} />
              <select className="skill-level" value={lang.level}
                onChange={e => onUpdate("languages", lang.id, "level", e.target.value)}>
                {LANG_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <div>
                <ReorderBtns i={i} max={cvData.languages.length} upTitle={t("up")} downTitle={t("down")}
                  onUp={() => onReorder("languages", i, i-1)} onDown={() => onReorder("languages", i, i+1)} />
                <RemoveBtn onClick={() => onRemove("languages", lang.id)} title={t("remove")} />
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      {/* ── Loisirs ── */}
      <Accordion open={openSection === "hobbies"} onToggle={() => toggle("hobbies")} title={`${t("hobbies")} (${cvData.hobbies.length})`}>
        <SectionHeader onAdd={() => onAdd("hobbies", { name:"" })} addLabel={t("add")} />
        {cvData.hobbies.length === 0 && <p className="empty-hint">{t("noHobby")}</p>}
        <div className="skills-list">
          {cvData.hobbies.map((h, i) => (
            <div key={h.id} className="skill-row">
              <input className="skill-input" type="text" value={h.name}
                onChange={e => onUpdate("hobbies", h.id, "name", e.target.value)}
                placeholder="Ex : Photographie..." />
              <div>
                <ReorderBtns i={i} max={cvData.hobbies.length} upTitle={t("up")} downTitle={t("down")}
                  onUp={() => onReorder("hobbies", i, i-1)} onDown={() => onReorder("hobbies", i, i+1)} />
                <RemoveBtn onClick={() => onRemove("hobbies", h.id)} title={t("remove")} />
              </div>
            </div>
          ))}
        </div>
      </Accordion>
    </div>
  )
}

// ── Accordion wrapper ────────────────────────────────────────
function Accordion({ open, onToggle, title, children }) {
  return (
    <div className={`accordion ${open ? "open" : ""}`}>
      <button className="accordion-trigger" onClick={onToggle}>
        <span>{title}</span>
        <span className="accordion-arrow">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  )
}

// ── Field ────────────────────────────────────────────────────
function Field({ label, name, value, onChange, onBlur, placeholder, type="text", textarea, rows, error }) {
  return (
    <div className="field-group">
      {label && <label className="field-label">{label}</label>}
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} onBlur={onBlur}
          placeholder={placeholder} rows={rows || 3}
          className={"field-input field-textarea" + (error ? " error" : "")} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} onBlur={onBlur}
          placeholder={placeholder}
          className={"field-input" + (error ? " error" : "")} />
      )}
      {error && <div className="field-error">{error}</div>}
    </div>
  )
}