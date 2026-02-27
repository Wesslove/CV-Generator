// CVForm.jsx – formulaire complet avec sections dynamiques
import React, { useState } from "react"

const SKILL_LEVELS = ["Notions", "Débutant", "Intermédiaire", "Avancé", "Expert"]

function SectionHeader({ title, icon, onAdd, addLabel }) {
  return (
    <div className="section-header">
      <span className="section-icon">{icon}</span>
      <h3 className="section-title">{title}</h3>
      {onAdd && (
        <button className="btn-add" onClick={onAdd} title={addLabel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {addLabel}
        </button>
      )}
    </div>
  )
}

function RemoveBtn({ onClick }) {
  return (
    <button className="btn-remove" onClick={onClick} title="Supprimer">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  )
}

export default function CVForm({ cvData, onChange, onPhoto, onAdd, onUpdate, onRemove, onTemplateChange }) {
  const [openSection, setOpenSection] = useState("personal")

  const toggle = (s) => setOpenSection(openSection === s ? null : s)

  return (
    <div className="cv-form">
      <h2 className="form-heading">Informations du CV</h2>

      {/* ── Switcher templates (mobile uniquement) ── */}
      <div className="mobile-template-switcher">
        <span className="mobile-template-label">Template</span>
        <div className="mobile-template-btns">
          {["classic", "modern", "minimal", "executive"].map((t) => (
            <button
              key={t}
              className={`tpl-btn ${cvData.template === t ? "active" : ""}`}
              onClick={() => onTemplateChange && onTemplateChange(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Informations personnelles ── */}
      <div className={`accordion ${openSection === "personal" ? "open" : ""}`}>
        <button className="accordion-trigger" onClick={() => toggle("personal")}>
          <span>👤 Informations personnelles</span>
          <span className="accordion-arrow">{openSection === "personal" ? "▲" : "▼"}</span>
        </button>
        {openSection === "personal" && (
          <div className="accordion-body">
            {/* Photo */}
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
                  <span>Ajouter une photo</span>
                  <input type="file" accept="image/*" onChange={onPhoto} hidden />
                </label>
              )}
            </div>

            <Field label="Nom complet *" name="name" value={cvData.name} onChange={onChange} placeholder="Ex : Jean Dupont" />
            <Field label="Titre professionnel *" name="title" value={cvData.title} onChange={onChange} placeholder="Ex : Développeur Full Stack" />
            <div className="field-row">
              <Field label="Téléphone" name="phone" value={cvData.phone} onChange={onChange} placeholder="+33 6 00 00 00 00" />
              <Field label="Email *" name="email" type="email" value={cvData.email} onChange={onChange} placeholder="nom@exemple.com" />
            </div>
            <div className="field-row">
              <Field label="Ville / Pays" name="location" value={cvData.location} onChange={onChange} placeholder="Paris, France" />
              <Field label="LinkedIn" name="linkedin" value={cvData.linkedin} onChange={onChange} placeholder="linkedin.com/in/..." />
            </div>
            <Field label="Résumé professionnel" name="summary" value={cvData.summary} onChange={onChange} textarea rows={4} placeholder="Décrivez votre profil en 2-3 phrases percutantes..." />
          </div>
        )}
      </div>

      {/* ── Expériences professionnelles ── */}
      <div className={`accordion ${openSection === "exp" ? "open" : ""}`}>
        <button className="accordion-trigger" onClick={() => toggle("exp")}>
          <span>💼 Expériences <em>({cvData.experiences.length})</em></span>
          <span className="accordion-arrow">{openSection === "exp" ? "▲" : "▼"}</span>
        </button>
        {openSection === "exp" && (
          <div className="accordion-body">
            <SectionHeader
              title="" icon=""
              onAdd={() => onAdd("experiences", { company: "", role: "", period: "", description: "" })}
              addLabel="Ajouter une expérience"
            />
            {cvData.experiences.length === 0 && (
              <p className="empty-hint">Aucune expérience ajoutée. Cliquez sur le bouton ci-dessus.</p>
            )}
            {cvData.experiences.map((exp, i) => (
              <div key={exp.id} className="dynamic-card">
                <div className="card-header">
                  <span className="card-num">#{i + 1}</span>
                  <RemoveBtn onClick={() => onRemove("experiences", exp.id)} />
                </div>
                <div className="field-row">
                  <Field label="Entreprise" value={exp.company} onChange={(e) => onUpdate("experiences", exp.id, "company", e.target.value)} placeholder="Nom de l'entreprise" />
                  <Field label="Poste" value={exp.role} onChange={(e) => onUpdate("experiences", exp.id, "role", e.target.value)} placeholder="Intitulé du poste" />
                </div>
                <Field label="Période" value={exp.period} onChange={(e) => onUpdate("experiences", exp.id, "period", e.target.value)} placeholder="Jan 2022 – Présent" />
                <Field label="Description" value={exp.description} onChange={(e) => onUpdate("experiences", exp.id, "description", e.target.value)} textarea rows={3} placeholder="Décrivez vos missions et accomplissements..." />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Formation ── */}
      <div className={`accordion ${openSection === "edu" ? "open" : ""}`}>
        <button className="accordion-trigger" onClick={() => toggle("edu")}>
          <span>🎓 Formation <em>({cvData.educations.length})</em></span>
          <span className="accordion-arrow">{openSection === "edu" ? "▲" : "▼"}</span>
        </button>
        {openSection === "edu" && (
          <div className="accordion-body">
            <SectionHeader
              title="" icon=""
              onAdd={() => onAdd("educations", { school: "", degree: "", period: "", description: "" })}
              addLabel="Ajouter une formation"
            />
            {cvData.educations.length === 0 && (
              <p className="empty-hint">Aucune formation ajoutée.</p>
            )}
            {cvData.educations.map((edu, i) => (
              <div key={edu.id} className="dynamic-card">
                <div className="card-header">
                  <span className="card-num">#{i + 1}</span>
                  <RemoveBtn onClick={() => onRemove("educations", edu.id)} />
                </div>
                <div className="field-row">
                  <Field label="École / Université" value={edu.school} onChange={(e) => onUpdate("educations", edu.id, "school", e.target.value)} placeholder="Nom de l'établissement" />
                  <Field label="Diplôme" value={edu.degree} onChange={(e) => onUpdate("educations", edu.id, "degree", e.target.value)} placeholder="Licence, Master, BTS..." />
                </div>
                <Field label="Période" value={edu.period} onChange={(e) => onUpdate("educations", edu.id, "period", e.target.value)} placeholder="2018 – 2021" />
                <Field label="Description (optionnel)" value={edu.description} onChange={(e) => onUpdate("educations", edu.id, "description", e.target.value)} textarea rows={2} placeholder="Spécialité, mention, projets..." />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Compétences ── */}
      <div className={`accordion ${openSection === "skills" ? "open" : ""}`}>
        <button className="accordion-trigger" onClick={() => toggle("skills")}>
          <span>⚡ Compétences <em>({cvData.skills.length})</em></span>
          <span className="accordion-arrow">{openSection === "skills" ? "▲" : "▼"}</span>
        </button>
        {openSection === "skills" && (
          <div className="accordion-body">
            <SectionHeader
              title="" icon=""
              onAdd={() => onAdd("skills", { name: "", level: 3 })}
              addLabel="Ajouter une compétence"
            />
            {cvData.skills.length === 0 && <p className="empty-hint">Aucune compétence ajoutée.</p>}
            <div className="skills-list">
              {cvData.skills.map((skill) => (
                <div key={skill.id} className="skill-row">
                  <input
                    className="skill-input"
                    type="text"
                    value={skill.name}
                    onChange={(e) => onUpdate("skills", skill.id, "name", e.target.value)}
                    placeholder="Ex : React, Photoshop..."
                  />
                  <select
                    className="skill-level"
                    value={skill.level}
                    onChange={(e) => onUpdate("skills", skill.id, "level", Number(e.target.value))}
                  >
                    {SKILL_LEVELS.map((l, i) => (
                      <option key={i} value={i + 1}>{l}</option>
                    ))}
                  </select>
                  <RemoveBtn onClick={() => onRemove("skills", skill.id)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Langues ── */}
      <div className={`accordion ${openSection === "lang" ? "open" : ""}`}>
        <button className="accordion-trigger" onClick={() => toggle("lang")}>
          <span>🌍 Langues <em>({cvData.languages.length})</em></span>
          <span className="accordion-arrow">{openSection === "lang" ? "▲" : "▼"}</span>
        </button>
        {openSection === "lang" && (
          <div className="accordion-body">
            <SectionHeader
              title="" icon=""
              onAdd={() => onAdd("languages", { name: "", level: "Intermédiaire" })}
              addLabel="Ajouter une langue"
            />
            {cvData.languages.length === 0 && <p className="empty-hint">Aucune langue ajoutée.</p>}
            <div className="skills-list">
              {cvData.languages.map((lang) => (
                <div key={lang.id} className="skill-row">
                  <input
                    className="skill-input"
                    type="text"
                    value={lang.name}
                    onChange={(e) => onUpdate("languages", lang.id, "name", e.target.value)}
                    placeholder="Ex : Anglais, Espagnol..."
                  />
                  <select
                    className="skill-level"
                    value={lang.level}
                    onChange={(e) => onUpdate("languages", lang.id, "level", e.target.value)}
                  >
                    {["Notions", "Scolaire", "Courant", "Bilingue", "Natif"].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <RemoveBtn onClick={() => onRemove("languages", lang.id)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant Field réutilisable
function Field({ label, name, value, onChange, placeholder, type = "text", textarea, rows }) {
  return (
    <div className="field-group">
      {label && <label className="field-label">{label}</label>}
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
          className="field-input field-textarea"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="field-input"
        />
      )}
    </div>
  )
}