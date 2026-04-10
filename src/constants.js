/**
 * constants
 * Rôle : centralise la configuration statique, les libelles i18n et les donnees initiales du CV.
 * Entrées : fonction de traduction `t` pour les getters utilitaires.
 * Sorties : constantes exportees et fonctions utilitaires.
 * Responsabilités :
 * - exposer templates/options/niveaux
 * - fournir les donnees par defaut et la version
 * - stocker les dictionnaires de traduction
 */

// ── Templates ─────────────────────────────────────────────────
// Format objet pour que App.jsx puisse utiliser tpl.id et tpl.label
export const TEMPLATES = [
  { id: "classic",    label: "Classic" },
  { id: "modern",     label: "Modern" },
  { id: "minimal",    label: "Minimal" },
  { id: "executive",  label: "Executive" },
  { id: "creative",   label: "Creative" },
  { id: "timeline",   label: "Timeline" },
  { id: "impact",     label: "Impact" },
  { id: "academique", label: "Académique" },
  { id: "startup",    label: "Startup" },
]

// ── Options de polices ────────────────────────────────────────
export const FONT_OPTIONS = [
  {
    value:   "classic",
    heading: "'Playfair Display', serif",
    body:    "'Source Sans 3', sans-serif",
  },
  {
    value:   "modern",
    heading: "'Inter', sans-serif",
    body:    "'Inter', sans-serif",
  },
  {
    value:   "elegant",
    heading: "'Cormorant Garamond', serif",
    body:    "'Lato', sans-serif",
  },
  {
    value:   "tech",
    heading: "'Space Grotesk', sans-serif",
    body:    "'DM Sans', sans-serif",
  },
]

export const getFontOptions = (t) => FONT_OPTIONS.map(f => ({
  ...f,
  label: t(`font${f.value.charAt(0).toUpperCase() + f.value.slice(1)}`),
  hint:  t(`font${f.value.charAt(0).toUpperCase() + f.value.slice(1)}Hint`),
}))

// ── Options de densité ────────────────────────────────────────
export const DENSITY_OPTIONS = [
  { value: "compact", size: "13px" },
  { value: "normal",  size: "14px" },
  { value: "airy",    size: "15px" },
]

export const getDensityOptions = (t) => DENSITY_OPTIONS.map(d => ({
  ...d,
  label: t(d.value),
}))

// ── Niveaux langue / compétence ───────────────────────────────
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

// ── Version de l'app ──────────────────────────────────────────
export const APP_VERSION = "2.0.0"
export const CV_SCHEMA_VERSION = 2

export const STYLE_PRESETS = [
  { id: "pro-navy", labelKey: "presetProNavy", accent: "#1e3a5f", font: "classic", density: "normal" },
  { id: "modern-blue", labelKey: "presetModernBlue", accent: "#2563eb", font: "modern", density: "normal" },
  { id: "compact-tech", labelKey: "presetCompactTech", accent: "#0f766e", font: "tech", density: "compact" },
]

// ── État initial du CV ────────────────────────────────────────
// accent : #1e3a5f = bleu marine professionnel (défaut)
export const INITIAL_CV = {
  template: "classic",
  name:     "",
  title:    "",
  phone:    "",
  email:    "",
  location: "",
  linkedin: "",
  birthDate:    "",
  birthPlace:   "",
  maritalStatus: "",
  summary:  "",
  photo:    null,
  experiences:   [],
  educations:    [],
  certifications:[],
  projects:      [],
  skills:        [],
  languages:     [],
  hobbies:       [],
  customSections:[],
  settings: {
    accent:   "#1e3a5f",
    font:     "classic",
    density:  "normal",
    language: "fr",
    theme:    "light",
    multiPage: false,
  },
}

export function normalizeCvData(raw = {}) {
  return {
    ...INITIAL_CV,
    ...raw,
    settings: {
      ...INITIAL_CV.settings,
      ...(raw.settings || {}),
    },
  }
}

