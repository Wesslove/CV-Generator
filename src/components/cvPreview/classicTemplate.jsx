import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList } from "./shared.jsx"

// TEMPLATE CLASSIC
// ────────────────────────────────────────────────────────────
export function ClassicTemplate({ cv, t }) {
  return (
    <div className="tpl-classic">
      <header className="classic-header">
        {cv.photo && <img src={cv.photo} alt="Photo" className="classic-photo" />}
        <div className="classic-identity">
          <h1>{cv.name || "Votre Nom"}</h1>
          <h2>{cv.title || "Titre Professionnel"}</h2>
          <div className="classic-contacts">
            {cv.phone         && <span>📞 {cv.phone}</span>}
            {cv.email         && <span>✉ {cv.email}</span>}
            {cv.location      && <span>📍 {cv.location}</span>}
            {cv.linkedin      && <span>🔗 {cv.linkedin}</span>}
            {cv.birthDate     && <span>🎂 {cv.birthDate}{cv.birthPlace ? ` — ${cv.birthPlace}` : ""}</span>}
            {cv.maritalStatus && <span>💍 {cv.maritalStatus}</span>}
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
            <CertsList certs={cv.certifications} titleClass="classic-section-title" t={t} />
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
                    <BulletsList item={exp} className="tl-desc" />
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
                    <BulletsList item={edu} className="tl-desc" />
                  </div>
                </div>
              ))}
            </section>
          )}
          {cv.projects && cv.projects.length > 0 && (
            <ProjectsList projects={cv.projects} titleClass="classic-section-title main-title" t={t} />
          )}
          <CustomSectionsList sections={cv.customSections} titleClass="classic-section-title main-title" />
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
