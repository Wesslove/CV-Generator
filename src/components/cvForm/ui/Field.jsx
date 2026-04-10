/**
 * Field
 * Rôle : composant de champ unifie (input/textarea).
 * Entrées : label, valeur, handlers, mode et erreur de validation.
 * Sorties : UI de champ controlee.
 * Responsabilités :
 * - rendre la variante input ou textarea
 * - appliquer l'etat visuel d'erreur
 * - propager les evenements change/blur au parent
 */
import React from "react"

export default function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  textarea,
  rows,
  error,
}) {
  return (
    <div className="field-group">
      {label && <label className="field-label">{label}</label>}
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows || 3}
          className={"field-input field-textarea" + (error ? " error" : "")}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={"field-input" + (error ? " error" : "")}
        />
      )}
      {error && <div className="field-error">{error}</div>}
    </div>
  )
}
