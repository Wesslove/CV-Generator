import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList } from "./shared.jsx"

// TEMPLATE ACADÉMIQUE
// ────────────────────────────────────────────────────────────
export function AcademiqueTemplate({ cv, t }) {
  return (
    <div className="tpl-academique">
      <header className="acad-header">
        <div className="acad-header-inner">
          {cv.photo && <img src={cv.photo} alt="Photo" className="acad-photo" />}
          <h1 className="acad-name">{cv.name || "Votre Nom"}</h1>
          <div className="acad-title">{cv.title || "Titre Professionnel"}</div>
          <div className="acad-contacts">
            {[
              cv.phone,
              cv.email,
              cv.location,
              cv.linkedin,
              cv.birthDate
                ? (cv.birthPlace ? `${cv.birthDate} · ${cv.birthPlace}` : cv.birthDate)
                : null,
              cv.maritalStatus,
            ].filter(Boolean).map((info, i) => (
              <span key={i} className="acad-contact">{info}</span>
            ))}
          </div>
        </div>
        <div className="acad-rule" />
      </header>

      <div className="acad-body">
        {cv.summary && (
          <section className="acad-section">
            <h2 className="acad-section-title">{t("tplProfile")}</h2>
            <div className="acad-rule-thin" />
            <p className="acad-summary">{cv.summary}</p>
          </section>
        )}
        {cv.experiences.length > 0 && (
          <section className="acad-section">
            <h2 className="acad-section-title">{t("tplExp")}</h2>
            <div className="acad-rule-thin" />
            {cv.experiences.map((exp) => (
              <div key={exp.id} className="acad-entry">
                <div className="acad-entry-head">
                  <div>
                    <span className="acad-entry-role">{exp.role || "Poste"}</span>
                    {exp.company && <span className="acad-entry-company">, {exp.company}</span>}
                  </div>
                  {exp.period && <span className="acad-entry-period">{exp.period}</span>}
                </div>
                <BulletsList item={exp} className="acad-desc" />
              </div>
            ))}
          </section>
        )}
        {cv.educations.length > 0 && (
          <section className="acad-section">
            <h2 className="acad-section-title">{t("tplEdu")}</h2>
            <div className="acad-rule-thin" />
            {cv.educations.map((edu) => (
              <div key={edu.id} className="acad-entry">
                <div className="acad-entry-head">
                  <div>
                    <span className="acad-entry-role">{edu.degree || "Diplôme"}</span>
                    {edu.school && <span className="acad-entry-company">, {edu.school}</span>}
                  </div>
                  {edu.period && <span className="acad-entry-period">{edu.period}</span>}
                </div>
                <BulletsList item={edu} className="acad-desc" />
              </div>
            ))}
          </section>
        )}
        {cv.certifications && cv.certifications.length > 0 && (
          <section className="acad-section">
            <h2 className="acad-section-title">{t("tplCerts")}</h2>
            <div className="acad-rule-thin" />
            {cv.certifications.map((cert) => (
              <div key={cert.id} className="acad-entry">
                <div className="acad-entry-head">
                  <span className="acad-entry-role">{cert.name}</span>
                  {cert.date && <span className="acad-entry-period">{cert.date}</span>}
                </div>
                {cert.issuer && <div className="acad-desc">{cert.issuer}</div>}
              </div>
            ))}
          </section>
        )}
        {cv.projects && cv.projects.length > 0 && (
          <section className="acad-section">
            <h2 className="acad-section-title">{t("tplProjects")}</h2>
            <div className="acad-rule-thin" />
            {cv.projects.map((p) => (
              <div key={p.id} className="acad-entry">
                <div className="acad-entry-head">
                  <span className="acad-entry-role">{p.name}</span>
                  {p.stack && <span className="acad-entry-period">{p.stack}</span>}
                </div>
                <BulletsList item={p} className="acad-desc" />
              </div>
            ))}
          </section>
        )}
        <div className="acad-two-col">
          {cv.skills.length > 0 && (
            <section className="acad-section">
              <h2 className="acad-section-title">{t("tplSkills")}</h2>
              <div className="acad-rule-thin" />
              {cv.skills.map((s) => (
                <div key={s.id} className="acad-skill">
                  <span className="acad-skill-name">{s.name}</span>
                  <span className="acad-skill-level">{["",(t("notions")||"Notions"),(t("beginner")||"Débutant"),(t("intermediate")||"Intermédiaire"),(t("advanced")||"Avancé"),(t("expert")||"Expert")][s.level]}</span>
                </div>
              ))}
            </section>
          )}
          {cv.languages.length > 0 && (
            <section className="acad-section">
              <h2 className="acad-section-title">{t("tplLangs")}</h2>
              <div className="acad-rule-thin" />
              {cv.languages.map((l) => (
                <div key={l.id} className="acad-skill">
                  <span className="acad-skill-name">{l.name}</span>
                  <span className="acad-skill-level">{l.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>
        {cv.hobbies && cv.hobbies.length > 0 && (
          <section className="acad-section">
            <h2 className="acad-section-title">{t("tplHobbies")}</h2>
            <div className="acad-rule-thin" />
            <p className="acad-desc">{cv.hobbies.map(h => h.name).filter(Boolean).join(" · ")}</p>
          </section>
        )}
        <CustomSectionsList sections={cv.customSections} titleClass="acad-section-title" />
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
