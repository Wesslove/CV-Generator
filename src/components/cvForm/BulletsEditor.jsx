import React from "react"

export default function BulletsEditor({ bullets = [""], onChange, onCommit, placeholder, lang = "fr" }) {

  const handleBullet = (i, val) => {
    const next = [...bullets]
    next[i] = val
    onChange(next)
  }

  const addBullet = () => onChange([...bullets, ""])

  const removeBullet = (i) => {
    if (bullets.length === 1) return onChange([""])
    onChange(bullets.filter((_, idx) => idx !== i))
  }

  const handleKey = (e, i) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addBullet()
    }
    if (e.key === "Backspace" && bullets[i] === "" && bullets.length > 1) {
      e.preventDefault()
      removeBullet(i)
    }
  }

  return (
    <div className="bullets-editor">
      {bullets.map((b, i) => (
        <div key={i} className="bullet-row">
          <span className="bullet-dot">•</span>
          <input
            className="bullet-input"
            type="text"
            value={b}
            placeholder={placeholder}
            onChange={(e) => handleBullet(i, e.target.value)}
            onBlur={onCommit}
            onKeyDown={(e) => handleKey(e, i)}
          />
          {bullets.length > 1 && (
            <button className="bullet-remove" onClick={() => removeBullet(i)} tabIndex={-1}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      ))}
       // texte traduit selon la langue
        <button className="bullet-add" onClick={addBullet}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {lang === "en" ? "Add line" : "Ajouter une ligne"}
        </button>
    </div>
  )
}
