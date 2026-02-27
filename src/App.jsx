// App.jsx
import React, { useReducer, useEffect, useState, useRef, useCallback } from "react"
import CVForm from "./components/CVForm"
import CVPreview from "./components/CVPreview"
import "./index.css"

const initialCv = {
  name: "", title: "", phone: "", email: "", location: "", linkedin: "",
  summary: "", photo: null,
  experiences: [], educations: [], skills: [], languages: [],
  hobbies: [], certifications: [], projects: [],
  customSections: [],   // [{ id, title, items: [{ id, bullets: [""] }] }]
  template: "classic",
  settings: { accent: "#2563eb", theme: "light", language: "fr", font: "classic", density: "normal" }
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":   return { ...state, [action.name]: action.value }
    case "ADD_ITEM":    return { ...state, [action.section]: [...state[action.section], action.item] }
    case "UPDATE_ITEM": return {
      ...state,
      [action.section]: state[action.section].map(item =>
        item.id === action.id ? { ...item, [action.name]: action.value } : item
      )
    }
    case "REMOVE_ITEM": return { ...state, [action.section]: state[action.section].filter(item => item.id !== action.id) }
    case "REORDER_ITEM": {
      const list = [...state[action.section]]
      const [moved] = list.splice(action.from, 1)
      list.splice(action.to, 0, moved)
      return { ...state, [action.section]: list }
    }
    // Custom sections
    case "ADD_CUSTOM_SECTION":
      return { ...state, customSections: [...state.customSections, action.section] }
    case "UPDATE_CUSTOM_SECTION":
      return {
        ...state,
        customSections: state.customSections.map(s =>
          s.id === action.id ? { ...s, [action.name]: action.value } : s
        )
      }
    case "REMOVE_CUSTOM_SECTION":
      return { ...state, customSections: state.customSections.filter(s => s.id !== action.id) }
    case "ADD_CUSTOM_ITEM":
      return {
        ...state,
        customSections: state.customSections.map(s =>
          s.id === action.sectionId ? { ...s, items: [...s.items, action.item] } : s
        )
      }
    case "REMOVE_CUSTOM_ITEM":
      return {
        ...state,
        customSections: state.customSections.map(s =>
          s.id === action.sectionId ? { ...s, items: s.items.filter(it => it.id !== action.itemId) } : s
        )
      }
    case "UPDATE_CUSTOM_ITEM":
      return {
        ...state,
        customSections: state.customSections.map(s =>
          s.id === action.sectionId
            ? { ...s, items: s.items.map(it => it.id === action.itemId ? { ...it, [action.name]: action.value } : it) }
            : s
        )
      }
    case "LOAD": return action.data
    default: return state
  }
}

// ── Undo middleware ──────────────────────────────────────────
const MAX_HISTORY = 30
// Actions that should NOT be pushed to undo history (too granular while typing)
const SKIP_UNDO = new Set(["SET_FIELD", "UPDATE_ITEM", "UPDATE_CUSTOM_SECTION", "UPDATE_CUSTOM_ITEM"])

function useUndoReducer(reducerFn, initial) {
  const [history, setHistory] = useState({ past: [], present: initial, skipNext: false })

  const dispatch = useCallback((action) => {
    setHistory(h => {
      const next = reducerFn(h.present, action)
      if (SKIP_UNDO.has(action.type)) {
        // Still update present but don't push to history
        return { ...h, present: next }
      }
      const past = [...h.past, h.present].slice(-MAX_HISTORY)
      return { past, present: next, skipNext: false }
    })
  }, [reducerFn])

  const undo = useCallback(() => {
    setHistory(h => {
      if (h.past.length === 0) return h
      const past = [...h.past]
      const previous = past.pop()
      return { past, present: previous, skipNext: true }
    })
  }, [])

  // Commit typed text to history on blur (called externally)
  const commitToHistory = useCallback(() => {
    setHistory(h => {
      const past = [...h.past, h.present].slice(-MAX_HISTORY)
      return { ...h, past }
    })
  }, [])

  return [history.present, dispatch, undo, history.past.length > 0, commitToHistory]
}

