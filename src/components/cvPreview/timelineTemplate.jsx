import { BulletsList, CustomSectionsList, SkillBar, CertsList, ProjectsList } from "./shared.jsx"

// TEMPLATE TIMELINE
// ────────────────────────────────────────────────────────────
export function TimelineTemplate({ cv, t }) {
  return (
    <div className="tpl-timeline">
      <header className="tl2-header">
        {cv.photo && <img src={cv.photo} alt="Photo" className="tl2-photo" />}
        <h1 className="tl2-name">{cv.name || "Votre Nom"}</h1>
        <div className="tl2-title">{cv.title || "Titre Professionnel"}</div>
        <div className="tl2-contacts">
          {[
            cv.phone,
            cv.email,
            cv.location,
            cv.linkedin,
            cv.birthDate
              ? (cv.birthPlace ? `${cv.birthDate} · ${cv.birthPlace}` : cv.birthDate)
              : null,
            cv.maritalStatus,
          ].filter(Boolean).map((c, i) => (
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
            <div className="tl2-col-header"><span className="tl2-col-icon">💼</span> {t("tplExp")}</div>
            <div className="tl2-track">
              {cv.experiences.map((exp) => (
                <div key={exp.id} className="tl2-node">
                  <div className="tl2-node-dot" />
                  <div className="tl2-node-card">
                    <div className="tl2-node-period">{exp.period}</div>
                    <div className="tl2-node-role">{exp.role || "Poste"}</div>
                    <div className="tl2-node-company">{exp.company}</div>
                    <BulletsList item={exp} className="tl2-node-desc" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="tl2-column">
          {cv.educations.length > 0 && (
            <>
              <div className="tl2-col-header"><span className="tl2-col-icon">🎓</span> {t("tplEdu")}</div>
              <div className="tl2-track">
                {cv.educations.map((edu) => (
                  <div key={edu.id} className="tl2-node">
                    <div className="tl2-node-dot" />
                    <div className="tl2-node-card">
                      <div className="tl2-node-period">{edu.period}</div>
                      <div className="tl2-node-role">{edu.degree || "Diplôme"}</div>
                      <div className="tl2-node-company">{edu.school}</div>
                      <BulletsList item={edu} className="tl2-node-desc" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {cv.projects && cv.projects.length > 0 && (
            <>
              <div className="tl2-col-header" style={{marginTop:'16px'}}><span className="tl2-col-icon">🚀</span> {t("tplProjects")}</div>
              <div className="tl2-track">
                {cv.projects.map((p) => (
                  <div key={p.id} className="tl2-node">
                    <div className="tl2-node-dot" />
                    <div className="tl2-node-card">
                      <div className="tl2-node-role">{p.name}</div>
                      {p.stack && <div className="tl2-node-company">{p.stack}</div>}
                      <BulletsList item={p} className="tl2-node-desc" />
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
