/**
 * CVForm
 * Rôle : rend et edite toutes les sections du formulaire CV.
 * Entrées : cvData, erreurs, traducteur i18n et callbacks d'actions depuis App.
 * Sorties : UI de formulaire controlee et interactions de section (add/update/remove/reorder).
 * Responsabilités :
 * - mapper les champs du formulaire vers les callbacks
 * - orchestrer les accordions de section et cartes DnD
 * - declencher des checkpoints commitToHistory au blur
 */
import React, { useState } from "react"

import BulletsEditor from "./cvForm/BulletsEditor"
import { TEMPLATES, STYLE_PRESETS, getDensityOptions, getFontOptions, getLangLevels, getSkillLevels } from "../constants"
import DraggableSection from "./cvForm/dnd/DraggableSection"
import SortableCard from "./cvForm/dnd/SortableCard"
import Accordion from "./cvForm/ui/Accordion"
import CompletionBar from "./cvForm/ui/CompletionBar"
import Field from "./cvForm/ui/Field"
import RemoveBtn from "./cvForm/ui/RemoveBtn"

export default function CVForm({
  cvData, errors = {}, completionScore, completionChecks,
  canUndo, onUndo,
  onChange, onBlur, onPhoto, onAdd, onUpdate, onRemove, onDuplicate, onReorder,
  onTemplateChange, onAddCustomSection, onUpdateCustomSection,
  onRemoveCustomSection, onAddCustomItem, onRemoveCustomItem,
  onUpdateCustomItem, commitToHistory, t, lang = "fr"
}) {
  const [openSection, setOpenSection] = useState("personal")

  const toggleSection = (sectionKey) =>
    setOpenSection(openSection === sectionKey ? null : sectionKey)

  const updateSettings = (key, val) =>
    onChange({ target: { name: "settings", value: { ...cvData.settings, [key]: val } } })

  const FONT_OPTIONS = getFontOptions(t)
  const DENSITY_OPTIONS = getDensityOptions(t)
  const LANG_LEVELS = getLangLevels(t)
  const SKILL_LEVELS = getSkillLevels(t)

  // Labels lisibles pour les templates
  const TPL_LABELS = {
    classic:    "Classic",
    modern:     "Modern",
    minimal:    "Minimal",
    executive:  "Executive",
    creative:   "Creative",
    timeline:   "Timeline",
    impact:     "Impact",
    academique: "Académique",
    startup:    "Startup",
  }

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

      {/*
        FIX 2 — Bloc template visible UNIQUEMENT sur mobile.
        Sur desktop/tablette le switcher est dans la topbar → pas de duplication.
        La classe `mobile-template-switcher` a déjà display:none au-dessus de 767px
        via le CSS existant (le bloc n'était affiché qu'en @media max-width:767px).
        On le laisse tel quel : le CSS fait le travail.
      */}
      <div className="mobile-template-switcher">
        <span className="mobile-template-label">{t("template")}</span>
        <div className="mobile-template-btns">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id ?? tpl}
              className={`tpl-btn-light ${cvData.template === (tpl.id ?? tpl) ? "active" : ""}`}
              onClick={() => onTemplateChange && onTemplateChange(tpl.id ?? tpl)}
            >
              {/* FIX 2b — pas de tpl-thumb ici pour éviter les cases grises */}
              {TPL_LABELS[tpl.id ?? tpl] ?? (tpl.label ?? String(tpl))}
            </button>
          ))}
        </div>
      </div>

      {/* ── Apparence ── */}
      <div className="settings-block">
        <div className="settings-block-title">{t("appearance")}</div>
        <div className="field-group">
          <label className="field-label">{t("stylePresets")}</label>
          <div className="preset-options">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className="density-btn preset-btn"
                onClick={() =>
                  onChange({
                    target: {
                      name: "settings",
                      value: {
                        ...cvData.settings,
                        accent: preset.accent,
                        font: preset.font,
                        density: preset.density,
                      },
                    },
                  })
                }
              >
                {t(preset.labelKey)}
              </button>
            ))}
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">{t("templateVariant")}</label>
          <div className="density-options">
            <button
              className={`density-btn ${((cvData.settings.templateVariant || "premium") === "minimal") ? "active" : ""}`}
              onClick={() => updateSettings("templateVariant", "minimal")}
            >
              {t("variantMinimal")}
            </button>
            <button
              className={`density-btn ${((cvData.settings.templateVariant || "premium") === "premium") ? "active" : ""}`}
              onClick={() => updateSettings("templateVariant", "premium")}
            >
              {t("variantPremium")}
            </button>
            <button
              className={`density-btn ${((cvData.settings.templateVariant || "premium") === "colorful") ? "active" : ""}`}
              onClick={() => updateSettings("templateVariant", "colorful")}
            >
              {t("variantColorful")}
            </button>
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">{t("mainColor")}</label>
          <div className="color-picker-row">
            <input type="color" value={cvData.settings.accent}
              onChange={e => updateSettings("accent", e.target.value)} className="color-input" />
            <span className="color-hex">{cvData.settings.accent}</span>
              {["#1e3a5f","#0f4c81","#1a5276","#1b4332","#4a1942","#2c3e50"].map(c => (
              <button key={c} className="color-swatch" style={{ background: c }}
                onClick={() => updateSettings("accent", c)} title={c} />
            ))}
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">{t("font")}</label>
          <div className="font-options">
            {FONT_OPTIONS.map(f => (
              <button key={f.value} className={`font-option ${cvData.settings.font === f.value ? "active" : ""}`}
                onClick={() => updateSettings("font", f.value)}>
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
                onClick={() => updateSettings("density", d.value)}>{d.label}</button>
            ))}
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">{t("interfaceLang")}</label>
          <select value={cvData.settings.language}
            onChange={e => updateSettings("language", e.target.value)} className="field-input">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">
            <input
              type="checkbox"
              checked={Boolean(cvData.settings.multiPage)}
              onChange={(e) => updateSettings("multiPage", e.target.checked)}
              style={{ marginRight: 8 }}
            />
            {t("multiPageMode")}
          </label>
        </div>
        <div className="field-group">
          <label className="field-label">
            <input
              type="checkbox"
              checked={Boolean(cvData.settings.printDense)}
              onChange={(e) => updateSettings("printDense", e.target.checked)}
              style={{ marginRight: 8 }}
            />
            {t("printDenseMode")}
          </label>
        </div>
      </div>

      {/* ── Informations personnelles ── */}
      <Accordion open={openSection === "personal"} onToggle={() => toggleSection("personal")} title={t("personal")}>
        <div className="photo-upload-area">
          {cvData.photo ? (
            <div className="photo-preview-wrap">
              <img src={cvData.photo} alt="Photo" className="photo-thumb" />
              <div className="photo-actions">
                <label className="photo-action-btn" title={lang === "en" ? "Crop" : "Recadrer"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2"/>
                  </svg>
                  <input type="file" accept="image/*" onChange={onPhoto} hidden />
                </label>
                <button className="photo-action-btn photo-remove"
                  onClick={() => onChange({ target: { name: "photo", value: null } })}
                  title={lang === "en" ? "Remove" : "Supprimer"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <label className="photo-upload-label">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="17" cy="8" r="5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
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

        <div className="field-row">
          <Field
            label={t("birthDate")}
            name="birthDate"
            value={cvData.birthDate || ""}
            onChange={onChange}
            onBlur={commitToHistory}
            placeholder={t("phBirthDate")}
          />
          <Field
            label={t("birthPlace")}
            name="birthPlace"
            value={cvData.birthPlace || ""}
            onChange={onChange}
            onBlur={commitToHistory}
            placeholder={t("phBirthPlace")}
          />
        </div>

        <Field
          label={t("maritalStatus")}
          name="maritalStatus"
          value={cvData.maritalStatus || ""}
          onChange={onChange}
          onBlur={commitToHistory}
          placeholder={t("phMaritalStatus")}
        />

        <Field label={t("summary")} name="summary" value={cvData.summary} onChange={onChange} textarea rows={4} placeholder={t("phSummary")} />
      </Accordion>

      {/* ── Expériences ── */}
      <Accordion open={openSection === "exp"} onToggle={() => toggleSection("exp")} title={`${t("experiences")} (${cvData.experiences.length})`}>
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
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-dup" onClick={() => onDuplicate("experiences", exp.id)} title={t("duplicate")}>{t("duplicate")}</button>
                  <RemoveBtn onClick={() => onRemove("experiences", exp.id)} title={t("remove")} />
                </div>
              </div>
              <div className="field-row">
                <Field label={t("company")} value={exp.company} onChange={e => onUpdate("experiences", exp.id, "company", e.target.value)} onBlur={commitToHistory} placeholder={t("phCompany")} />
                <Field label={t("role")} value={exp.role} onChange={e => onUpdate("experiences", exp.id, "role", e.target.value)} onBlur={commitToHistory} placeholder={t("phRole")} />
              </div>
              <Field label={t("period")} value={exp.period} onChange={e => onUpdate("experiences", exp.id, "period", e.target.value)} onBlur={commitToHistory} placeholder={t("phPeriod")} />
              <div className="field-group">
                <label className="field-label">{t("description")}</label>
                <BulletsEditor bullets={exp.bullets || (exp.description ? [exp.description] : [""])}
                  onChange={val => onUpdate("experiences", exp.id, "bullets", val)}
                  onCommit={commitToHistory} placeholder={t("phBullet")} />
              </div>
            </SortableCard>
          )} />
      </Accordion>

      <Accordion open={openSection === "edu"} onToggle={() => toggleSection("edu")} title={`${t("educations")} (${cvData.educations.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("educations", { school:"", degree:"", period:"", bullets:[""] })}>+{t("add")}</button>
        </div>
        {cvData.educations.length === 0 && <p className="empty-hint">{t("noEdu")}</p>}
        <DraggableSection section="educations" items={cvData.educations} onReorder={onReorder}
          renderItem={(edu, i) => (
            <SortableCard key={edu.id} id={edu.id}>
              <div className="card-header"><span className="card-num">#{i+1}</span><RemoveBtn onClick={() => onRemove("educations", edu.id)} title={t("remove")} /></div>
              <div className="field-row">
                <Field label={t("school")} value={edu.school} onChange={e => onUpdate("educations", edu.id, "school", e.target.value)} onBlur={commitToHistory} placeholder={t("phSchool")} />
                <Field label={t("degree")} value={edu.degree} onChange={e => onUpdate("educations", edu.id, "degree", e.target.value)} onBlur={commitToHistory} placeholder={t("phDegree")} />
              </div>
              <Field label={t("period")} value={edu.period} onChange={e => onUpdate("educations", edu.id, "period", e.target.value)} onBlur={commitToHistory} placeholder={t("phEduPeriod")} />
              <div className="field-group">
                <label className="field-label">{t("descOptional")}</label>
                <BulletsEditor bullets={edu.bullets || (edu.description ? [edu.description] : [""])}
                  onChange={val => onUpdate("educations", edu.id, "bullets", val)}
                  onCommit={commitToHistory} placeholder={t("phEduDesc")} />
              </div>
            </SortableCard>
          )} />
      </Accordion>

      <Accordion open={openSection === "certs"} onToggle={() => toggleSection("certs")} title={`${t("certifications")} (${cvData.certifications.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("certifications", { name:"", issuer:"", date:"", url:"" })}>+{t("add")}</button>
        </div>
        {cvData.certifications.length === 0 && <p className="empty-hint">{t("noCert")}</p>}
        <DraggableSection section="certifications" items={cvData.certifications} onReorder={onReorder}
          renderItem={(cert, i) => (
            <SortableCard key={cert.id} id={cert.id}>
              <div className="card-header"><span className="card-num">#{i+1}</span><RemoveBtn onClick={() => onRemove("certifications", cert.id)} title={t("remove")} /></div>
              <Field label={t("certName")} value={cert.name} onChange={e => onUpdate("certifications", cert.id, "name", e.target.value)} onBlur={commitToHistory} placeholder={t("phCertName")} />
              <div className="field-row">
                <Field label={t("issuer")} value={cert.issuer} onChange={e => onUpdate("certifications", cert.id, "issuer", e.target.value)} onBlur={commitToHistory} placeholder={t("phIssuer")} />
                <Field label={t("date")} value={cert.date} onChange={e => onUpdate("certifications", cert.id, "date", e.target.value)} onBlur={commitToHistory} placeholder={t("phDate")} />
              </div>
              <Field label={t("link")} value={cert.url} onChange={e => onUpdate("certifications", cert.id, "url", e.target.value)} onBlur={commitToHistory} placeholder={t("phLink")} />
            </SortableCard>
          )} />
      </Accordion>

      <Accordion open={openSection === "projects"} onToggle={() => toggleSection("projects")} title={`${t("projects")} (${cvData.projects.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("projects", { name:"", stack:"", bullets:[""], url:"" })}>+{t("add")}</button>
        </div>
        {cvData.projects.length === 0 && <p className="empty-hint">{t("noProj")}</p>}
        <DraggableSection section="projects" items={cvData.projects} onReorder={onReorder}
          renderItem={(proj, i) => (
            <SortableCard key={proj.id} id={proj.id}>
              <div className="card-header"><span className="card-num">#{i+1}</span><RemoveBtn onClick={() => onRemove("projects", proj.id)} title={t("remove")} /></div>
              <div className="section-add-row" style={{ marginBottom: 8, marginTop: -2 }}>
                <button className="btn-dup" onClick={() => onDuplicate("projects", proj.id)}>{t("duplicate")}</button>
              </div>
              <div className="field-row">
                <Field label={t("projectName")} value={proj.name} onChange={e => onUpdate("projects", proj.id, "name", e.target.value)} onBlur={commitToHistory} placeholder={t("phProjectName")} />
                <Field label={t("stack")} value={proj.stack} onChange={e => onUpdate("projects", proj.id, "stack", e.target.value)} onBlur={commitToHistory} placeholder={t("phStack")} />
              </div>
              <div className="field-group">
                <label className="field-label">{t("description")}</label>
                <BulletsEditor bullets={proj.bullets || (proj.description ? [proj.description] : [""])}
                  onChange={val => onUpdate("projects", proj.id, "bullets", val)}
                  onCommit={commitToHistory} placeholder={t("phProjectDesc")} />
              </div>
              <Field label={t("link")} value={proj.url} onChange={e => onUpdate("projects", proj.id, "url", e.target.value)} onBlur={commitToHistory} placeholder={t("phUrl")} />
            </SortableCard>
          )} />
      </Accordion>

      <Accordion open={openSection === "skills"} onToggle={() => toggleSection("skills")} title={`${t("skills")} (${cvData.skills.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("skills", { name:"", level:3 })}>+{t("addSkill")}</button>
        </div>
        {cvData.skills.length === 0 && <p className="empty-hint">{t("noSkill")}</p>}
        <DraggableSection section="skills" items={cvData.skills} onReorder={onReorder}
          renderItem={(skill) => (
            <SortableCard key={skill.id} id={skill.id}>
              <div className="skill-row-dnd">
                <input className="skill-input" type="text" value={skill.name}
                  onChange={e => onUpdate("skills", skill.id, "name", e.target.value)}
                  onBlur={commitToHistory} placeholder={t("phSkill")} />
                <select className="skill-level" value={skill.level}
                  onChange={e => onUpdate("skills", skill.id, "level", Number(e.target.value))}>
                  {SKILL_LEVELS.map((l, idx) => <option key={idx} value={idx+1}>{l}</option>)}
                </select>
                <RemoveBtn onClick={() => onRemove("skills", skill.id)} title={t("remove")} />
              </div>
            </SortableCard>
          )} />
      </Accordion>

      <Accordion open={openSection === "lang"} onToggle={() => toggleSection("lang")} title={`${t("languages")} (${cvData.languages.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("languages", { name:"", level: LANG_LEVELS[2] })}>+{t("addLang")}</button>
        </div>
        {cvData.languages.length === 0 && <p className="empty-hint">{t("noLang")}</p>}
        <DraggableSection section="languages" items={cvData.languages} onReorder={onReorder}
          renderItem={(lang) => (
            <SortableCard key={lang.id} id={lang.id}>
              <div className="skill-row-dnd">
                <input className="skill-input" type="text" value={lang.name}
                  onChange={e => onUpdate("languages", lang.id, "name", e.target.value)}
                  onBlur={commitToHistory} placeholder={t("phLang")} />
                <select className="skill-level" value={lang.level}
                  onChange={e => onUpdate("languages", lang.id, "level", e.target.value)}>
                  {LANG_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <RemoveBtn onClick={() => onRemove("languages", lang.id)} title={t("remove")} />
              </div>
            </SortableCard>
          )} />
      </Accordion>

      <Accordion open={openSection === "hobbies"} onToggle={() => toggleSection("hobbies")} title={`${t("hobbies")} (${cvData.hobbies.length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={() => onAdd("hobbies", { name:"" })}>+{t("add")}</button>
        </div>
        {cvData.hobbies.length === 0 && <p className="empty-hint">{t("noHobby")}</p>}
        <DraggableSection section="hobbies" items={cvData.hobbies} onReorder={onReorder}
          renderItem={(h) => (
            <SortableCard key={h.id} id={h.id}>
              <div className="skill-row-dnd">
                <input className="skill-input" type="text" value={h.name}
                  onChange={e => onUpdate("hobbies", h.id, "name", e.target.value)}
                  onBlur={commitToHistory} placeholder="Ex : Photographie..." />
                <RemoveBtn onClick={() => onRemove("hobbies", h.id)} title={t("remove")} />
              </div>
            </SortableCard>
          )} />
      </Accordion>

      <Accordion open={openSection === "custom"} onToggle={() => toggleSection("custom")}
        title={`${t("customSections")} (${(cvData.customSections || []).length})`}>
        <div className="section-add-row">
          <button className="btn-add" onClick={onAddCustomSection}>+{t("addCustomSection")}</button>
        </div>
        {(cvData.customSections || []).length === 0 && (
          <p className="empty-hint">Publications, Benevolat, Distinctions...</p>
        )}
        {(cvData.customSections || []).map((sec) => (
          <div key={sec.id} className="dynamic-card custom-section-card">
            <div className="card-header">
              <input className="field-input custom-section-title-input" type="text" value={sec.title}
                onChange={e => onUpdateCustomSection(sec.id, "title", e.target.value)}
                onBlur={commitToHistory} placeholder={t("phCustomTitle")} />
              <RemoveBtn onClick={() => onRemoveCustomSection(sec.id)} title={t("remove")} />
            </div>
            <div className="custom-items">
              {(sec.items || []).map((item) => (
                <div key={item.id} className="custom-item">
                  <BulletsEditor bullets={item.bullets || [""]}
                    onChange={val => onUpdateCustomItem(sec.id, item.id, "bullets", val)}
                    onCommit={commitToHistory} placeholder={t("phBullet")} />
                  <button className="custom-item-remove" onClick={() => onRemoveCustomItem(sec.id, item.id)} title={t("remove")}>
                    {t("remove")}
                  </button>
                </div>
              ))}
              <button className="btn-add btn-add-sm" onClick={() => onAddCustomItem(sec.id)}>
                +{t("addCustomItem")}
              </button>
            </div>
          </div>
        ))}
      </Accordion>
    </div>
  )
}