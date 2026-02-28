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
    // Ensure template-specific accent vars follow the chosen color (some templates
    // originally defined their own fixed palette, which prevented the color picker
    // from applying to them).  We overwrite those variables so that the accent
    // always propagates everywhere.
    document.documentElement.style.setProperty("--classic-accent", accent)
    document.documentElement.style.setProperty("--modern-accent", accent)
    document.documentElement.style.setProperty("--min-accent", accent)
    document.documentElement.style.setProperty("--exec-gold", accent)
    document.documentElement.style.setProperty("--impact", accent)
    // derive a few darker/lighter shades used by impact template
    document.documentElement.style.setProperty("--impact-dark", adjustHexColor(accent, -40))
    document.documentElement.style.setProperty("--impact-light", adjustHexColor(accent, 40))
    document.documentElement.style.setProperty("--impact-mid", adjustHexColor(accent, -20))
    // academique, startup rely on --accent or custom vars; ensure any still use accent
    document.documentElement.style.setProperty("--academique-accent", accent)
    document.documentElement.style.setProperty("--startup-accent", accent)

    // compute readable text color for update notice based on accent brightness
    const hex = accent.replace(/^#/, "")
    const num = parseInt(hex.length === 3 ? hex.split("").map(h=>h+h).join("") : hex, 16)
    const r = (num >> 16) & 0xff
    const g = (num >> 8) & 0xff
    const b = num & 0xff
    // relative luminance formula approximate
    const lum = 0.2126*r + 0.7152*g + 0.0722*b
    const textColor = lum > 128 ? "#000" : "#fff"
    document.documentElement.style.setProperty("--notice-text", textColor)

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