export function migrateCvData(payload) {
  const hasEnvelope = payload && typeof payload === "object" && "data" in payload
  const schemaVersion = hasEnvelope ? (payload.schemaVersion || 1) : 1
  let data = hasEnvelope ? payload.data : payload
  data = normalizeCvData(data)

  if (schemaVersion < 2) {
    data = {
      ...data,
      settings: {
        ...data.settings,
        multiPage: data.settings.multiPage ?? false,
      },
    }
  }

  return normalizeCvData(data)
}

// ── Traductions ───────────────────────────────────────────────
export const I18N = {
  fr: {
    // Navigation / UI
    template:       "Modèles",
    edit:           "Éditer",
    preview:        "Aperçu",
    undo:           "Annuler",
    downloadPdf:    "Télécharger PDF",
    export:         "Exporter",
    import:         "Importer",
    livePreview:    "Aperçu en direct",
    zoomIn:         "Zoom +",
    zoomOut:        "Zoom −",
    zoomReset:      "Réinitialiser zoom",
    saveSaving:     "Enregistrement...",
    saveSaved:      "Sauvegardé",
    saveError:      "Erreur sauvegarde",
    updateDone:     "Mise à jour effectuée",
    newFeature:     "Nouvelle fonctionnalité disponible",
    importPhotoWarning: "⚠ La photo n'est pas exportée dans le JSON. Rechargez-la après import.",
    importError:    "Fichier JSON invalide.",

    // Formulaire
    formTitle:      "Informations du CV",
    completion:     "Complétion du CV",
    appearance:     "Apparence",
    stylePresets:   "Presets de style",
    multiPageMode:  "Mode multi-page (contenus longs)",
    mainColor:      "Couleur principale",
    font:           "Police",
    density:        "Densité du texte",
    interfaceLang:  "Langue de l'interface",

    // Polices
    fontClassic:     "Classique",
    fontClassicHint: "Playfair + Source Sans",
    fontModern:      "Moderne",
    fontModernHint:  "Inter + Inter",
    fontElegant:     "Élégant",
    fontElegantHint: "Cormorant + Lato",
    fontTech:        "Tech",
    fontTechHint:    "Space Grotesk + DM Sans",
    presetProNavy:   "Pro Marine",
    presetModernBlue:"Moderne Bleu",
    presetCompactTech:"Tech Compact",

    // Densité
    compact: "Compact",
    normal:  "Normal",
    airy:    "Aéré",

    // Sections
    personal:       "Informations personnelles",
    experiences:    "Expériences",
    educations:     "Formation",
    certifications: "Certifications",
    projects:       "Projets",
    skills:         "Compétences",
    languages:      "Langues",
    hobbies:        "Loisirs",
    customSections: "Sections personnalisées",

    // Champs
    fullName:      "Nom complet *",
    jobTitle:      "Titre professionnel *",
    phone:         "Téléphone",
    email:         "Email",
    location:      "Ville / Pays",
    linkedin:      "LinkedIn / Site web",
    birthDate:     "Date de naissance",
    birthPlace:    "Lieu de naissance",
    maritalStatus: "Situation matrimoniale",
    summary:       "Résumé professionnel",
    addPhoto:      "Ajouter une photo",
    company:       "Entreprise",
    role:          "Poste",
    period:        "Période",
    description:   "Description",
    descOptional:  "Description (optionnel)",
    school:        "Établissement",
    degree:        "Diplôme",
    certName:      "Nom de la certification",
    issuer:        "Organisme",
    date:          "Date",
    link:          "Lien",
    projectName:   "Nom du projet",
    stack:         "Technologies",

    // Placeholders
    phName:        "Jean Dupont",
    phTitle:       "Développeur Web Senior",
    phPhone:       "+33 6 00 00 00 00",
    phEmail:       "jean@exemple.com",
    phLocation:    "Paris, France",
    phLinkedin:    "linkedin.com/in/jean",
    phBirthDate:   "01/01/1990",
    phBirthPlace:  "Paris, France",
    phMaritalStatus: "Célibataire",
    phSummary:     "Décrivez votre profil en 2-3 phrases...",
    phCompany:     "Acme Corp",
    phRole:         "Développeur Frontend",
    phPeriod:      "Jan 2022 – Présent",
    phSchool:      "Université Paris-Saclay",
    phDegree:      "Master Informatique",
    phEduPeriod:   "2018 – 2020",
    phEduDesc:     "Mention très bien...",
    phCertName:    "AWS Solutions Architect",
    phIssuer:      "Amazon Web Services",
    phDate:        "2023",
    phLink:        "https://...",
    phProjectName: "Mon Application",
    phStack:       "React, Node.js, PostgreSQL",
    phProjectDesc: "Description du projet...",
    phUrl:         "https://github.com/...",
    phSkill:       "Ex : JavaScript",
    phLang:        "Ex : Anglais",
    phBullet:      "Décrivez une réalisation...",
    phCustomTitle: "Titre de la section",

    // Actions
    add:              "Ajouter",
    duplicate:        "Dupliquer",
    addSkill:         "Ajouter une compétence",
    addLang:          "Ajouter une langue",
    remove:           "Supprimer",
    addCustomSection: "Ajouter une section",
    addCustomItem:    "Ajouter un élément",

    // Messages vides
    noExp:    "Aucune expérience ajoutée.",
    noEdu:    "Aucune formation ajoutée.",
    noCert:   "Aucune certification ajoutée.",
    noProj:   "Aucun projet ajouté.",
    noSkill:  "Aucune compétence ajoutée.",
    noLang:   "Aucune langue ajoutée.",
    noHobby:  "Aucun loisir ajouté.",

    // Validation
    errName:  "Le nom est requis.",
    errTitle: "Le titre est requis.",
    errEmail: "Email invalide.",

    // Templates CV (labels internes)
    tplProfile:  "Profil",
    tplExp:      "Expériences",
    tplExpPro:   "Expérience Professionnelle",
    tplEdu:      "Formation",
    tplSkills:   "Compétences",
    tplLangs:    "Langues",
    tplCerts:    "Certifications",
    tplProjects: "Projets",
    tplHobbies:  "Loisirs",
    tplContact:  "Contact",

    // Niveaux compétence
    notions:      "Notions",
    beginner:     "Débutant",
    intermediate: "Intermédiaire",
    advanced:     "Avancé",
    expert:       "Expert",

    // Niveaux langue
    langNotions:   "Notions",
    langSchool:    "Scolaire",
    langFluent:    "Courant",
    langBilingual: "Bilingue",
    langNative:    "Natif",
  },

  en: {
    template:       "Templates",
    edit:           "Edit",
    preview:        "Preview",
    undo:           "Undo",
    downloadPdf:    "Download PDF",
    export:         "Export",
    import:         "Import",
    livePreview:    "Live Preview",
    zoomIn:         "Zoom in",
    zoomOut:        "Zoom out",
    zoomReset:      "Reset zoom",
    saveSaving:     "Saving...",
    saveSaved:      "Saved",
    saveError:      "Save error",
    updateDone:     "Update applied",
    newFeature:     "New feature available",
    importPhotoWarning: "⚠ Photo is not saved in JSON. Please re-upload after import.",
    importError:    "Invalid JSON file.",
    formTitle:      "CV Information",
    completion:     "CV Completion",
    appearance:     "Appearance",
    stylePresets:   "Style presets",
    multiPageMode:  "Multi-page mode (long content)",
    mainColor:      "Primary color",
    font:           "Font",
    density:        "Text density",
    interfaceLang:  "Interface language",
    fontClassic:    "Classic",
    fontClassicHint:"Playfair + Source Sans",
    fontModern:     "Modern",
    fontModernHint: "Inter + Inter",
    fontElegant:    "Elegant",
    fontElegantHint:"Cormorant + Lato",
    fontTech:       "Tech",
    fontTechHint:   "Space Grotesk + DM Sans",
    presetProNavy:   "Pro Navy",
    presetModernBlue:"Modern Blue",
    presetCompactTech:"Tech Compact",
    compact: "Compact",
    normal:  "Normal",
    airy:    "Airy",
    personal:       "Personal Information",
    experiences:    "Experience",
    educations:     "Education",
    certifications: "Certifications",
    projects:       "Projects",
    skills:         "Skills",
    languages:      "Languages",
    hobbies:        "Hobbies",
    customSections: "Custom Sections",
    fullName:      "Full name *",
    jobTitle:      "Job title *",
    phone:         "Phone",
    email:         "Email",
    location:      "City / Country",
    linkedin:      "LinkedIn / Website",
    birthDate:     "Date of birth",
    birthPlace:    "Place of birth",
    maritalStatus: "Marital status",
    summary:       "Professional summary",
    addPhoto:      "Add photo",
    company:       "Company",
    role:          "Position",
    period:        "Period",
    description:   "Description",
    descOptional:  "Description (optional)",
    school:        "Institution",
    degree:        "Degree",
    certName:      "Certification name",
    issuer:        "Issuing body",
    date:          "Date",
    link:          "Link",
    projectName:   "Project name",
    stack:         "Technologies",
    phName:        "John Smith",
    phTitle:       "Senior Web Developer",
    phPhone:       "+1 555 000 0000",
    phEmail:       "john@example.com",
    phLocation:    "New York, USA",
    phLinkedin:    "linkedin.com/in/john",
    phBirthDate:   "01/01/1990",
    phBirthPlace:  "New York, USA",
    phMaritalStatus: "Single",
    phSummary:     "Describe your profile in 2-3 sentences...",
    phCompany:     "Acme Corp",
    phRole:         "Frontend Developer",
    phPeriod:      "Jan 2022 – Present",
    phSchool:      "MIT",
    phDegree:      "MSc Computer Science",
    phEduPeriod:   "2018 – 2020",
    phEduDesc:     "Graduated with honors...",
    phCertName:    "AWS Solutions Architect",
    phIssuer:      "Amazon Web Services",
    phDate:        "2023",
    phLink:        "https://...",
    phProjectName: "My Application",
    phStack:       "React, Node.js, PostgreSQL",
    phProjectDesc: "Project description...",
    phUrl:         "https://github.com/...",
    phSkill:       "e.g. JavaScript",
    phLang:        "e.g. Spanish",
    phBullet:      "Describe an achievement...",
    phCustomTitle: "Section title",
    add:              "Add",
    duplicate:        "Duplicate",
    addSkill:         "Add skill",
    addLang:          "Add language",
    remove:           "Remove",
    addCustomSection: "Add section",
    addCustomItem:    "Add item",
    noExp:    "No experience added.",
    noEdu:    "No education added.",
    noCert:   "No certification added.",
    noProj:   "No project added.",
    noSkill:  "No skill added.",
    noLang:   "No language added.",
    noHobby:  "No hobby added.",
    errName:  "Name is required.",
    errTitle: "Title is required.",
    errEmail: "Invalid email.",
    tplProfile:  "Profile",
    tplExp:      "Experience",
    tplExpPro:   "Professional Experience",
    tplEdu:      "Education",
    tplSkills:   "Skills",
    tplLangs:    "Languages",
    tplCerts:    "Certifications",
    tplProjects: "Projects",
    tplHobbies:  "Hobbies",
    tplContact:  "Contact",
    notions:      "Notions",
    beginner:     "Beginner",
    intermediate: "Intermediate",
    advanced:     "Advanced",
    expert:       "Expert",
    langNotions:   "Notions",
    langSchool:    "School",
    langFluent:    "Fluent",
    langBilingual: "Bilingual",
    langNative:    "Native",
  },
}