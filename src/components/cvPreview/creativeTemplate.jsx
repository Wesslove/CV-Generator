import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList } from "./shared.jsx"

// TEMPLATE CREATIVE
// ────────────────────────────────────────────────────────────
export function CreativeTemplate({ cv, t }) {
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
              {cv.phone         && <span className="creative-chip">📞 {cv.phone}</span>}
              {cv.email         && <span className="creative-chip">✉ {cv.email}</span>}
              {cv.location      && <span className="creative-chip">📍 {cv.location}</span>}
              {cv.linkedin      && <span className="creative-chip">🔗 {cv.linkedin}</span>}
              {cv.birthDate     && <span className="creative-chip">🎂 {cv.birthDate}{cv.birthPlace ? ` · ${cv.birthPlace}` : ""}</span>}
              {cv.maritalStatus && <span className="creative-chip">💍 {cv.maritalStatus}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="creative-body">
        <aside className="creative-aside">
          {cv.skills.length > 0 && (
            <section className="creative-section">
              <div className="creative-sec-label">{t("tplSkills")}</div>
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
              <div className="creative-main-label">{t("tplProfile")}</div>
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
                    <BulletsList item={exp} className="creative-entry-desc" />
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
                    <BulletsList item={edu} className="creative-entry-desc" />
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
                    <BulletsList item={p} className="creative-entry-desc" />
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
