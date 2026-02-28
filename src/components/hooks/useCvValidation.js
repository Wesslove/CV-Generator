// ─────────────────────────────────────────────────────────────
// hooks/useCvValidation.js
// Validation des champs obligatoires du CV.
// Séparé de App.jsx pour être facile à modifier ou étendre.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"

// Regex basique de validation d'email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Valide les champs du CV et retourne les erreurs actives.
 *
 * @param {object} cvData   - Les données du CV
 * @param {function} t      - Fonction de traduction
 * @returns {{ errors, touched, handleBlur }}
 */
export function useCvValidation(cvData, t) {
  // touched : quels champs ont déjà été touchés par l'utilisateur
  const [touched, setTouched] = useState({})
  const [errors, setErrors]   = useState({})

  // Revalide à chaque changement de cvData ou de champ touché
  useEffect(() => {
    const errs = {}

    // Nom obligatoire
    if (!cvData.name.trim()) {
      errs.name = t("errName")
    }

    // Titre obligatoire
    if (!cvData.title.trim()) {
      errs.title = t("errTitle")
    }

    // Email : validé seulement si l'utilisateur l'a touché
    // et qu'il n'est pas vide
    if (
      touched.email &&
      cvData.email.trim() &&
      !EMAIL_REGEX.test(cvData.email)
    ) {
      errs.email = t("errEmail")
    }

    setErrors(errs)
  }, [cvData, touched, t])

  // Marque un champ comme "touché" quand l'utilisateur le quitte
  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  const hasErrors = Object.keys(errors).length > 0

  return { errors, touched, handleBlur, hasErrors }
}