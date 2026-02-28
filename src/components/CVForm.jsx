// CVForm.jsx – avec DnD, bullets, sections personnalisées, undo
import React, { useState } from "react"
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay
} from "@dnd-kit/core"
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const TEMPLATES = ["classic", "modern", "minimal", "executive", "creative", "timeline", "impact", "academique", "startup"]

// ── Drag handle icon ─────────────────────────────────────────
function DragHandle({ listeners, attributes }) {
  return (
    <button className="drag-handle" {...listeners} {...attributes} title="Glisser pour réorganiser" tabIndex={-1}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="5" r="1" fill="currentColor"/>
        <circle cx="9" cy="12" r="1" fill="currentColor"/>
        <circle cx="9" cy="19" r="1" fill="currentColor"/>
        <circle cx="15" cy="5" r="1" fill="currentColor"/>
        <circle cx="15" cy="12" r="1" fill="currentColor"/>
        <circle cx="15" cy="19" r="1" fill="currentColor"/>
      </svg>
    </button>
  )
}

// ── Sortable card wrapper ────────────────────────────────────
function SortableCard({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
  }
  return (
    <div ref={setNodeRef} style={style} className="dynamic-card">
      <div className="drag-handle-wrap">
        <DragHandle listeners={listeners} attributes={attributes} />
      </div>
      {children}
    </div>
  )
}

// ── Bullets editor ───────────────────────────────────────────
function BulletsEditor({ bullets = [""], onChange, onCommit, placeholder }) {
  const handleBullet = (i, val) => {
    const next = [...bullets]
    next[i] = val
    onChange(next)
  }
  const addBullet = () => onChange([...bullets, ""])
  const removeBullet = (i) => {
    if (bullets.length === 1) return onChange([""])
    onChange(bullets.filter((_, idx) => idx !== i))
  }
  const handleKey = (e, i) => {
    if (e.key === "Enter") { e.preventDefault(); addBullet() }
    if (e.key === "Backspace" && bullets[i] === "" && bullets.length > 1) {
      e.preventDefault(); removeBullet(i)
    }
  }
  return (
    <div className="bullets-editor">
      {bullets.map((b, i) => (
        <div key={i} className="bullet-row">
          <span className="bullet-dot">•</span>
          <input
            className="bullet-input"
            type="text"
            value={b}
            placeholder={placeholder}
            onChange={e => handleBullet(i, e.target.value)}
            onBlur={onCommit}
            onKeyDown={e => handleKey(e, i)}
          />
          {bullets.length > 1 && (
            <button className="bullet-remove" onClick={() => removeBullet(i)} tabIndex={-1}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      ))}
      <button className="bullet-add" onClick={addBullet}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Ajouter une ligne
      </button>
    </div>
  )
}

// ── RemoveBtn ────────────────────────────────────────────────
function RemoveBtn({ onClick, title }) {
  return (
    <button className="btn-remove" onClick={onClick} title={title}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  )
}

// ── Accordion ────────────────────────────────────────────────
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
          placeholder={placeholder} className={"field-input" + (error ? " error" : "")} />
      )}
      {error && <div className="field-error">{error}</div>}
    </div>
  )
}

// ── Completion bar ───────────────────────────────────────────
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

// ── Sortable section with DnD ────────────────────────────────
function DraggableSection({ section, items, onReorder, renderItem }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const [activeId, setActiveId] = useState(null)

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const oldIdx = items.findIndex(i => i.id === active.id)
    const newIdx = items.findIndex(i => i.id === over.id)
    if (oldIdx !== -1 && newIdx !== -1) onReorder(section, oldIdx, newIdx)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item, idx) => renderItem(item, idx))}
      </SortableContext>
    </DndContext>
  )
}

