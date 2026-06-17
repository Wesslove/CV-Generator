import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList } from "./shared.jsx"

// TEMPLATE MINIMAL
// ────────────────────────────────────────────────────────────
export function MinimalTemplate({ cv, t }) {
  return (
    <div className="tpl-minimal">
      <header className="min-header">
        {cv.photo && <img src={cv.photo} alt="Photo" className="min-photo" />}
        <div>
          <h1>{cv.name || "Votre Nom"}</h1>
          <p className="min-title">{cv.title || "Titre Professionnel"}</p>
          <div className="min-contacts">
            {[
              cv.phone,
              cv.email,
              cv.location,
              cv.linkedin,
              cv.birthDate
                ? (cv.birthPlace ? `${cv.birthDate} · ${cv.birthPlace}` : cv.birthDate)
                : null,
              cv.maritalStatus,
            ].filter(Boolean).join(" · ")}
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
                  <BulletsList item={exp} />
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
                  <BulletsList item={edu} />
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
          <CustomSectionsList sections={cv.customSections} titleClass="min-section" />
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
