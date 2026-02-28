// ─────────────────────────────────────────────────────────────
// hooks/useCompletion.js
// Calcule le score de complétion du CV (0–100%).
// Séparé pour être facile à modifier : ajouter/supprimer
// un critère ne touche qu'à ce fichier.
// ─────────────────────────────────────────────────────────────

import { useMemo } from "react"

/**
 * @param {object}   cvData - Les données du CV
 * @param {function} t      - Fonction de traduction
 * @returns {{ score: number, checks: Array }}
 *
 * checks = [{ key, label, done }]
 */
export function useCompletion(cvData, t) {
  return useMemo(() => {
    const checks = [
      {
        key:   "name",
        label: t("fullName").replace(" *", ""),
        done:  !!cvData.name.trim(),
      },
      {
        key:   "title",
        label: t("jobTitle").replace(" *", ""),
        done:  !!cvData.title.trim(),
      },
      {
        key:   "phone",
        label: t("phone"),
        done:  !!cvData.phone.trim(),
      },
      {
        key:   "location",
        label: t("location"),
        done:  !!cvData.location.trim(),
      },
      {
        key:   "summary",
        label: t("summary"),
        done:  !!cvData.summary.trim(),
      },
      {
        key:   "photo",
        label: t("addPhoto"),
        done:  !!cvData.photo,
      },
      {
        key:   "exp",
        label: t("experiences"),
        done:  cvData.experiences.length > 0,
      },
      {
        key:   "edu",
        label: t("educations"),
        done:  cvData.educations.length > 0,
      },
      {
        key:   "skills",
        label: t("skills"),
        done:  cvData.skills.length >= 2,
      },
    ]

    const doneCount = checks.filter((c) => c.done).length
    const score     = Math.round((doneCount / checks.length) * 100)

    return { score, checks }
  }, [cvData, t])
}