function computeCompletion(cv) {
  const lang = cv.settings?.language
  const fr = (f, e) => lang === "en" ? e : f
  const checks = [
    { key: "name",     label: fr("Nom complet",           "Full name"),           done: !!cv.name.trim() },
    { key: "title",    label: fr("Titre professionnel",   "Job title"),           done: !!cv.title.trim() },
    { key: "phone",    label: fr("Téléphone",             "Phone"),               done: !!cv.phone.trim() },
    { key: "location", label: fr("Localisation",          "Location"),            done: !!cv.location.trim() },
    { key: "summary",  label: fr("Résumé professionnel",  "Professional summary"),done: !!cv.summary.trim() },
    { key: "photo",    label: "Photo",                                             done: !!cv.photo },
    { key: "exp",      label: fr("Au moins 1 expérience", "1+ experience"),       done: cv.experiences.length > 0 },
    { key: "edu",      label: fr("Au moins 1 formation",  "1+ education"),        done: cv.educations.length > 0 },
    { key: "skills",   label: fr("Au moins 2 compétences","2+ skills"),           done: cv.skills.length >= 2 },
  ]
  const done = checks.filter(c => c.done).length
  return { score: Math.round((done / checks.length) * 100), checks }
}

// ── I18N ─────────────────────────────────────────────────────
export const I18N = {
  fr: {
    template: "Modèles", saved: "✓ Sauvegardé",
    downloadPdf: "Télécharger PDF", export: "Exporter", import: "Importer",
    livePreview: "Aperçu en direct", undo: "Annuler",
    formTitle: "Informations du CV",
    appearance: "🎨 Apparence", mainColor: "Couleur principale",
    font: "Police", density: "Densité du texte", interfaceLang: "Langue de l'interface",
    completion: "Complétion du CV",
    fontClassic: "Classique", fontModern: "Moderne", fontElegant: "Élégant", fontTech: "Tech",
    fontClassicHint: "Playfair + Source Sans", fontModernHint: "Inter + Inter",
    fontElegantHint: "Cormorant + Lato", fontTechHint: "Space Grotesk + DM Sans",
    compact: "Compact", normal: "Normal", airy: "Aéré",
    personal: "👤 Informations personnelles",
    experiences: "💼 Expériences", educations: "🎓 Formation",
    certifications: "🏆 Certifications", projects: "🚀 Projets",
    skills: "⚡ Compétences", languages: "🌍 Langues", hobbies: "🎯 Loisirs",
    customSections: "📋 Sections personnalisées",
    addCustomSection: "Ajouter une section", customSectionTitle: "Titre de la section",
    phCustomTitle: "Ex : Publications, Bénévolat...",
    addCustomItem: "Ajouter un élément", customItemLabel: "Contenu",
    noCustomItems: "Aucun élément. Cliquez pour ajouter.",
    fullName: "Nom complet *", jobTitle: "Titre professionnel *",
    phone: "Téléphone", email: "Email", location: "Ville / Pays", linkedin: "LinkedIn",
    summary: "Résumé professionnel", addPhoto: "Ajouter une photo",
    phName: "Ex : Jean Dupont", phTitle: "Ex : Développeur Full Stack",
    phPhone: "+33 6 00 00 00 00", phEmail: "nom@exemple.com",
    phLocation: "Paris, France", phLinkedin: "linkedin.com/in/...",
    phSummary: "Décrivez votre profil en 2-3 phrases percutantes...",
    company: "Entreprise", role: "Poste", period: "Période", description: "Description",
    phCompany: "Nom de l'entreprise", phRole: "Intitulé du poste",
    phPeriod: "Jan 2022 – Présent", phDesc: "Décrivez vos missions...",
    school: "École / Université", degree: "Diplôme",
    phSchool: "Nom de l'établissement", phDegree: "Licence, Master, BTS...",
    phEduPeriod: "2018 – 2021", phEduDesc: "Spécialité, mention, projets...",
    descOptional: "Description (optionnel)",
    certName: "Nom de la certification", issuer: "Organisme", date: "Date", link: "Lien (optionnel)",
    phCertName: "AWS Solutions Architect...", phIssuer: "Amazon, ETS...", phDate: "2023", phLink: "https://...",
    projectName: "Nom du projet", stack: "Stack / Techs",
    phProjectName: "Mon super projet", phStack: "React, Node, PostgreSQL",
    phProjectDesc: "Ce que fait le projet, ton rôle...", phUrl: "https://github.com/...",
    addSkill: "Ajouter une compétence", addLang: "Ajouter une langue",
    phSkill: "Ex : React, Photoshop...", phLang: "Ex : Anglais, Espagnol...",
    add: "Ajouter", up: "Monter", down: "Descendre", remove: "Supprimer",
    addBullet: "Ajouter une ligne", removeBullet: "Supprimer la ligne",
    phBullet: "Décrivez une mission ou accomplissement...",
    noExp: "Aucune expérience ajoutée.", noEdu: "Aucune formation ajoutée.",
    noCert: "Aucune certification ajoutée.", noProj: "Aucun projet ajouté.",
    noSkill: "Aucune compétence ajoutée.", noLang: "Aucune langue ajoutée.", noHobby: "Aucun loisir ajouté.",
    errName: "Le nom est requis", errTitle: "Le titre est requis", errEmail: "Email invalide",
    edit: "Éditer", preview: "Aperçu",
    importPhotoWarning: "⚠️ La photo n'est pas incluse dans le fichier JSON et devra être rajoutée manuellement.",
    tplProfile: "Profil", tplExp: "Expériences", tplEdu: "Formation",
    tplSkills: "Compétences", tplLangs: "Langues", tplCerts: "Certifications",
    tplProjects: "Projets", tplHobbies: "Loisirs", tplContact: "Contact",
    tplExpPro: "Expériences Professionnelles",
    notions: "Notions", beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé", expert: "Expert",
    langNotions: "Notions", langSchool: "Scolaire", langFluent: "Courant", langBilingual: "Bilingue", langNative: "Natif",
  },
  en: {
    template: "Models", saved: "✓ Saved",
    downloadPdf: "Download PDF", export: "Export", import: "Import",
    livePreview: "Live preview", undo: "Undo",
    formTitle: "CV Information", appearance: "🎨 Appearance", mainColor: "Main color",
    font: "Font", density: "Text density", interfaceLang: "Interface language",
    completion: "CV completion",
    fontClassic: "Classic", fontModern: "Modern", fontElegant: "Elegant", fontTech: "Tech",
    fontClassicHint: "Playfair + Source Sans", fontModernHint: "Inter + Inter",
    fontElegantHint: "Cormorant + Lato", fontTechHint: "Space Grotesk + DM Sans",
    compact: "Compact", normal: "Normal", airy: "Airy",
    personal: "👤 Personal information",
    experiences: "💼 Experience", educations: "🎓 Education",
    certifications: "🏆 Certifications", projects: "🚀 Projects",
    skills: "⚡ Skills", languages: "🌍 Languages", hobbies: "🎯 Hobbies",
    customSections: "📋 Custom sections",
    addCustomSection: "Add a section", customSectionTitle: "Section title",
    phCustomTitle: "E.g. Publications, Volunteering...",
    addCustomItem: "Add an item", customItemLabel: "Content",
    noCustomItems: "No items. Click to add.",
    fullName: "Full name *", jobTitle: "Job title *",
    phone: "Phone", email: "Email", location: "City / Country", linkedin: "LinkedIn",
    summary: "Professional summary", addPhoto: "Add a photo",
    phName: "E.g. John Smith", phTitle: "E.g. Full Stack Developer",
    phPhone: "+1 555 000 0000", phEmail: "name@example.com",
    phLocation: "New York, USA", phLinkedin: "linkedin.com/in/...",
    phSummary: "Describe your profile in 2-3 impactful sentences...",
    company: "Company", role: "Position", period: "Period", description: "Description",
    phCompany: "Company name", phRole: "Job title",
    phPeriod: "Jan 2022 – Present", phDesc: "Describe your responsibilities...",
    school: "School / University", degree: "Degree",
    phSchool: "Institution name", phDegree: "Bachelor, Master, MBA...",
    phEduPeriod: "2018 – 2021", phEduDesc: "Specialisation, honours, projects...",
    descOptional: "Description (optional)",
    certName: "Certification name", issuer: "Issuing body", date: "Date", link: "Link (optional)",
    phCertName: "AWS Solutions Architect...", phIssuer: "Amazon, ETS...", phDate: "2023", phLink: "https://...",
    projectName: "Project name", stack: "Stack / Tech",
    phProjectName: "My awesome project", phStack: "React, Node, PostgreSQL",
    phProjectDesc: "What the project does, your role...", phUrl: "https://github.com/...",
    addSkill: "Add a skill", addLang: "Add a language",
    phSkill: "E.g. React, Photoshop...", phLang: "E.g. English, Spanish...",
    add: "Add", up: "Move up", down: "Move down", remove: "Remove",
    addBullet: "Add line", removeBullet: "Remove line",
    phBullet: "Describe a responsibility or achievement...",
    noExp: "No experience added.", noEdu: "No education added.",
    noCert: "No certification added.", noProj: "No project added.",
    noSkill: "No skill added.", noLang: "No language added.", noHobby: "No hobby added.",
    errName: "Name is required", errTitle: "Title is required", errEmail: "Invalid email",
    edit: "Edit", preview: "Preview",
    importPhotoWarning: "⚠️ The photo is not included in the JSON file and will need to be added manually.",
    tplProfile: "Profile", tplExp: "Experience", tplEdu: "Education",
    tplSkills: "Skills", tplLangs: "Languages", tplCerts: "Certifications",
    tplProjects: "Projects", tplHobbies: "Hobbies", tplContact: "Contact",
    tplExpPro: "Professional Experience",
    notions: "Notions", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", expert: "Expert",
    langNotions: "Notions", langSchool: "School", langFluent: "Fluent", langBilingual: "Bilingual", langNative: "Native",
  }
}

