// ─────────────────────────────────────────────────────────────
// constants.js
// Toutes les constantes de l'application en un seul endroit.
// Si tu veux ajouter un template, une langue ou changer les
// valeurs par défaut → c'est ici.
// ─────────────────────────────────────────────────────────────

// ── Liste des templates disponibles ──────────────────────────
export const TEMPLATES = [
  { id: "classic",    label: "Classic"     },
  { id: "modern",     label: "Modern"      },
  { id: "minimal",    label: "Minimal"     },
  { id: "executive",  label: "Executive"   },
  { id: "creative",   label: "Creative"    },
  { id: "timeline",   label: "Timeline"    },
  { id: "impact",     label: "Impact"      },
  { id: "academique", label: "Académique"  },
  { id: "startup",    label: "Startup"     },
]

// ── Niveaux de compétence ─────────────────────────────────────
// Index 0 = vide intentionnel (les niveaux commencent à 1)
export const SKILL_LEVEL_KEYS = ["", "notions", "beginner", "intermediate", "advanced", "expert"]

// ── Niveaux de langue ─────────────────────────────────────────
export const LANG_LEVEL_KEYS = ["langNotions", "langSchool", "langFluent", "langBilingual", "langNative"]

// ── Polices disponibles ───────────────────────────────────────
export const FONT_OPTIONS = [
  {
    value:   "classic",
    labelKey: "fontClassic",
    hintKey:  "fontClassicHint",
    heading: "'Playfair Display', serif",
    body:    "'Source Sans 3', sans-serif",
  },
  {
    value:   "modern",
    labelKey: "fontModern",
    hintKey:  "fontModernHint",
    heading: "'Inter', sans-serif",
    body:    "'Inter', sans-serif",
  },
  {
    value:   "elegant",
    labelKey: "fontElegant",
    hintKey:  "fontElegantHint",
    heading: "'Cormorant Garamond', serif",
    body:    "'Lato', sans-serif",
  },
  {
    value:   "tech",
    labelKey: "fontTech",
    hintKey:  "fontTechHint",
    heading: "'Space Grotesk', sans-serif",
    body:    "'DM Sans', sans-serif",
  },
]

// ── Densités de texte ─────────────────────────────────────────
export const DENSITY_OPTIONS = [
  { value: "compact", labelKey: "compact", size: "12px" },
  { value: "normal",  labelKey: "normal",  size: "14px" },
  { value: "airy",    labelKey: "airy",    size: "15px" },
]

// ── Couleurs de sélection rapide ──────────────────────────────
export const ACCENT_PRESETS = [
  "#2563eb", // bleu
  "#dc2626", // rouge
  "#16a34a", // vert
  "#7c3aed", // violet
  "#ea580c", // orange
  "#0f172a", // noir
]

// ── État initial du CV ────────────────────────────────────────
// C'est la structure de données complète d'un CV vide.
export const INITIAL_CV = {
  name:           "",
  title:          "",
  phone:          "",
  email:          "",
  location:       "",
  linkedin:       "",
  summary:        "",
  photo:          null,
  experiences:    [],  // [{ id, company, role, period, bullets: [""] }]
  educations:     [],  // [{ id, school, degree, period, bullets: [""] }]
  skills:         [],  // [{ id, name, level: 1-5 }]
  languages:      [],  // [{ id, name, level: string }]
  hobbies:        [],  // [{ id, name }]
  certifications: [],  // [{ id, name, issuer, date, url }]
  projects:       [],  // [{ id, name, stack, bullets: [""], url }]
  customSections: [],  // [{ id, title, items: [{ id, bullets: [""] }] }]
  template:       "classic",
  settings: {
    accent:   "#2563eb",
    theme:    "light",    // "light" | "dark"
    language: "fr",       // "fr" | "en"
    font:     "classic",
    density:  "normal",
  },
}

// ── Version de l'application (pour notification de mise à jour)
export const APP_VERSION = "1.1.1"

