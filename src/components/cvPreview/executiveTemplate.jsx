import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList } from "./shared.jsx"

// TEMPLATE EXECUTIVE
// ────────────────────────────────────────────────────────────
export function ExecutiveTemplate({ cv, t }) {
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
          {cv.phone         && <div className="exec-contact-item">📞 {cv.phone}</div>}
          {cv.email         && <div className="exec-contact-item">✉ {cv.email}</div>}
          {cv.location      && <div className="exec-contact-item">📍 {cv.location}</div>}
          {cv.linkedin      && <div className="exec-contact-item">🔗 {cv.linkedin}</div>}
          {cv.birthDate     && <div className="exec-contact-item">🎂 {cv.birthDate}{cv.birthPlace ? ` — ${cv.birthPlace}` : ""}</div>}
          {cv.maritalStatus && <div className="exec-contact-item">💍 {cv.maritalStatus}</div>}
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
                  <BulletsList item={exp} className="exec-entry-desc" />
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
                  <BulletsList item={edu} className="exec-entry-desc" />
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
                  <BulletsList item={p} className="exec-entry-desc" />
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
