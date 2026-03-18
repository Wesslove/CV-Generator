export const TEMPLATES = [
  "classic",
  "modern",
  "minimal",
  "executive",
  "creative",
  "timeline",
  "impact",
  "academique",
  "startup",
]

export const getFontOptions = (t) => ([
  { value: "classic", label: t("fontClassic"), hint: t("fontClassicHint") },
  { value: "modern", label: t("fontModern"), hint: t("fontModernHint") },
  { value: "elegant", label: t("fontElegant"), hint: t("fontElegantHint") },
  { value: "tech", label: t("fontTech"), hint: t("fontTechHint") },
])

export const getDensityOptions = (t) => ([
  { value: "compact", label: t("compact") },
  { value: "normal", label: t("normal") },
  { value: "airy", label: t("airy") },
])

export const getLangLevels = (t) => ([
  t("langNotions"),
  t("langSchool"),
  t("langFluent"),
  t("langBilingual"),
  t("langNative"),
])

export const getSkillLevels = (t) => ([
  t("notions"),
  t("beginner"),
  t("intermediate"),
  t("advanced"),
  t("expert"),
])
