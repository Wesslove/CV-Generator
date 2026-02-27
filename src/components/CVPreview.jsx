// CVPreview.jsx – aperçu avec 3 templates : classic, modern, minimal
import React from "react"

const SKILL_LABELS = ["", "Notions", "Débutant", "Intermédiaire", "Avancé", "Expert"]

// Barre de niveau pour les compétences
function SkillBar({ level, color }) {
  return (
    <div className="skill-bar-track">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="skill-dot" style={{ background: i <= level ? color : "#e5e7eb" }} />
      ))}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// TEMPLATE CLASSIC
// ────────────────────────────────────────────────────────────
function ClassicTemplate({ cv }) {
  return (
    <div className="tpl-classic">
      {/* En-tête */}
      <header className="classic-header">
        {cv.photo && <img src={cv.photo} alt="Photo" className="classic-photo" />}
        <div className="classic-identity">
          <h1>{cv.name || "Votre Nom"}</h1>
          <h2>{cv.title || "Titre Professionnel"}</h2>
          <div className="classic-contacts">
            {cv.phone && <span>📞 {cv.phone}</span>}
            {cv.email && <span>✉ {cv.email}</span>}
            {cv.location && <span>📍 {cv.location}</span>}
            {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
          </div>
        </div>
      </header>

      <div className="classic-body">
        {/* Colonne gauche */}
        <aside className="classic-aside">
          {cv.skills.length > 0 && (
            <section>
              <h3 className="classic-section-title">Compétences</h3>
              <div className="classic-skills">
                {cv.skills.map((s) => (
                  <div key={s.id} className="classic-skill-item">
                    <span>{s.name}</span>
                    <SkillBar level={s.level} color="#2563eb" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.languages.length > 0 && (
            <section>
              <h3 className="classic-section-title">Langues</h3>
              {cv.languages.map((l) => (
                <div key={l.id} className="classic-skill-item">
                  <span>{l.name}</span>
                  <em className="lang-level">{l.level}</em>
                </div>
              ))}
            </section>
          )}

          {cv.hobbies && cv.hobbies.length > 0 && (
            <section>
              <h3 className="classic-section-title">Loisirs</h3>
              <ul className="hobbies-list">
                {cv.hobbies.map((h) => (
                  <li key={h.id}>{h.name}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Colonne droite */}
        <div className="classic-main">
          {cv.summary && (
            <section>
              <h3 className="classic-section-title main-title">Profil</h3>
              <p className="summary-text">{cv.summary}</p>
            </section>
          )}

          {cv.experiences.length > 0 && (
            <section>
              <h3 className="classic-section-title main-title">Expériences</h3>
              {cv.experiences.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="tl-header">
                      <strong>{exp.role || "Poste"}</strong>
                      <span className="tl-period">{exp.period}</span>
                    </div>
                    <div className="tl-company">{exp.company}</div>
                    {exp.description && <p className="tl-desc">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {cv.educations.length > 0 && (
            <section>
              <h3 className="classic-section-title main-title">Formation</h3>
              {cv.educations.map((edu) => (
                <div key={edu.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="tl-header">
                      <strong>{edu.degree || "Diplôme"}</strong>
                      <span className="tl-period">{edu.period}</span>
                    </div>
                    <div className="tl-company">{edu.school}</div>
                    {edu.description && <p className="tl-desc">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// TEMPLATE MODERN
// ────────────────────────────────────────────────────────────
function ModernTemplate({ cv }) {
  return (
    <div className="tpl-modern">
      {/* Bande colorée en-tête */}
      <header className="modern-header">
        {cv.photo && (
          <div className="modern-photo-wrap">
            <img src={cv.photo} alt="Photo" className="modern-photo" />
          </div>
        )}
        <div className="modern-identity">
          <h1>{cv.name || "Votre Nom"}</h1>
          <div className="modern-title-badge">{cv.title || "Titre Professionnel"}</div>
          <div className="modern-contacts">
            {cv.phone && <span>{cv.phone}</span>}
            {cv.email && <span>{cv.email}</span>}
            {cv.location && <span>{cv.location}</span>}
            {cv.linkedin && <span>{cv.linkedin}</span>}
          </div>
        </div>
      </header>

      <div className="modern-body">
        {cv.summary && (
          <div className="modern-summary">
            <p>{cv.summary}</p>
          </div>
        )}

        <div className="modern-columns">
          <div className="modern-left">
            {cv.skills.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title">
                  <span className="msec-icon">⚡</span> Compétences
                </h3>
                {cv.skills.map((s) => (
                  <div key={s.id} className="modern-skill">
                    <div className="modern-skill-label">
                      <span>{s.name}</span>
                      <span className="skill-pct">{SKILL_LABELS[s.level]}</span>
                    </div>
                    <div className="modern-skill-bar">
                      <div className="modern-skill-fill" style={{ width: `${(s.level / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </section>
            )}

            {cv.languages.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title">
                  <span className="msec-icon">🌍</span> Langues
                </h3>
                {cv.languages.map((l) => (
                  <div key={l.id} className="modern-lang">
                    <span>{l.name}</span>
                    <span className="lang-badge">{l.level}</span>
                  </div>
                ))}
              </section>
            )}

            {cv.hobbies && cv.hobbies.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title">
                  <span className="msec-icon">🎯</span> Loisirs
                </h3>
                <ul className="hobbies-list">
                  {cv.hobbies.map((h) => (
                    <li key={h.id}>{h.name}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="modern-right">
            {cv.experiences.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title">
                  <span className="msec-icon">💼</span> Expériences
                </h3>
                {cv.experiences.map((exp) => (
                  <div key={exp.id} className="modern-entry">
                    <div className="modern-entry-header">
                      <span className="entry-role">{exp.role || "Poste"}</span>
                      <span className="entry-period">{exp.period}</span>
                    </div>
                    <div className="entry-company">{exp.company}</div>
                    {exp.description && <p className="entry-desc">{exp.description}</p>}
                  </div>
                ))}
              </section>
            )}

            {cv.educations.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title">
                  <span className="msec-icon">🎓</span> Formation
                </h3>
                {cv.educations.map((edu) => (
                  <div key={edu.id} className="modern-entry">
                    <div className="modern-entry-header">
                      <span className="entry-role">{edu.degree || "Diplôme"}</span>
                      <span className="entry-period">{edu.period}</span>
                    </div>
                    <div className="entry-company">{edu.school}</div>
                    {edu.description && <p className="entry-desc">{edu.description}</p>}
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// TEMPLATE MINIMAL
// ────────────────────────────────────────────────────────────
function MinimalTemplate({ cv }) {
  return (
    <div className="tpl-minimal">
      <header className="min-header">
        {cv.photo && <img src={cv.photo} alt="Photo" className="min-photo" />}
        <div>
          <h1>{cv.name || "Votre Nom"}</h1>
          <p className="min-title">{cv.title || "Titre Professionnel"}</p>
          <div className="min-contacts">
            {[cv.phone, cv.email, cv.location, cv.linkedin].filter(Boolean).join(" · ")}
          </div>
        </div>
      </header>

      <hr className="min-rule" />

      {cv.summary && (
        <>
          <p className="min-summary">{cv.summary}</p>
          <hr className="min-rule thin" />
        </>
      )}

      <div className="min-grid">
        <div className="min-col-left">
          {cv.skills.length > 0 && (
            <section className="min-section">
              <h3>Compétences</h3>
              {cv.skills.map((s) => (
                <div key={s.id} className="min-skill">
                  <span>{s.name}</span>
                  <span className="min-level">{"●".repeat(s.level)}{"○".repeat(5 - s.level)}</span>
                </div>
              ))}
            </section>
          )}
          {cv.languages.length > 0 && (
            <section className="min-section">
              <h3>Langues</h3>
              {cv.languages.map((l) => (
                <div key={l.id} className="min-skill">
                  <span>{l.name}</span>
                  <span className="min-level-text">{l.level}</span>
                </div>
              ))}
            </section>
          )}

          {cv.hobbies && cv.hobbies.length > 0 && (
            <section className="min-section">
              <h3>Loisirs</h3>
              {cv.hobbies.map((h) => (
                <div key={h.id} className="min-skill">
                  <span>{h.name}</span>
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="min-col-right">
          {cv.experiences.length > 0 && (
            <section className="min-section">
              <h3>Expériences</h3>
              {cv.experiences.map((exp) => (
                <div key={exp.id} className="min-entry">
                  <div className="min-entry-top">
                    <strong>{exp.role || "Poste"}</strong>
                    <span>{exp.period}</span>
                  </div>
                  <em>{exp.company}</em>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}
          {cv.educations.length > 0 && (
            <section className="min-section">
              <h3>Formation</h3>
              {cv.educations.map((edu) => (
                <div key={edu.id} className="min-entry">
                  <div className="min-entry-top">
                    <strong>{edu.degree || "Diplôme"}</strong>
                    <span>{edu.period}</span>
                  </div>
                  <em>{edu.school}</em>
                  {edu.description && <p>{edu.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}


// ────────────────────────────────────────────────────────────
// TEMPLATE EXECUTIVE
// ────────────────────────────────────────────────────────────
function ExecutiveTemplate({ cv }) {
  const initials = cv.name
    ? cv.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  return (
    <div className="tpl-executive">
      {/* Sidebar gauche foncée */}
      <aside className="exec-sidebar">
        {/* Photo strictement encadrée */}
        <div className="exec-photo-wrap">
          {cv.photo
            ? <img src={cv.photo} alt="Photo" className="exec-photo" />
            : <div className="exec-no-photo">{initials}</div>
          }
        </div>

        {/* Coordonnées */}
        <div className="exec-sidebar-section">
          <div className="exec-sidebar-title">Contact</div>
          {cv.phone    && <div className="exec-contact-item">📞 {cv.phone}</div>}
          {cv.email    && <div className="exec-contact-item">✉ {cv.email}</div>}
          {cv.location && <div className="exec-contact-item">📍 {cv.location}</div>}
          {cv.linkedin && <div className="exec-contact-item">🔗 {cv.linkedin}</div>}
        </div>

        {/* Compétences */}
        {cv.skills.length > 0 && (
          <div className="exec-sidebar-section">
            <div className="exec-sidebar-title">Compétences</div>
            {cv.skills.map((s) => (
              <div key={s.id} className="exec-skill-item">
                <div className="exec-skill-name">{s.name}</div>
                <div className="exec-skill-bar-track">
                  <div className="exec-skill-bar-fill" style={{ width: `${(s.level / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Langues */}
        {cv.languages.length > 0 && (
          <div className="exec-sidebar-section">
            <div className="exec-sidebar-title">Langues</div>
            {cv.languages.map((l) => (
              <div key={l.id} className="exec-lang-item">
                <span>{l.name}</span>
                <span className="exec-lang-level">{l.level}</span>
              </div>
            ))}
          </div>
        )}

        {/* Loisirs */}
        {cv.hobbies && cv.hobbies.length > 0 && (
          <div className="exec-sidebar-section">
            <div className="exec-sidebar-title">Loisirs</div>
            {cv.hobbies.map((h) => (
              <div key={h.id} className="exec-lang-item">{h.name}</div>
            ))}
          </div>
        )}
      </aside>

      {/* Colonne droite */}
      <div className="exec-main">
        <header className="exec-header">
          <div className="exec-name">{cv.name || "Votre Nom"}</div>
          <div className="exec-job-title">{cv.title || "Titre Professionnel"}</div>
        </header>

        <div className="exec-content">
          {cv.summary && (
            <div className="exec-summary">{cv.summary}</div>
          )}

          {cv.experiences.length > 0 && (
            <section>
              <div className="exec-section-title">Expériences Professionnelles</div>
              {cv.experiences.map((exp) => (
                <div key={exp.id} className="exec-entry">
                  <div className="exec-entry-header">
                    <span className="exec-entry-role">{exp.role || "Poste"}</span>
                    {exp.period && <span className="exec-entry-period">{exp.period}</span>}
                  </div>
                  {exp.company && <div className="exec-entry-company">{exp.company}</div>}
                  {exp.description && <p className="exec-entry-desc">{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {cv.educations.length > 0 && (
            <section>
              <div className="exec-section-title">Formation</div>
              {cv.educations.map((edu) => (
                <div key={edu.id} className="exec-entry">
                  <div className="exec-entry-header">
                    <span className="exec-entry-role">{edu.degree || "Diplôme"}</span>
                    {edu.period && <span className="exec-entry-period">{edu.period}</span>}
                  </div>
                  {edu.school && <div className="exec-entry-company">{edu.school}</div>}
                  {edu.description && <p className="exec-entry-desc">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Composant principal
// ────────────────────────────────────────────────────────────
export default function CVPreview({ cvData }) {
  const templates = {
    classic: <ClassicTemplate cv={cvData} />,
    modern: <ModernTemplate cv={cvData} />,
    minimal: <MinimalTemplate cv={cvData} />,
    executive: <ExecutiveTemplate cv={cvData} />
  }

  return (
    <div id="cv-preview" className={`cv-paper template-${cvData.template}`}>
      {templates[cvData.template] || templates.classic}
    </div>
  )
}