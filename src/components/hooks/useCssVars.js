// ─────────────────────────────────────────────────────────────
// hooks/useCssVars.js
// Applique les préférences visuelles (couleur, police, densité,
// thème) comme variables CSS sur :root et classes sur <body>.
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react"
import { FONT_OPTIONS, DENSITY_OPTIONS } from "../../constants"

/**
 * Assombrit ou éclaircit une couleur hexadécimale.
 * @param {string} hex   - Ex: "#2563eb"
 * @param {number} amt   - Positif = plus clair, négatif = plus sombre
 * @returns {string}     - Nouvelle couleur hex
 */
function adjustHexColor(hex, amt) {
  let col = hex.replace(/^#/, "")
  if (col.length === 3) {
    col = col.split("").map((c) => c + c).join("")
  }
  const num = parseInt(col, 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt))
  const b = Math.max(0, Math.min(255, (num & 0xff) + amt))
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")
}

/**
 * @param {object} settings - cvData.settings
 */
export function useCssVars(settings) {
  useEffect(() => {
    const { accent = "#2563eb", font = "classic", density = "normal", theme = "light" } = settings

    // ── Couleur d'accent ──────────────────────────────────────
    document.documentElement.style.setProperty("--accent", accent)
    document.documentElement.style.setProperty("--accent-hover", adjustHexColor(accent, -20))
    document.documentElement.style.setProperty("--classic-border", accent)
    document.documentElement.style.setProperty("--sidebar-accent", accent)

    // ── Police ────────────────────────────────────────────────
    const fontOption = FONT_OPTIONS.find((f) => f.value === font) ?? FONT_OPTIONS[0]
    document.documentElement.style.setProperty("--font-heading", fontOption.heading)
    document.documentElement.style.setProperty("--font-body",    fontOption.body)

    // ── Densité ───────────────────────────────────────────────
    const densityOption = DENSITY_OPTIONS.find((d) => d.value === density) ?? DENSITY_OPTIONS[1]
    document.documentElement.style.setProperty("--cv-base-size", densityOption.size)

    // ── Thème sombre ──────────────────────────────────────────
    if (theme === "dark") {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [settings])
}