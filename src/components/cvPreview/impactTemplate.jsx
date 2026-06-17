import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList } from "./shared.jsx"

// TEMPLATE IMPACT (rouge)
// ────────────────────────────────────────────────────────────
export function ImpactTemplate({ cv, t }) {
  const initials = cv.name
    ? cv.name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()
    : null

  const hasAside = cv.skills.length > 0 || cv.languages.length > 0
    || (cv.certifications && cv.certifications.length > 0)
    || (cv.hobbies && cv.hobbies.length > 0)

  return (
    <div className="tpl-impact">
      <header className="impact-header">
        <div className="impact-header-left">
          <div className="impact-name">{cv.name || "Votre Nom"}</div>
          <div className="impact-title">{cv.title || "Titre Professionnel"}</div>
          {cv.summary && <p className="impact-summary">{cv.summary}</p>}
        </div>
        <div className="impact-header-right">
          {cv.photo ? (
            <img src={cv.photo} alt="Photo" className="impact-photo" />
          ) : initials ? (
            <div className="impact-initials">{initials}</div>
          ) : (
            <div className="impact-initials impact-initials-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
          )}
        </div>
      </header>

      <div className="impact-contact-bar">
        {cv.phone         && <span className="impact-contact-item"><span className="impact-contact-icon">T</span>{cv.phone}</span>}
        {cv.email         && <span className="impact-contact-item"><span className="impact-contact-icon">@</span>{cv.email}</span>}
        {cv.location      && <span className="impact-contact-item"><span className="impact-contact-icon">L</span>{cv.location}</span>}
        {cv.linkedin      && <span className="impact-contact-item"><span className="impact-contact-icon">in</span>{cv.linkedin}</span>}
        {cv.birthDate     && <span className="impact-contact-item"><span className="impact-contact-icon">🎂</span>{cv.birthDate}{cv.birthPlace ? ` · ${cv.birthPlace}` : ""}</span>}
        {cv.maritalStatus && <span className="impact-contact-item"><span className="impact-contact-icon">💍</span>{cv.maritalStatus}</span>}
      </div>

      <div className="impact-body">
        <div className="impact-main">
          {cv.experiences.length > 0 && (
            <section className="impact-section">
              <div className="impact-section-title">
                <span className="impact-section-line" />
                {t("tplExp")}
              </div>
              {cv.experiences.map((exp) => (
                <div key={exp.id} className="impact-entry">
                  <div className="impact-entry-left">
                    <div className="impact-entry-period">{exp.period}</div>
                    <div className="impact-entry-dot" />
                  </div>
                  <div className="impact-entry-right">
                    <div className="impact-entry-role">{exp.role || "Poste"}</div>
                    <div className="impact-entry-company">{exp.company}</div>
                    <BulletsList item={exp} className="impact-entry-desc" />
                  </div>
                </div>
              ))}
            </section>
          )}
          {cv.educations.length > 0 && (
            <section className="impact-section">
              <div className="impact-section-title">
                <span className="impact-section-line" />
                {t("tplEdu")}
              </div>
              {cv.educations.map((edu) => (
                <div key={edu.id} className="impact-entry">
                  <div className="impact-entry-left">
                    <div className="impact-entry-period">{edu.period}</div>
                    <div className="impact-entry-dot" />
                  </div>
                  <div className="impact-entry-right">
                    <div className="impact-entry-role">{edu.degree || "Diplôme"}</div>
                    <div className="impact-entry-company">{edu.school}</div>
                    <BulletsList item={edu} className="impact-entry-desc" />
                  </div>
                </div>
              ))}
            </section>
          )}
          {cv.projects && cv.projects.length > 0 && (
            <section className="impact-section">
              <div className="impact-section-title">
                <span className="impact-section-line" />
                {t("tplProjects")}
              </div>
              {cv.projects.map((p) => (
                <div key={p.id} className="impact-entry">
                  <div className="impact-entry-left">
                    {p.stack && <div className="impact-entry-period">{p.stack}</div>}
                    <div className="impact-entry-dot" />
                  </div>
                  <div className="impact-entry-right">
                    <div className="impact-entry-role">{p.name}</div>
                    <BulletsList item={p} className="impact-entry-desc" />
                    {p.url && <a className="proj-url" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {hasAside && (
          <aside className="impact-aside">
            {cv.skills.length > 0 && (
              <div className="impact-aside-section">
                <div className="impact-aside-title">{t("tplSkills")}</div>
                {cv.skills.map((s) => (
                  <div key={s.id} className="impact-skill">
                    <div className="impact-skill-name">{s.name}</div>
                    <div className="impact-skill-track">
                      <div className="impact-skill-fill" style={{ width: `${(s.level/5)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {cv.languages.length > 0 && (
              <div className="impact-aside-section">
                <div className="impact-aside-title">{t("tplLangs")}</div>
                {cv.languages.map((l) => (
                  <div key={l.id} className="impact-lang">
                    <span>{l.name}</span>
                    <span className="impact-lang-level">{l.level}</span>
                  </div>
                ))}
              </div>
            )}
            {cv.certifications && cv.certifications.length > 0 && (
              <div className="impact-aside-section">
                <div className="impact-aside-title">{t("tplCerts")}</div>
                {cv.certifications.map((c) => (
                  <div key={c.id} className="impact-cert">
                    <div className="impact-cert-name">{c.name}</div>
                    <div className="impact-cert-meta">{c.issuer}{c.date ? ` · ${c.date}` : ""}</div>
                  </div>
                ))}
              </div>
            )}
            {cv.hobbies && cv.hobbies.length > 0 && (
              <div className="impact-aside-section">
                <div className="impact-aside-title">{t("tplHobbies")}</div>
                <div className="impact-hobbies">
                  {cv.hobbies.map((h) => (
                    <span key={h.id} className="impact-hobby">{h.name}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
