/**
 * Accordion
 *
 * Section repliable reutilisable pour le formulaire.
 * Props:
 * - open: boolean
 * - onToggle: function
 * - title: string
 * - children: contenu JSX
 */
import React from "react"

export default function Accordion({ open, onToggle, title, children }) {
  return (
    <div className={`accordion ${open ? "open" : ""}`}>
      <button className="accordion-trigger" onClick={onToggle}>
        <span>{title}</span>
        <span className="accordion-arrow">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  )
}
