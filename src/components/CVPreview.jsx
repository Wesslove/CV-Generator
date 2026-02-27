// CVPreview.jsx – 6 templates : classic, modern, minimal, executive, creative, timeline
import React from "react"

const SKILL_LABELS = ["", "Notions", "Débutant", "Intermédiaire", "Avancé", "Expert"]

function SkillBar({ level }) {
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
function CertsList({ certs, titleClass }) {
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

function ProjectsList({ projects, titleClass }) {
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
          {p.description && <p className="proj-desc">{p.description}</p>}
          {p.url && <a className="proj-url" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
        </div>
      ))}
    </section>
  )
}

// ────────────────────────────────────────────────────────────
// TEMPLATE CLASSIC
// ────────────────────────────────────────────────────────────
function ClassicTemplate({ cv, t }) {
  return (
    <div className="tpl-classic">
      <header className="classic-header">
        {cv.photo && <img src={cv.photo} alt="Photo" className="classic-photo" />}
        <div className="classic-identity">
          <h1>{cv.name || "Votre Nom"}</h1>
          <h2>{cv.title || "Titre Professionnel"}</h2>
          <div className="classic-contacts">
            {cv.phone    && <span>📞 {cv.phone}</span>}
            {cv.email    && <span>✉ {cv.email}</span>}
            {cv.location && <span>📍 {cv.location}</span>}
            {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
          </div>
        </div>
      </header>

      <div className="classic-body">
        <aside className="classic-aside">
          {cv.skills.length > 0 && (
            <section>
              <h3 className="classic-section-title">{t("tplSkills")}</h3>
              <div className="classic-skills">
                {cv.skills.map((s) => (
                  <div key={s.id} className="classic-skill-item">
                    <span>{s.name}</span>
                    <SkillBar level={s.level} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {cv.languages.length > 0 && (
            <section>
              <h3 className="classic-section-title">{t("tplLangs")}</h3>
              {cv.languages.map((l) => (
                <div key={l.id} className="classic-skill-item">
                  <span>{l.name}</span>
                  <em className="lang-level">{l.level}</em>
                </div>
              ))}
            </section>
          )}
          {cv.certifications && cv.certifications.length > 0 && (
            <CertsList certs={cv.certifications} titleClass="classic-section-title" />
          )}
          {cv.hobbies && cv.hobbies.length > 0 && (
            <section>
              <h3 className="classic-section-title">{t("tplHobbies")}</h3>
              <ul className="hobbies-list">
                {cv.hobbies.map((h) => <li key={h.id}>{h.name}</li>)}
              </ul>
            </section>
          )}
        </aside>

        <div className="classic-main">
          {cv.summary && (
            <section>
              <h3 className="classic-section-title main-title">{t("tplProfile")}</h3>
              <p className="summary-text">{cv.summary}</p>
            </section>
          )}
          {cv.experiences.length > 0 && (
            <section>
              <h3 className="classic-section-title main-title">{t("tplExp")}</h3>
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
              <h3 className="classic-section-title main-title">{t("tplEdu")}</h3>
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
          {cv.projects && cv.projects.length > 0 && (
            <ProjectsList projects={cv.projects} titleClass="classic-section-title main-title" />
          )}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// TEMPLATE MODERN
// ────────────────────────────────────────────────────────────
function ModernTemplate({ cv, t }) {
  return (
    <div className="tpl-modern">
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
            {cv.phone    && <span>{cv.phone}</span>}
            {cv.email    && <span>{cv.email}</span>}
            {cv.location && <span>{cv.location}</span>}
            {cv.linkedin && <span>{cv.linkedin}</span>}
          </div>
        </div>
      </header>

      <div className="modern-body">
        {cv.summary && (
          <div className="modern-summary"><p>{cv.summary}</p></div>
        )}
        <div className="modern-columns">
          <div className="modern-left">
            {cv.skills.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title"><span className="msec-icon">⚡</span> Compétences</h3>
                {cv.skills.map((s) => (
                  <div key={s.id} className="modern-skill">
                    <div className="modern-skill-label">
                      <span>{s.name}</span>
                      <span className="skill-pct">{SKILL_LABELS[s.level]}</span>
                    </div>
                    <div className="modern-skill-bar">
                      <div className="modern-skill-fill" style={{ width: `${(s.level/5)*100}%` }} />
                    </div>
                  </div>
                ))}
              </section>
            )}
            {cv.languages.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title"><span className="msec-icon">🌍</span> Langues</h3>
                {cv.languages.map((l) => (
                  <div key={l.id} className="modern-lang">
                    <span>{l.name}</span>
                    <span className="lang-badge">{l.level}</span>
                  </div>
                ))}
              </section>
            )}
            {cv.certifications && cv.certifications.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title"><span className="msec-icon">🏆</span> Certifications</h3>
                {cv.certifications.map((c) => (
                  <div key={c.id} className="cert-item">
                    <div className="cert-top"><strong>{c.name}</strong>{c.date && <span className="cert-date">{c.date}</span>}</div>
                    {c.issuer && <div className="cert-issuer">{c.issuer}</div>}
                  </div>
                ))}
              </section>
            )}
            {cv.hobbies && cv.hobbies.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title"><span className="msec-icon">🎯</span> Loisirs</h3>
                <ul className="hobbies-list">{cv.hobbies.map((h) => <li key={h.id}>{h.name}</li>)}</ul>
              </section>
            )}
          </div>

          <div className="modern-right">
            {cv.experiences.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title"><span className="msec-icon">💼</span> Expériences</h3>
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
                <h3 className="modern-section-title"><span className="msec-icon">🎓</span> Formation</h3>
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
            {cv.projects && cv.projects.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title"><span className="msec-icon">🚀</span> Projets</h3>
                {cv.projects.map((p) => (
                  <div key={p.id} className="proj-item">
                    <div className="proj-top"><strong>{p.name}</strong>{p.stack && <span className="proj-stack">{p.stack}</span>}</div>
                    {p.description && <p className="proj-desc">{p.description}</p>}
                    {p.url && <a className="proj-url" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
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
function MinimalTemplate({ cv, t }) {
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
      {cv.summary && (<><p className="min-summary">{cv.summary}</p><hr className="min-rule thin" /></>)}
      <div className="min-grid">
        <div className="min-col-left">
          {cv.skills.length > 0 && (
            <section className="min-section">
              <h3>{t("tplSkills")}</h3>
              {cv.skills.map((s) => (
                <div key={s.id} className="min-skill">
                  <span>{s.name}</span>
                  <span className="min-level">{"●".repeat(s.level)}{"○".repeat(5-s.level)}</span>
                </div>
              ))}
            </section>
          )}
          {cv.languages.length > 0 && (
            <section className="min-section">
              <h3>{t("tplLangs")}</h3>
              {cv.languages.map((l) => (
                <div key={l.id} className="min-skill">
                  <span>{l.name}</span>
                  <span className="min-level-text">{l.level}</span>
                </div>
              ))}
            </section>
          )}
          {cv.certifications && cv.certifications.length > 0 && (
            <section className="min-section">
              <h3>{t("tplCerts")}</h3>
              {cv.certifications.map((c) => (
                <div key={c.id} className="min-skill">
                  <span>{c.name}</span>
                  <span className="min-level-text">{c.date}</span>
                </div>
              ))}
            </section>
          )}
          {cv.hobbies && cv.hobbies.length > 0 && (
            <section className="min-section">
              <h3>{t("tplHobbies")}</h3>
              {cv.hobbies.map((h) => <div key={h.id} className="min-skill"><span>{h.name}</span></div>)}
            </section>
          )}
        </div>
        <div className="min-col-right">
          {cv.experiences.length > 0 && (
            <section className="min-section">
              <h3>{t("tplExp")}</h3>
              {cv.experiences.map((exp) => (
                <div key={exp.id} className="min-entry">
                  <div className="min-entry-top"><strong>{exp.role || "Poste"}</strong><span>{exp.period}</span></div>
                  <em>{exp.company}</em>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}
          {cv.educations.length > 0 && (
            <section className="min-section">
              <h3>{t("tplEdu")}</h3>
              {cv.educations.map((edu) => (
                <div key={edu.id} className="min-entry">
                  <div className="min-entry-top"><strong>{edu.degree || "Diplôme"}</strong><span>{edu.period}</span></div>
                  <em>{edu.school}</em>
                  {edu.description && <p>{edu.description}</p>}
                </div>
              ))}
            </section>
          )}
          {cv.projects && cv.projects.length > 0 && (
            <section className="min-section">
              <h3>{t("tplProjects")}</h3>
              {cv.projects.map((p) => (
                <div key={p.id} className="min-entry">
                  <div className="min-entry-top"><strong>{p.name}</strong>{p.stack && <span>{p.stack}</span>}</div>
                  {p.description && <p>{p.description}</p>}
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
function ExecutiveTemplate({ cv, t }) {
  const initials = cv.name ? cv.name.split(" ").map((n) => n[0]).slice(0,2).join("").toUpperCase() : "?"
  return (
    <div className="tpl-executive">
      <aside className="exec-sidebar">
        <div className="exec-photo-wrap">
          {cv.photo ? <img src={cv.photo} alt="Photo" className="exec-photo" />
                    : <div className="exec-no-photo">{initials}</div>}
        </div>
        <div className="exec-sidebar-section">
          <div className="exec-sidebar-title">{t("tplContact")}</div>
          {cv.phone    && <div className="exec-contact-item">📞 {cv.phone}</div>}
          {cv.email    && <div className="exec-contact-item">✉ {cv.email}</div>}
          {cv.location && <div className="exec-contact-item">📍 {cv.location}</div>}
          {cv.linkedin && <div className="exec-contact-item">🔗 {cv.linkedin}</div>}
        </div>
        {cv.skills.length > 0 && (
          <div className="exec-sidebar-section">
            <div className="exec-sidebar-title">{t("tplSkills")}</div>
            {cv.skills.map((s) => (
              <div key={s.id} className="exec-skill-item">
                <div className="exec-skill-name">{s.name}</div>
                <div className="exec-skill-bar-track">
                  <div className="exec-skill-bar-fill" style={{ width: `${(s.level/5)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {cv.languages.length > 0 && (
          <div className="exec-sidebar-section">
            <div className="exec-sidebar-title">{t("tplLangs")}</div>
            {cv.languages.map((l) => (
              <div key={l.id} className="exec-lang-item">
                <span>{l.name}</span>
                <span className="exec-lang-level">{l.level}</span>
              </div>
            ))}
          </div>
        )}
        {cv.certifications && cv.certifications.length > 0 && (
          <div className="exec-sidebar-section">
            <div className="exec-sidebar-title">{t("tplCerts")}</div>
            {cv.certifications.map((c) => (
              <div key={c.id} className="exec-lang-item">
                <span style={{fontSize:'11px'}}>{c.name}</span>
                <span className="exec-lang-level">{c.date}</span>
              </div>
            ))}
          </div>
        )}
        {cv.hobbies && cv.hobbies.length > 0 && (
          <div className="exec-sidebar-section">
            <div className="exec-sidebar-title">{t("tplHobbies")}</div>
            {cv.hobbies.map((h) => <div key={h.id} className="exec-lang-item">{h.name}</div>)}
          </div>
        )}
      </aside>

      <div className="exec-main">
        <header className="exec-header">
          <div className="exec-name">{cv.name || "Votre Nom"}</div>
          <div className="exec-job-title">{cv.title || "Titre Professionnel"}</div>
        </header>
        <div className="exec-content">
          {cv.summary && <div className="exec-summary">{cv.summary}</div>}
          {cv.experiences.length > 0 && (
            <section>
              <div className="exec-section-title">{t("tplExpPro")}</div>
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
              <div className="exec-section-title">{t("tplEdu")}</div>
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
          {cv.projects && cv.projects.length > 0 && (
            <section>
              <div className="exec-section-title">{t("tplProjects")}</div>
              {cv.projects.map((p) => (
                <div key={p.id} className="exec-entry">
                  <div className="exec-entry-header">
                    <span className="exec-entry-role">{p.name}</span>
                    {p.stack && <span className="exec-entry-period">{p.stack}</span>}
                  </div>
                  {p.description && <p className="exec-entry-desc">{p.description}</p>}
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
// TEMPLATE CREATIVE
// ────────────────────────────────────────────────────────────
function CreativeTemplate({ cv, t }) {
  return (
    <div className="tpl-creative">
      <div className="creative-hero">
        <div className="creative-hero-bg" />
        <div className="creative-hero-content">
          {cv.photo && <img src={cv.photo} alt="Photo" className="creative-photo" />}
          <div className="creative-identity">
            <div className="creative-name">{cv.name || "Votre Nom"}</div>
            <div className="creative-title">{cv.title || "Titre Professionnel"}</div>
            <div className="creative-contacts">
              {cv.phone    && <span className="creative-chip">📞 {cv.phone}</span>}
              {cv.email    && <span className="creative-chip">✉ {cv.email}</span>}
              {cv.location && <span className="creative-chip">📍 {cv.location}</span>}
              {cv.linkedin && <span className="creative-chip">🔗 {cv.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="creative-body">
        <aside className="creative-aside">
          {cv.skills.length > 0 && (
            <section className="creative-section">
              <div className="creative-sec-label">Skills</div>
              {cv.skills.map((s) => (
                <div key={s.id} className="creative-skill-item">
                  <div className="creative-skill-top">
                    <span className="creative-skill-name">{s.name}</span>
                    <span className="creative-skill-pct">{Math.round((s.level/5)*100)}%</span>
                  </div>
                  <div className="creative-skill-track">
                    <div className="creative-skill-fill" style={{ width: `${(s.level/5)*100}%` }} />
                  </div>
                </div>
              ))}
            </section>
          )}
          {cv.languages.length > 0 && (
            <section className="creative-section">
              <div className="creative-sec-label">{t("tplLangs")}</div>
              {cv.languages.map((l) => (
                <div key={l.id} className="creative-lang-row">
                  <span>{l.name}</span>
                  <span className="creative-lang-badge">{l.level}</span>
                </div>
              ))}
            </section>
          )}
          {cv.certifications && cv.certifications.length > 0 && (
            <section className="creative-section">
              <div className="creative-sec-label">{t("tplCerts")}</div>
              {cv.certifications.map((c) => (
                <div key={c.id} className="creative-lang-row">
                  <span style={{fontSize:'11px'}}>{c.name}</span>
                  <span className="creative-lang-badge">{c.date}</span>
                </div>
              ))}
            </section>
          )}
          {cv.hobbies && cv.hobbies.length > 0 && (
            <section className="creative-section">
              <div className="creative-sec-label">{t("tplHobbies")}</div>
              <div className="creative-hobbies-list">
                {cv.hobbies.map((h) => <span key={h.id} className="creative-hobby-tag">{h.name}</span>)}
              </div>
            </section>
          )}
        </aside>

        <div className="creative-main">
          {cv.summary && (
            <section className="creative-main-section">
              <div className="creative-main-label">À propos</div>
              <p className="creative-summary">{cv.summary}</p>
            </section>
          )}
          {cv.experiences.length > 0 && (
            <section className="creative-main-section">
              <div className="creative-main-label">{t("tplExp")}</div>
              {cv.experiences.map((exp, i) => (
                <div key={exp.id} className="creative-entry">
                  <div className="creative-entry-num">{String(i+1).padStart(2,"0")}</div>
                  <div className="creative-entry-body">
                    <div className="creative-entry-top">
                      <strong>{exp.role || "Poste"}</strong>
                      {exp.period && <span className="creative-entry-period">{exp.period}</span>}
                    </div>
                    {exp.company && <div className="creative-entry-company">{exp.company}</div>}
                    {exp.description && <p className="creative-entry-desc">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </section>
          )}
          {cv.educations.length > 0 && (
            <section className="creative-main-section">
              <div className="creative-main-label">{t("tplEdu")}</div>
              {cv.educations.map((edu, i) => (
                <div key={edu.id} className="creative-entry">
                  <div className="creative-entry-num">{String(i+1).padStart(2,"0")}</div>
                  <div className="creative-entry-body">
                    <div className="creative-entry-top">
                      <strong>{edu.degree || "Diplôme"}</strong>
                      {edu.period && <span className="creative-entry-period">{edu.period}</span>}
                    </div>
                    {edu.school && <div className="creative-entry-company">{edu.school}</div>}
                    {edu.description && <p className="creative-entry-desc">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </section>
          )}
          {cv.projects && cv.projects.length > 0 && (
            <section className="creative-main-section">
              <div className="creative-main-label">{t("tplProjects")}</div>
              {cv.projects.map((p, i) => (
                <div key={p.id} className="creative-entry">
                  <div className="creative-entry-num">{String(i+1).padStart(2,"0")}</div>
                  <div className="creative-entry-body">
                    <div className="creative-entry-top">
                      <strong>{p.name}</strong>
                      {p.stack && <span className="creative-entry-period">{p.stack}</span>}
                    </div>
                    {p.description && <p className="creative-entry-desc">{p.description}</p>}
                    {p.url && <a className="proj-url" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
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
// TEMPLATE TIMELINE
// ────────────────────────────────────────────────────────────
function TimelineTemplate({ cv, t }) {
  return (
    <div className="tpl-timeline">
      <header className="tl2-header">
        {cv.photo && <img src={cv.photo} alt="Photo" className="tl2-photo" />}
        <h1 className="tl2-name">{cv.name || "Votre Nom"}</h1>
        <div className="tl2-title">{cv.title || "Titre Professionnel"}</div>
        <div className="tl2-contacts">
          {[cv.phone, cv.email, cv.location, cv.linkedin].filter(Boolean).map((c, i) => (
            <span key={i} className="tl2-contact-item">{c}</span>
          ))}
        </div>
        {cv.summary && <p className="tl2-summary">{cv.summary}</p>}
      </header>

      {(cv.skills.length > 0 || cv.languages.length > 0 || (cv.certifications && cv.certifications.length > 0)) && (
        <div className="tl2-tags-row">
          {cv.skills.map((s) => (
            <span key={s.id} className="tl2-tag tl2-tag-skill" style={{ opacity: 0.5+(s.level/5)*0.5 }}>{s.name}</span>
          ))}
          {cv.languages.map((l) => (
            <span key={l.id} className="tl2-tag tl2-tag-lang">{l.name} · {l.level}</span>
          ))}
          {cv.certifications && cv.certifications.map((c) => (
            <span key={c.id} className="tl2-tag tl2-tag-cert">🏆 {c.name}</span>
          ))}
        </div>
      )}

      <div className="tl2-body">
        {cv.experiences.length > 0 && (
          <div className="tl2-column">
            <div className="tl2-col-header"><span className="tl2-col-icon">💼</span> Expériences</div>
            <div className="tl2-track">
              {cv.experiences.map((exp) => (
                <div key={exp.id} className="tl2-node">
                  <div className="tl2-node-dot" />
                  <div className="tl2-node-card">
                    <div className="tl2-node-period">{exp.period}</div>
                    <div className="tl2-node-role">{exp.role || "Poste"}</div>
                    <div className="tl2-node-company">{exp.company}</div>
                    {exp.description && <p className="tl2-node-desc">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="tl2-column">
          {cv.educations.length > 0 && (
            <>
              <div className="tl2-col-header"><span className="tl2-col-icon">🎓</span> Formation</div>
              <div className="tl2-track">
                {cv.educations.map((edu) => (
                  <div key={edu.id} className="tl2-node">
                    <div className="tl2-node-dot" />
                    <div className="tl2-node-card">
                      <div className="tl2-node-period">{edu.period}</div>
                      <div className="tl2-node-role">{edu.degree || "Diplôme"}</div>
                      <div className="tl2-node-company">{edu.school}</div>
                      {edu.description && <p className="tl2-node-desc">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {cv.projects && cv.projects.length > 0 && (
            <>
              <div className="tl2-col-header" style={{marginTop:'16px'}}><span className="tl2-col-icon">🚀</span> Projets</div>
              <div className="tl2-track">
                {cv.projects.map((p) => (
                  <div key={p.id} className="tl2-node">
                    <div className="tl2-node-dot" />
                    <div className="tl2-node-card">
                      <div className="tl2-node-role">{p.name}</div>
                      {p.stack && <div className="tl2-node-company">{p.stack}</div>}
                      {p.description && <p className="tl2-node-desc">{p.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {cv.hobbies && cv.hobbies.length > 0 && (
        <div className="tl2-hobbies-strip">
          {cv.hobbies.map((h) => <span key={h.id} className="tl2-hobby">{h.name}</span>)}
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Composant principal
// ────────────────────────────────────────────────────────────
export default function CVPreview({ cvData, t: tProp }) {
  const t = tProp || ((k) => k)
  const templates = {
    classic:   <ClassicTemplate   cv={cvData} t={t} />,
    modern:    <ModernTemplate    cv={cvData} t={t} />,
    minimal:   <MinimalTemplate   cv={cvData} t={t} />,
    executive: <ExecutiveTemplate cv={cvData} t={t} />,
    creative:  <CreativeTemplate  cv={cvData} t={t} />,
    timeline:  <TimelineTemplate  cv={cvData} t={t} />,
  }
  return (
    <div id="cv-preview" className={`cv-paper template-${cvData.template}`}>
      {templates[cvData.template] || templates.classic}
    </div>
  )
}