/**
 * useCvValidation
 * Rôle : valide les champs CV obligatoires et retourne les erreurs.
 */

import { useMemo, useState } from "react"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useCvValidation(cvData, t) {
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => {
    const errs = {}

    if (!cvData.name.trim()) {
      errs.name = t("errName")
    }

    if (!cvData.title.trim()) {
      errs.title = t("errTitle")
    }

    if (!cvData.email.trim()) {
      errs.email = t("errEmailRequired")
    } else if (!EMAIL_REGEX.test(cvData.email)) {
      errs.email = t("errEmail")
    }

    return errs
  }, [cvData, t])

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  const hasErrors = Object.keys(errors).length > 0

  return { errors, touched, handleBlur, hasErrors }
}
