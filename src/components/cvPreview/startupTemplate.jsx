import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList } from "./shared.jsx"

// TEMPLATE STARTUP
// ────────────────────────────────────────────────────────────
export function StartupTemplate({ cv, t }) {
  const initials = cv.name
    ? cv.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  return (
    <div className="tpl-startup">
      <div className="startup-header">
        <div className="startup-header-blob" />
        <div className="startup-header-content">
          <div className="startup-avatar">
            {cv.photo
              ? <img src={cv.photo} alt="Photo" className="startup-photo" />
              : <div className="startup-initials">{initials}</div>
            }
          </div>
          <div className="startup-identity">
            <h1 className="startup-name">{cv.name || "Votre Nom"}</h1>
            <div className="startup-title-badge">{cv.title || "Titre Professionnel"}</div>
            {cv.summary && <p className="startup-summary">{cv.summary}</p>}
          </div>
        </div>
        <div className="startup-contacts">
          {cv.phone         && <span className="startup-contact"><span className="startup-contact-icon">📞</span>{cv.phone}</span>}
          {cv.email         && <span className="startup-contact"><span className="startup-contact-icon">✉</span>{cv.email}</span>}
          {cv.location      && <span className="startup-contact"><span className="startup-contact-icon">📍</span>{cv.location}</span>}
          {cv.linkedin      && <span className="startup-contact"><span className="startup-contact-icon">🔗</span>{cv.linkedin}</span>}
          {cv.birthDate     && <span className="startup-contact"><span className="startup-contact-icon">🎂</span>{cv.birthDate}{cv.birthPlace ? ` · ${cv.birthPlace}` : ""}</span>}
          {cv.maritalStatus && <span className="startup-contact"><span className="startup-contact-icon">💍</span>{cv.maritalStatus}</span>}
        </div>
      </div>

      <div className="startup-body">
        <div className="startup-main">
          {cv.experiences.length > 0 && (
            <section className="startup-section">
              <div className="startup-section-header">
                <div className="startup-section-icon">💼</div>
                <h3 className="startup-section-title">{t("tplExp")}</h3>
              </div>
              {cv.experiences.map((exp) => (
                <div key={exp.id} className="startup-card">
                  <div className="startup-card-accent" />
                  <div className="startup-card-body">
                    <div className="startup-card-head">
                      <strong className="startup-card-role">{exp.role || "Poste"}</strong>
                      {exp.period && <span className="startup-card-period">{exp.period}</span>}
                    </div>
                    {exp.company && <div className="startup-card-company">{exp.company}</div>}
                    <BulletsList item={exp} className="startup-card-desc" />
                  </div>
                </div>
              ))}
            </section>
          )}
          {cv.educations.length > 0 && (
            <section className="startup-section">
              <div className="startup-section-header">
                <div className="startup-section-icon">🎓</div>
                <h3 className="startup-section-title">{t("tplEdu")}</h3>
              </div>
              {cv.educations.map((edu) => (
                <div key={edu.id} className="startup-card">
                  <div className="startup-card-accent" />
                  <div className="startup-card-body">
                    <div className="startup-card-head">
                      <strong className="startup-card-role">{edu.degree || "Diplôme"}</strong>
                      {edu.period && <span className="startup-card-period">{edu.period}</span>}
                    </div>
                    {edu.school && <div className="startup-card-company">{edu.school}</div>}
                    <BulletsList item={edu} className="startup-card-desc" />
                  </div>
                </div>
              ))}
            </section>
          )}
          {cv.projects && cv.projects.length > 0 && (
            <section className="startup-section">
              <div className="startup-section-header">
                <div className="startup-section-icon">🚀</div>
                <h3 className="startup-section-title">{t("tplProjects")}</h3>
              </div>
              {cv.projects.map((p) => (
                <div key={p.id} className="startup-card">
                  <div className="startup-card-accent" />
                  <div className="startup-card-body">
                    <div className="startup-card-head">
                      <strong className="startup-card-role">{p.name}</strong>
                      {p.stack && <span className="startup-stack-badge">{p.stack}</span>}
                    </div>
                    <BulletsList item={p} className="startup-card-desc" />
                    {p.url && <a className="startup-url" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>}
                  </div>
                </div>
              ))}
            </section>
          )}
          <CustomSectionsList sections={cv.customSections} titleClass="startup-section-title" />
        </div>

        <aside className="startup-aside">
          {cv.skills.length > 0 && (
            <div className="startup-aside-block">
              <div className="startup-aside-title"><span>⚡</span> {t("tplSkills")}</div>
              <div className="startup-skills-grid">
                {cv.skills.map((s) => (
                  <div key={s.id} className="startup-skill-chip" style={{ opacity: 0.5 + (s.level / 5) * 0.5 }}>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          {cv.languages.length > 0 && (
            <div className="startup-aside-block">
              <div className="startup-aside-title"><span>🌍</span> {t("tplLangs")}</div>
              {cv.languages.map((l) => (
                <div key={l.id} className="startup-lang-row">
                  <span className="startup-lang-name">{l.name}</span>
                  <span className="startup-lang-badge">{l.level}</span>
                </div>
              ))}
            </div>
          )}
          {cv.certifications && cv.certifications.length > 0 && (
            <div className="startup-aside-block">
              <div className="startup-aside-title"><span>🏆</span> {t("tplCerts")}</div>
              {cv.certifications.map((cert) => (
                <div key={cert.id} className="startup-cert">
                  <div className="startup-cert-name">{cert.name}</div>
                  <div className="startup-cert-meta">{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</div>
                </div>
              ))}
            </div>
          )}
          {cv.hobbies && cv.hobbies.length > 0 && (
            <div className="startup-aside-block">
              <div className="startup-aside-title"><span>🎯</span> {t("tplHobbies")}</div>
              <div className="startup-hobbies">
                {cv.hobbies.map((h) => (
                  <span key={h.id} className="startup-hobby">{h.name}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