// ── Traductions (i18n) ────────────────────────────────────────
// Pour ajouter une langue : copie le bloc "fr", change la clé,
// et traduis les valeurs. Tous les composants utilisent t(clé).
export const I18N = {
  fr: {
    // Barre du haut
    template:     "Modèles",
    saved:        "✓ Sauvegardé",
    // Boutons d'action
    downloadPdf:  "Télécharger PDF",
    export:       "Exporter",
    import:       "Importer",
    livePreview:  "Aperçu en direct",
    undo:         "Annuler",
    edit:         "Éditer",
    updateDone:   "Mise à jour effectuée",
    newFeature:   "Nouvelle fonctionnalité disponible",
    preview:      "Aperçu",
    // Formulaire - titres de section
    formTitle:    "Informations du CV",
    appearance:   "🎨 Apparence",
    personal:     "👤 Informations personnelles",
    experiences:  "💼 Expériences",
    educations:   "🎓 Formation",
    certifications: "🏆 Certifications",
    projects:     "🚀 Projets",
    skills:       "⚡ Compétences",
    languages:    "🌍 Langues",
    hobbies:      "🎯 Loisirs",
    customSections: "📋 Sections personnalisées",
    // Apparence
    mainColor:    "Couleur principale",
    font:         "Police",
    density:      "Densité du texte",
    interfaceLang: "Langue de l'interface",
    completion:   "Complétion du CV",
    // Polices
    fontClassic:  "Classique",   fontClassicHint: "Playfair + Source Sans",
    fontModern:   "Moderne",     fontModernHint:  "Inter + Inter",
    fontElegant:  "Élégant",     fontElegantHint: "Cormorant + Lato",
    fontTech:     "Tech",        fontTechHint:    "Space Grotesk + DM Sans",
    // Densités
    compact: "Compact", normal: "Normal", airy: "Aéré",
    // Champs personnels
    fullName:  "Nom complet *",       jobTitle:  "Titre professionnel *",
    phone:     "Téléphone",           email:     "Email",
    location:  "Ville / Pays",        linkedin:  "LinkedIn",
    summary:   "Résumé professionnel", addPhoto: "Ajouter une photo",
    // Placeholders
    phName:     "Ex : Jean Dupont",
    phTitle:    "Ex : Développeur Full Stack",
    phPhone:    "+33 6 00 00 00 00",
    phEmail:    "nom@exemple.com",
    phLocation: "Paris, France",
    phLinkedin: "linkedin.com/in/...",
    phSummary:  "Décrivez votre profil en 2-3 phrases percutantes...",
    // Expériences
    company: "Entreprise", role: "Poste", period: "Période", description: "Description",
    phCompany: "Nom de l'entreprise", phRole: "Intitulé du poste",
    phPeriod:  "Jan 2022 – Présent",  phDesc: "Décrivez vos missions...",
    // Formation
    school: "École / Université", degree: "Diplôme",
    phSchool:    "Nom de l'établissement",
    phDegree:    "Licence, Master, BTS...",
    phEduPeriod: "2018 – 2021",
    phEduDesc:   "Spécialité, mention, projets...",
    descOptional: "Description (optionnel)",
    // Certifications
    certName: "Nom de la certification", issuer: "Organisme",
    date: "Date", link: "Lien (optionnel)",
    phCertName: "AWS Solutions Architect...",
    phIssuer:   "Amazon, ETS...",
    phDate:     "2023",
    phLink:     "https://...",
    // Projets
    projectName: "Nom du projet", stack: "Stack / Techs",
    phProjectName: "Mon super projet",
    phStack:       "React, Node, PostgreSQL",
    phProjectDesc: "Ce que fait le projet, ton rôle...",
    phUrl:         "https://github.com/...",
    // Compétences & langues
    addSkill: "Ajouter une compétence", addLang: "Ajouter une langue",
    phSkill:  "Ex : React, Photoshop...", phLang: "Ex : Anglais, Espagnol...",
    // Actions génériques
    add: "Ajouter", remove: "Supprimer",
    addBullet: "Ajouter une ligne", removeBullet: "Supprimer la ligne",
    phBullet: "Décrivez une mission ou accomplissement...",
    // Messages vides
    noExp:   "Aucune expérience ajoutée.",
    noEdu:   "Aucune formation ajoutée.",
    noCert:  "Aucune certification ajoutée.",
    noProj:  "Aucun projet ajouté.",
    noSkill: "Aucune compétence ajoutée.",
    noLang:  "Aucune langue ajoutée.",
    noHobby: "Aucun loisir ajouté.",
    // Sections personnalisées
    addCustomSection:  "Ajouter une section",
    customSectionTitle: "Titre de la section",
    phCustomTitle:     "Ex : Publications, Bénévolat...",
    addCustomItem:     "Ajouter un élément",
    noCustomItems:     "Aucun élément. Cliquez pour ajouter.",
    // Erreurs de validation
    errName:  "Le nom est requis",
    errTitle: "Le titre est requis",
    errEmail: "Email invalide",
    // Avertissement import
    importPhotoWarning: "⚠️ La photo n'est pas incluse dans le fichier JSON et devra être rajoutée manuellement.",
    // Niveaux
    notions: "Notions", beginner: "Débutant", intermediate: "Intermédiaire",
    advanced: "Avancé", expert: "Expert",
    langNotions: "Notions", langSchool: "Scolaire", langFluent: "Courant",
    langBilingual: "Bilingue", langNative: "Natif",
    // Titres des sections dans le CV
    tplProfile: "Profil",          tplExp:      "Expériences",
    tplEdu:     "Formation",       tplSkills:   "Compétences",
    tplLangs:   "Langues",         tplCerts:    "Certifications",
    tplProjects: "Projets",        tplHobbies:  "Loisirs",
    tplContact: "Contact",         tplExpPro:   "Expériences Professionnelles",
    // Zoom
    zoomIn: "Zoom +", zoomOut: "Zoom -", zoomReset: "Réinitialiser le zoom",
    // Import/Export
    importError: "Fichier JSON invalide ou corrompu.",
  },

  en: {
    template:    "Models",
    saved:       "✓ Saved",
    downloadPdf: "Download PDF",
    export:      "Export",
    import:      "Import",
    livePreview: "Live preview",
    undo:        "Undo",
    edit:        "Edit",
    updateDone:  "Update complete",
    newFeature:  "New feature available",
    preview:     "Preview",
    formTitle:   "CV Information",
    appearance:  "🎨 Appearance",
    personal:    "👤 Personal information",
    experiences: "💼 Experience",
    educations:  "🎓 Education",
    certifications: "🏆 Certifications",
    projects:    "🚀 Projects",
    skills:      "⚡ Skills",
    languages:   "🌍 Languages",
    hobbies:     "🎯 Hobbies",
    customSections: "📋 Custom sections",
    mainColor:   "Main color",
    font:        "Font",
    density:     "Text density",
    interfaceLang: "Interface language",
    completion:  "CV completion",
    fontClassic: "Classic",  fontClassicHint: "Playfair + Source Sans",
    fontModern:  "Modern",   fontModernHint:  "Inter + Inter",
    fontElegant: "Elegant",  fontElegantHint: "Cormorant + Lato",
    fontTech:    "Tech",     fontTechHint:    "Space Grotesk + DM Sans",
    compact: "Compact", normal: "Normal", airy: "Airy",
    fullName:  "Full name *",          jobTitle:  "Job title *",
    phone:     "Phone",                email:     "Email",
    location:  "City / Country",       linkedin:  "LinkedIn",
    summary:   "Professional summary", addPhoto:  "Add a photo",
    phName:     "E.g. John Smith",
    phTitle:    "E.g. Full Stack Developer",
    phPhone:    "+1 555 000 0000",
    phEmail:    "name@example.com",
    phLocation: "New York, USA",
    phLinkedin: "linkedin.com/in/...",
    phSummary:  "Describe your profile in 2-3 impactful sentences...",
    company: "Company", role: "Position", period: "Period", description: "Description",
    phCompany: "Company name",    phRole:   "Job title",
    phPeriod:  "Jan 2022 – Present", phDesc: "Describe your responsibilities...",
    school: "School / University", degree: "Degree",
    phSchool:    "Institution name",
    phDegree:    "Bachelor, Master, MBA...",
    phEduPeriod: "2018 – 2021",
    phEduDesc:   "Specialisation, honours, projects...",
    descOptional: "Description (optional)",
    certName: "Certification name", issuer: "Issuing body",
    date: "Date", link: "Link (optional)",
    phCertName: "AWS Solutions Architect...",
    phIssuer:   "Amazon, ETS...",
    phDate:     "2023",
    phLink:     "https://...",
    projectName: "Project name", stack: "Stack / Tech",
    phProjectName: "My awesome project",
    phStack:       "React, Node, PostgreSQL",
    phProjectDesc: "What the project does, your role...",
    phUrl:         "https://github.com/...",
    addSkill: "Add a skill", addLang: "Add a language",
    phSkill:  "E.g. React, Photoshop...", phLang: "E.g. English, Spanish...",
    add: "Add", remove: "Remove",
    addBullet: "Add line", removeBullet: "Remove line",
    phBullet: "Describe a responsibility or achievement...",
    noExp:   "No experience added.",
    noEdu:   "No education added.",
    noCert:  "No certification added.",
    noProj:  "No project added.",
    noSkill: "No skill added.",
    noLang:  "No language added.",
    noHobby: "No hobby added.",
    addCustomSection:   "Add a section",
    customSectionTitle: "Section title",
    phCustomTitle:      "E.g. Publications, Volunteering...",
    addCustomItem:      "Add an item",
    noCustomItems:      "No items. Click to add.",
    errName:  "Name is required",
    errTitle: "Title is required",
    errEmail: "Invalid email",
    importPhotoWarning: "⚠️ The photo is not included in the JSON file and will need to be added manually.",
    notions: "Notions", beginner: "Beginner", intermediate: "Intermediate",
    advanced: "Advanced", expert: "Expert",
    langNotions: "Notions", langSchool: "School", langFluent: "Fluent",
    langBilingual: "Bilingual", langNative: "Native",
    tplProfile: "Profile",      tplExp:      "Experience",
    tplEdu:     "Education",    tplSkills:   "Skills",
    tplLangs:   "Languages",    tplCerts:    "Certifications",
    tplProjects: "Projects",    tplHobbies:  "Hobbies",
    tplContact: "Contact",      tplExpPro:   "Professional Experience",
    zoomIn: "Zoom in", zoomOut: "Zoom out", zoomReset: "Reset zoom",
    importError: "Invalid or corrupted JSON file.",
  },
}