// ── Main CVForm component ────────────────────────────────────
export default function CVForm({
  cvData, errors = {}, completionScore, completionChecks,
  canUndo, onUndo,
  onChange, onBlur, onPhoto, onAdd, onUpdate, onRemove, onReorder,
  onTemplateChange, onAddCustomSection, onUpdateCustomSection,
  onRemoveCustomSection, onAddCustomItem, onRemoveCustomItem,
  onUpdateCustomItem, commitToHistory, t, lang = "fr"
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
  const LANG_LEVELS  = [t("langNotions"), t("langSchool"), t("langFluent"), t("langBilingual"), t("langNative")]
  const SKILL_LEVELS = [t("notions"), t("beginner"), t("intermediate"), t("advanced"), t("expert")]

  return (
    <div className="cv-form">
      <div className="form-title-row">
        <h2 className="form-heading">{t("formTitle")}</h2>
        {canUndo && (
          <button className="undo-btn" onClick={onUndo} title="Ctrl+Z">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6"/><path d="M3 13C5 7 11 3 18 5a9 9 0 010 14c-4 1.5-8 1-11-1"/>
            </svg>
            {t("undo")}
          </button>
        )}
      </div>

      <CompletionBar score={completionScore} checks={completionChecks || []} label={t("completion")} />

      {/* ── Mobile template switcher ── */}
      <div className="mobile-template-switcher">
        <span className="mobile-template-label">{t("template")}</span>
        <div className="mobile-template-btns">
          {TEMPLATES.map((tpl) => (
            <button key={tpl}
              className={`tpl-btn-light ${cvData.template === tpl ? "active" : ""}`}
              onClick={() => onTemplateChange && onTemplateChange(tpl)}>
              {{"academique": "Académique", "startup": "Startup"}[tpl] || tpl.charAt(0).toUpperCase() + tpl.slice(1)}
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
              onChange={e => handleSetting("accent", e.target.value)} className="color-input" />
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
            onChange={e => handleSetting("language", e.target.value)} className="field-input">
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
              <div className="photo-actions">
                <label className="photo-action-btn" title={lang === "en" ? "Crop" : "Recadrer"}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2"/>
                  </svg>
                  <input type="file" accept="image/*" onChange={onPhoto} hidden />
                </label>
                <button className="photo-action-btn photo-remove" onClick={() => onChange({ target: { name: "photo", value: null } })} title={lang === "en" ? "Remove" : "Supprimer"}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
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
        <Field label={t("fullName")} name="name" value={cvData.name} onChange={onChange} onBlur={onBlur} placeholder={t("phName")} error={errors.name} />
        <Field label={t("jobTitle")} name="title" value={cvData.title} onChange={onChange} onBlur={onBlur} placeholder={t("phTitle")} error={errors.title} />
        <div className="field-row">
          <Field label={t("phone")} name="phone" value={cvData.phone} onChange={onChange} placeholder={t("phPhone")} />
          <Field label={t("email")} name="email" value={cvData.email} onChange={onChange} onBlur={onBlur} type="email" placeholder={t("phEmail")} error={errors.email} />
        </div>
        <div className="field-row">
          <Field label={t("location")} name="location" value={cvData.location} onChange={onChange} placeholder={t("phLocation")} />
          <Field label={t("linkedin")} name="linkedin" value={cvData.linkedin} onChange={onChange} placeholder={t("phLinkedin")} />
        </div>
        <Field label={t("summary")} name="summary" value={cvData.summary} onChange={onChange} textarea rows={4} placeholder={t("phSummary")} />
      </Accordion>

      {/* ── Expériences (DnD) ── */}
      <Accordion open={openSection === "exp"} onToggle={() => toggle("exp")} title={`${t("experiences")} (${cvData.experiences.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("experiences", { company:"", role:"", period:"", bullets:[""] })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t("add")}
          </button>
        </div>
        {cvData.experiences.length === 0 && <p className="empty-hint">{t("noExp")}</p>}
        <DraggableSection section="experiences" items={cvData.experiences} onReorder={onReorder}
          renderItem={(exp, i) => (
            <SortableCard key={exp.id} id={exp.id}>
              <div className="card-header">
                <span className="card-num">#{i+1}</span>
                <RemoveBtn onClick={() => onRemove("experiences", exp.id)} title={t("remove")} />
              </div>
              <div className="field-row">
                <Field label={t("company")} value={exp.company} onChange={e => onUpdate("experiences", exp.id, "company", e.target.value)} onBlur={commitToHistory} placeholder={t("phCompany")} />
                <Field label={t("role")}    value={exp.role}    onChange={e => onUpdate("experiences", exp.id, "role",    e.target.value)} onBlur={commitToHistory} placeholder={t("phRole")} />
              </div>
              <Field label={t("period")} value={exp.period} onChange={e => onUpdate("experiences", exp.id, "period", e.target.value)} onBlur={commitToHistory} placeholder={t("phPeriod")} />
              <div className="field-group">
                <label className="field-label">{t("description")}</label>
                <BulletsEditor
                  bullets={exp.bullets || (exp.description ? [exp.description] : [""])}
                  onChange={val => onUpdate("experiences", exp.id, "bullets", val)}
                  onCommit={commitToHistory}
                  placeholder={t("phBullet")}
                />
              </div>
            </SortableCard>
          )}
        />
      </Accordion>

      {/* ── Formation (DnD) ── */}
      <Accordion open={openSection === "edu"} onToggle={() => toggle("edu")} title={`${t("educations")} (${cvData.educations.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("educations", { school:"", degree:"", period:"", bullets:[""] })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t("add")}
          </button>
        </div>
        {cvData.educations.length === 0 && <p className="empty-hint">{t("noEdu")}</p>}
        <DraggableSection section="educations" items={cvData.educations} onReorder={onReorder}
          renderItem={(edu, i) => (
            <SortableCard key={edu.id} id={edu.id}>
              <div className="card-header">
                <span className="card-num">#{i+1}</span>
                <RemoveBtn onClick={() => onRemove("educations", edu.id)} title={t("remove")} />
              </div>
              <div className="field-row">
                <Field label={t("school")} value={edu.school} onChange={e => onUpdate("educations", edu.id, "school", e.target.value)} onBlur={commitToHistory} placeholder={t("phSchool")} />
                <Field label={t("degree")} value={edu.degree} onChange={e => onUpdate("educations", edu.id, "degree", e.target.value)} onBlur={commitToHistory} placeholder={t("phDegree")} />
              </div>
              <Field label={t("period")} value={edu.period} onChange={e => onUpdate("educations", edu.id, "period", e.target.value)} onBlur={commitToHistory} placeholder={t("phEduPeriod")} />
              <div className="field-group">
                <label className="field-label">{t("descOptional")}</label>
                <BulletsEditor
                  bullets={edu.bullets || (edu.description ? [edu.description] : [""])}
                  onChange={val => onUpdate("educations", edu.id, "bullets", val)}
                  onCommit={commitToHistory}
                  placeholder={t("phEduDesc")}
                />
              </div>
            </SortableCard>
          )}
        />
      </Accordion>

      {/* ── Certifications (DnD) ── */}
      <Accordion open={openSection === "certs"} onToggle={() => toggle("certs")} title={`${t("certifications")} (${cvData.certifications.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("certifications", { name:"", issuer:"", date:"", url:"" })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t("add")}
          </button>
        </div>
        {cvData.certifications.length === 0 && <p className="empty-hint">{t("noCert")}</p>}
        <DraggableSection section="certifications" items={cvData.certifications} onReorder={onReorder}
          renderItem={(cert, i) => (
            <SortableCard key={cert.id} id={cert.id}>
              <div className="card-header">
                <span className="card-num">#{i+1}</span>
                <RemoveBtn onClick={() => onRemove("certifications", cert.id)} title={t("remove")} />
              </div>
              <Field label={t("certName")} value={cert.name}   onChange={e => onUpdate("certifications", cert.id, "name",   e.target.value)} onBlur={commitToHistory} placeholder={t("phCertName")} />
              <div className="field-row">
                <Field label={t("issuer")} value={cert.issuer} onChange={e => onUpdate("certifications", cert.id, "issuer", e.target.value)} onBlur={commitToHistory} placeholder={t("phIssuer")} />
                <Field label={t("date")}   value={cert.date}   onChange={e => onUpdate("certifications", cert.id, "date",   e.target.value)} onBlur={commitToHistory} placeholder={t("phDate")} />
              </div>
              <Field label={t("link")} value={cert.url} onChange={e => onUpdate("certifications", cert.id, "url", e.target.value)} onBlur={commitToHistory} placeholder={t("phLink")} />
            </SortableCard>
          )}
        />
      </Accordion>

      {/* ── Projets (DnD) ── */}
      <Accordion open={openSection === "projects"} onToggle={() => toggle("projects")} title={`${t("projects")} (${cvData.projects.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("projects", { name:"", stack:"", bullets:[""], url:"" })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t("add")}
          </button>
        </div>
        {cvData.projects.length === 0 && <p className="empty-hint">{t("noProj")}</p>}
        <DraggableSection section="projects" items={cvData.projects} onReorder={onReorder}
          renderItem={(proj, i) => (
            <SortableCard key={proj.id} id={proj.id}>
              <div className="card-header">
                <span className="card-num">#{i+1}</span>
                <RemoveBtn onClick={() => onRemove("projects", proj.id)} title={t("remove")} />
              </div>
              <div className="field-row">
                <Field label={t("projectName")} value={proj.name}  onChange={e => onUpdate("projects", proj.id, "name",  e.target.value)} onBlur={commitToHistory} placeholder={t("phProjectName")} />
                <Field label={t("stack")}        value={proj.stack} onChange={e => onUpdate("projects", proj.id, "stack", e.target.value)} onBlur={commitToHistory} placeholder={t("phStack")} />
              </div>
              <div className="field-group">
                <label className="field-label">{t("description")}</label>
                <BulletsEditor
                  bullets={proj.bullets || (proj.description ? [proj.description] : [""])}
                  onChange={val => onUpdate("projects", proj.id, "bullets", val)}
                  onCommit={commitToHistory}
                  placeholder={t("phProjectDesc")}
                />
              </div>
              <Field label={t("link")} value={proj.url} onChange={e => onUpdate("projects", proj.id, "url", e.target.value)} onBlur={commitToHistory} placeholder={t("phUrl")} />
            </SortableCard>
          )}
        />
      </Accordion>

      {/* ── Compétences (DnD) ── */}
      <Accordion open={openSection === "skills"} onToggle={() => toggle("skills")} title={`${t("skills")} (${cvData.skills.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("skills", { name:"", level:3 })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t("addSkill")}
          </button>
        </div>
        {cvData.skills.length === 0 && <p className="empty-hint">{t("noSkill")}</p>}
        <DraggableSection section="skills" items={cvData.skills} onReorder={onReorder}
          renderItem={(skill, i) => (
            <SortableCard key={skill.id} id={skill.id}>
              <div className="skill-row-dnd">
                <input className="skill-input" type="text" value={skill.name}
                  onChange={e => onUpdate("skills", skill.id, "name", e.target.value)}
                  onBlur={commitToHistory}
                  placeholder={t("phSkill")} />
                <select className="skill-level" value={skill.level}
                  onChange={e => onUpdate("skills", skill.id, "level", Number(e.target.value))}>
                  {SKILL_LEVELS.map((l, idx) => <option key={idx} value={idx+1}>{l}</option>)}
                </select>
                <RemoveBtn onClick={() => onRemove("skills", skill.id)} title={t("remove")} />
              </div>
            </SortableCard>
          )}
        />
      </Accordion>

      {/* ── Langues (DnD) ── */}
      <Accordion open={openSection === "lang"} onToggle={() => toggle("lang")} title={`${t("languages")} (${cvData.languages.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("languages", { name:"", level: LANG_LEVELS[2] })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t("addLang")}
          </button>
        </div>
        {cvData.languages.length === 0 && <p className="empty-hint">{t("noLang")}</p>}
        <DraggableSection section="languages" items={cvData.languages} onReorder={onReorder}
          renderItem={(lang, i) => (
            <SortableCard key={lang.id} id={lang.id}>
              <div className="skill-row-dnd">
                <input className="skill-input" type="text" value={lang.name}
                  onChange={e => onUpdate("languages", lang.id, "name", e.target.value)}
                  onBlur={commitToHistory}
                  placeholder={t("phLang")} />
                <select className="skill-level" value={lang.level}
                  onChange={e => onUpdate("languages", lang.id, "level", e.target.value)}>
                  {LANG_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <RemoveBtn onClick={() => onRemove("languages", lang.id)} title={t("remove")} />
              </div>
            </SortableCard>
          )}
        />
      </Accordion>

      {/* ── Loisirs (DnD) ── */}
      <Accordion open={openSection === "hobbies"} onToggle={() => toggle("hobbies")} title={`${t("hobbies")} (${cvData.hobbies.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("hobbies", { name:"" })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t("add")}
          </button>
        </div>
        {cvData.hobbies.length === 0 && <p className="empty-hint">{t("noHobby")}</p>}
        <DraggableSection section="hobbies" items={cvData.hobbies} onReorder={onReorder}
          renderItem={(h, i) => (
            <SortableCard key={h.id} id={h.id}>
              <div className="skill-row-dnd">
                <input className="skill-input" type="text" value={h.name}
                  onChange={e => onUpdate("hobbies", h.id, "name", e.target.value)}
                  onBlur={commitToHistory}
                  placeholder="Ex : Photographie..." />
                <RemoveBtn onClick={() => onRemove("hobbies", h.id)} title={t("remove")} />
              </div>
            </SortableCard>
          )}
        />
      </Accordion>

      {/* ── Sections personnalisées ── */}
      <Accordion open={openSection === "custom"} onToggle={() => toggle("custom")}
        title={`${t("customSections")} (${(cvData.customSections || []).length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={onAddCustomSection}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t("addCustomSection")}
          </button>
        </div>
        {(cvData.customSections || []).length === 0 && (
          <p className="empty-hint">Publications, Bénévolat, Distinctions...</p>
        )}
        {(cvData.customSections || []).map((sec) => (
          <div key={sec.id} className="dynamic-card custom-section-card">
            <div className="card-header">
              <input
                className="field-input custom-section-title-input"
                type="text"
                value={sec.title}
                onChange={e => onUpdateCustomSection(sec.id, "title", e.target.value)}
                onBlur={commitToHistory}
                placeholder={t("phCustomTitle")}
              />
              <RemoveBtn onClick={() => onRemoveCustomSection(sec.id)} title={t("remove")} />
            </div>
            <div className="custom-items">
              {(sec.items || []).map((item) => (
                <div key={item.id} className="custom-item">
                  <BulletsEditor
                    bullets={item.bullets || [""]}
                    onChange={val => onUpdateCustomItem(sec.id, item.id, "bullets", val)}
                    onCommit={commitToHistory}
                    placeholder={t("phBullet")}
                  />
                  <button className="custom-item-remove" onClick={() => onRemoveCustomItem(sec.id, item.id)} title={t("remove")}>
                    {t("remove")}
                  </button>
                </div>
              ))}
              <button className="btn-add btn-add-sm" onClick={() => onAddCustomItem(sec.id)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {t("addCustomItem")}
              </button>
            </div>
          </div>
        ))}
      </Accordion>
    </div>
  )
}