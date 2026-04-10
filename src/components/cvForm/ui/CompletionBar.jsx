/**
 * CompletionBar
 *
 * Affiche le score de completion (0-100) et
 * une liste courte d'actions manquantes.
 */
import React from "react"

export default function CompletionBar({ score, checks, label }) {
  const color = score < 40 ? "#ef4444" : score < 70 ? "#f59e0b" : "#22c55e"
  const missing = checks.filter((c) => !c.done)

  return (
    <div className="completion-widget">
      <div className="completion-header">
        <span className="completion-label">{label}</span>
        <span className="completion-pct" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="completion-track">
        <div className="completion-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      {missing.length > 0 && (
        <div className="completion-missing">
          {missing.slice(0, 3).map((c) => (
            <span key={c.key} className="completion-tip">
              + {c.label}
            </span>
          ))}
          {missing.length > 3 && <span className="completion-tip">+{missing.length - 3}</span>}
        </div>
      )}
    </div>
  )
}
