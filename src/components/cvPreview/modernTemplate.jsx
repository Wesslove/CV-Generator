import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList, getSkillLabel } from "./shared.jsx"

// TEMPLATE MODERN
// ────────────────────────────────────────────────────────────
export function ModernTemplate({ cv, t }) {
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
            {cv.phone         && <span>{cv.phone}</span>}
            {cv.email         && <span>{cv.email}</span>}
            {cv.location      && <span>{cv.location}</span>}
            {cv.linkedin      && <span>{cv.linkedin}</span>}
            {cv.birthDate     && <span>{cv.birthDate}{cv.birthPlace ? ` — ${cv.birthPlace}` : ""}</span>}
            {cv.maritalStatus && <span>{cv.maritalStatus}</span>}
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
                <h3 className="modern-section-title"><span className="msec-icon">⚡</span> {t("tplSkills")}</h3>
                {cv.skills.map((s) => (
                  <div key={s.id} className="modern-skill">
                    <div className="modern-skill-label">
                      <span>{s.name}</span>
                      <span className="skill-pct">{getSkillLabel(s.level, t)}</span>
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
                <h3 className="modern-section-title"><span className="msec-icon">🌍</span> {t("tplLangs")}</h3>
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
                <h3 className="modern-section-title"><span className="msec-icon">🏆</span> {t("tplCerts")}</h3>
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
                <h3 className="modern-section-title"><span className="msec-icon">🎯</span> {t("tplHobbies")}</h3>
                <ul className="hobbies-list">{cv.hobbies.map((h) => <li key={h.id}>{h.name}</li>)}</ul>
              </section>
            )}
          </div>

          <div className="modern-right">
            {cv.experiences.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title"><span className="msec-icon">💼</span> {t("tplExp")}</h3>
                {cv.experiences.map((exp) => (
                  <div key={exp.id} className="modern-entry">
                    <div className="modern-entry-header">
                      <span className="entry-role">{exp.role || "Poste"}</span>
                      <span className="entry-period">{exp.period}</span>
                    </div>
                    <div className="entry-company">{exp.company}</div>
                    <BulletsList item={exp} className="entry-desc" />
                  </div>
                ))}
              </section>
            )}
            {cv.educations.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title"><span className="msec-icon">🎓</span> {t("tplEdu")}</h3>
                {cv.educations.map((edu) => (
                  <div key={edu.id} className="modern-entry">
                    <div className="modern-entry-header">
                      <span className="entry-role">{edu.degree || "Diplôme"}</span>
                      <span className="entry-period">{edu.period}</span>
                    </div>
                    <div className="entry-company">{edu.school}</div>
                    <BulletsList item={edu} className="entry-desc" />
                  </div>
                ))}
              </section>
            )}
            {cv.projects && cv.projects.length > 0 && (
              <section className="modern-section">
                <h3 className="modern-section-title"><span className="msec-icon">🚀</span> {t("tplProjects")}</h3>
                {cv.projects.map((p) => (
                  <div key={p.id} className="proj-item">
                    <div className="proj-top"><strong>{p.name}</strong>{p.stack && <span className="proj-stack">{p.stack}</span>}</div>
                    <BulletsList item={p} className="proj-desc" />
                    {p.url && <a className="proj-url" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
                  </div>
                ))}
              </section>
            )}
            <CustomSectionsList sections={cv.customSections} titleClass="modern-section-title" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
