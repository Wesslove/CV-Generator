/**
 * RemoveBtn
 *
 * Petit bouton "supprimer" (icône croix) reutilisable
 * dans les cartes/items du formulaire.
 */
import React from "react"

export default function RemoveBtn({ onClick, title }) {
  return (
    <button className="btn-remove" onClick={onClick} title={title}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}
