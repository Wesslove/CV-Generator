/**
 * Accordion
 * Rôle : conteneur de section repliable reutilisable.
 * Entrées : flag open, callback toggle, titre et children.
 * Sorties : UI de section ouverte/repliee.
 * Responsabilités :
 * - rendre l'en-tete de section/fleche
 * - basculer la visibilite du corps de section
 * - heberger le contenu formulaire imbrique
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