export default function App() {
  const [cvData, dispatch, undo, canUndo, commitToHistory] = useUndoReducer(reducer, initialCv)
  const [errors, setErrors]   = useState({})
  const [touched, setTouched] = useState({})
  const [saved, setSaved]     = useState(false)
  const [mobileTab, setMobileTab] = useState("edit")
  const [importMsg, setImportMsg] = useState("")
  const importRef = useRef(null)

  const lang = cvData.settings.language || "fr"
  const t = (key) => I18N[lang]?.[key] ?? I18N.fr[key] ?? key

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cvData")
      if (stored) dispatch({ type: "LOAD", data: { ...initialCv, ...JSON.parse(stored) } })
    } catch (_) {}
  }, [])

  // Save to localStorage
  useEffect(() => {
    const { photo, ...toSave } = cvData
    localStorage.setItem("cvData", JSON.stringify(toSave))
    setSaved(true)
    const timer = setTimeout(() => setSaved(false), 1500)
    return () => clearTimeout(timer)
  }, [cvData])

  // Ctrl+Z / Cmd+Z global keyboard shortcut
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [undo])

  const handleChange = (e) => dispatch({ type: "SET_FIELD", name: e.target.name, value: e.target.value })
  const handleBlur   = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
    commitToHistory()
  }
  const handlePhoto  = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => dispatch({ type: "SET_FIELD", name: "photo", value: ev.target.result })
    reader.readAsDataURL(file)
  }

  const addItem     = (section, tmpl) => dispatch({ type: "ADD_ITEM", section, item: { id: Date.now(), ...tmpl } })
  const reorderItem = (section, from, to) => dispatch({ type: "REORDER_ITEM", section, from, to })
  const updateItem  = (section, id, name, value) => dispatch({ type: "UPDATE_ITEM", section, id, name, value })
  const removeItem  = (section, id) => dispatch({ type: "REMOVE_ITEM", section, id })
  const setTemplate = (tpl) => dispatch({ type: "SET_FIELD", name: "template", value: tpl })

  // Custom sections actions
  const addCustomSection    = () => dispatch({ type: "ADD_CUSTOM_SECTION", section: { id: Date.now(), title: "", items: [] } })
  const updateCustomSection = (id, name, value) => dispatch({ type: "UPDATE_CUSTOM_SECTION", id, name, value })
  const removeCustomSection = (id) => dispatch({ type: "REMOVE_CUSTOM_SECTION", id })
  const addCustomItem       = (sectionId) => dispatch({ type: "ADD_CUSTOM_ITEM", sectionId, item: { id: Date.now(), bullets: [""] } })
  const removeCustomItem    = (sectionId, itemId) => dispatch({ type: "REMOVE_CUSTOM_ITEM", sectionId, itemId })
  const updateCustomItem    = (sectionId, itemId, name, value) => dispatch({ type: "UPDATE_CUSTOM_ITEM", sectionId, itemId, name, value })

  // Validation
  const validate = (data, touchedFields) => {
    const errs = {}
    if (!data.name.trim())  errs.name  = t("errName")
    if (!data.title.trim()) errs.title = t("errTitle")
    if (data.email.trim() && touchedFields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = t("errEmail")
    return errs
  }
  useEffect(() => { setErrors(validate(cvData, touched)) }, [cvData, touched])

  // CSS vars
  useEffect(() => {
    const accent = cvData.settings.accent || "#2563eb"
    const adjustHex = (hex, amt) => {
      let col = hex.replace(/^#/, "")
      if (col.length === 3) col = col.split("").map(c => c+c).join("")
      const num = parseInt(col, 16)
      const r = Math.max(Math.min(255, (num >> 16) + amt), 0)
      const g = Math.max(Math.min(255, ((num >> 8) & 0xff) + amt), 0)
      const b = Math.max(Math.min(255, (num & 0xff) + amt), 0)
      return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")
    }
    document.documentElement.style.setProperty("--accent", accent)
    document.documentElement.style.setProperty("--accent-hover", adjustHex(accent, -20))
    document.documentElement.style.setProperty("--classic-border", accent)
    document.documentElement.style.setProperty("--sidebar-accent", accent)
    const fonts = {
      classic: { heading: "'Playfair Display', serif",  body: "'Source Sans 3', sans-serif" },
      modern:  { heading: "'Inter', sans-serif",         body: "'Inter', sans-serif" },
      elegant: { heading: "'Cormorant Garamond', serif", body: "'Lato', sans-serif" },
      tech:    { heading: "'Space Grotesk', sans-serif", body: "'DM Sans', sans-serif" },
    }
    const f = fonts[cvData.settings.font] || fonts.classic
    document.documentElement.style.setProperty("--font-heading", f.heading)
    document.documentElement.style.setProperty("--font-body",    f.body)
    const densityMap = { compact: "12px", normal: "14px", airy: "15px" }
    document.documentElement.style.setProperty("--cv-base-size", densityMap[cvData.settings.density] || "14px")
    if (cvData.settings.theme === "dark") document.body.classList.add("dark")
    else document.body.classList.remove("dark")
  }, [cvData.settings])

  const exportPDF = () => {
    if (window.html2pdf) window.html2pdf().from(document.getElementById("cv-preview")).save("cv.pdf")
    else window.print()
  }
  const downloadJSON = () => {
    const { photo, ...toSave } = cvData
    const blob = new Blob([JSON.stringify(toSave, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "cv.json"; a.click()
    URL.revokeObjectURL(url)
  }
  const importJSON = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        dispatch({ type: "LOAD", data: { ...initialCv, ...JSON.parse(ev.target.result) } })
        setImportMsg(t("importPhotoWarning"))
        setTimeout(() => setImportMsg(""), 6000)
      } catch { alert("Fichier JSON invalide") }
    }
    reader.readAsText(file); e.target.value = ""
  }

  const { score, checks } = computeCompletion(cvData)
  const TEMPLATES = ["classic", "modern", "minimal", "executive", "creative", "timeline", "impact", "academique", "startup"]
  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="app-layout">
      <header className="top-bar">
        <div className="top-bar-brand">
          <span className="brand-name"><em>&lt;</em> W <em>/&gt;</em></span>
        </div>
        <div className="template-switcher">
          <span className="switcher-label">{t("template")}</span>
          {TEMPLATES.map((tpl) => (
            <button key={tpl} className={`tpl-btn ${cvData.template === tpl ? "active" : ""}`} onClick={() => setTemplate(tpl)}>
              {{"academique": "Académique", "startup": "Startup"}[tpl] || tpl.charAt(0).toUpperCase() + tpl.slice(1)}
            </button>
          ))}
        </div>
        <div className={`save-indicator ${saved ? "visible" : ""}`}>{t("saved")}</div>
      </header>

      <div className="main-content">
        <aside className={`form-sidebar ${mobileTab !== "edit" ? "mobile-hidden" : ""}`}>
          <CVForm
            cvData={cvData} errors={errors}
            completionScore={score} completionChecks={checks}
            canUndo={canUndo} onUndo={undo}
            onChange={handleChange} onBlur={handleBlur}
            onPhoto={handlePhoto} onAdd={addItem}
            onUpdate={updateItem} onRemove={removeItem}
            onReorder={reorderItem} onTemplateChange={setTemplate}
            onAddCustomSection={addCustomSection}
            onUpdateCustomSection={updateCustomSection}
            onRemoveCustomSection={removeCustomSection}
            onAddCustomItem={addCustomItem}
            onRemoveCustomItem={removeCustomItem}
            onUpdateCustomItem={updateCustomItem}
            commitToHistory={commitToHistory}
            t={t}
          />
        </aside>

        <main className={`preview-area ${mobileTab !== "preview" ? "mobile-hidden" : ""}`}>
          <div className="preview-controls">
            <span className="preview-label">{t("livePreview")}</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                className="print-btn btn-secondary btn-undo"
                onClick={undo} disabled={!canUndo}
                title={`${t("undo")} (Ctrl+Z)`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7v6h6"/><path d="M3 13C5 7 11 3 18 5a9 9 0 010 14c-4 1.5-8 1-11-1"/>
                </svg>
                {t("undo")}
              </button>
              <button className="print-btn" onClick={exportPDF} disabled={hasErrors}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                {t("downloadPdf")}
              </button>
              <button className="print-btn btn-secondary" onClick={downloadJSON}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                {t("export")}
              </button>
              <button className="print-btn btn-secondary" onClick={() => importRef.current.click()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                {t("import")}
              </button>
              <input ref={importRef} type="file" accept=".json" onChange={importJSON} hidden />
            </div>
          </div>
          {importMsg && <div className="import-warning">{importMsg}</div>}
          <div className="preview-scroll">
            <CVPreview cvData={cvData} t={t} />
          </div>
        </main>
      </div>

      <nav className="mobile-bottom-nav">
        <button className={`mob-nav-btn ${mobileTab === "edit" ? "active" : ""}`} onClick={() => setMobileTab("edit")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span>{t("edit")}</span>
        </button>
        <button className="mob-nav-btn" onClick={undo} disabled={!canUndo} title="Ctrl+Z">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6"/><path d="M3 13C5 7 11 3 18 5a9 9 0 010 14c-4 1.5-8 1-11-1"/>
          </svg>
          <span>{t("undo")}</span>
        </button>
        <button className={`mob-nav-btn ${mobileTab === "preview" ? "active" : ""}`} onClick={() => setMobileTab("preview")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{t("preview")}</span>
        </button>
        <button className="mob-nav-btn mob-nav-pdf" onClick={() => window.print()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          <span>PDF</span>
        </button>
      </nav>
    </div>
  )
}