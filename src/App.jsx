// ─────────────────────────────────────────────────────────────
// App.jsx
// Composant racine de l'application.
// Son rôle : orchestrer les composants et les hooks.
// Il ne contient PAS de logique métier (voir hooks/ et reducer.js)
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState, useRef } from "react"
import CVForm         from "./components/CVForm"
import CVPreview      from "./components/CVPreview"
import PhotoCropModal from "./components/PhotoCropModal"

import { cvReducer }       from "./reducer"
import { useUndoReducer }  from "./components/hooks/useUndoReducer"
import { useCvValidation } from "./components/hooks/useCvValidation"
import { useCssVars }      from "./components/hooks/useCssVars"
import { useCompletion }   from "./components/hooks/useCompletion"
import { INITIAL_CV, TEMPLATES, I18N } from "./constants"

import "./index.css"

// ── Clé de stockage localStorage ─────────────────────────────
const STORAGE_KEY = "cvData"

// ── Fonction de traduction ────────────────────────────────────
// Retourne la traduction d'une clé, avec fallback sur le français
function makeTranslator(lang) {
  return (key) => I18N[lang]?.[key] ?? I18N.fr[key] ?? key
}

// ─────────────────────────────────────────────────────────────
export default function App() {

  // ── État principal du CV avec historique Annuler ──────────
  const [cvData, dispatch, undo, canUndo, commitToHistory] =
    useUndoReducer(cvReducer, INITIAL_CV)

  // ── États UI (n'affectent pas le contenu du CV) ───────────
  const [showUpdateNotice, setShowUpdateNotice] = useState(false)
  const [mobileTab, setMobileTab] = useState("edit") // "edit" | "preview"
  const [importMsg, setImportMsg] = useState("")
  const [cropSrc,   setCropSrc]   = useState(null)   // src brute avant recadrage
  const [zoom,      setZoom]      = useState(100)     // zoom aperçu en %
  const importRef = useRef(null)

  // ── Traduction ────────────────────────────────────────────
  const lang = cvData.settings.language || "fr"
  const t    = makeTranslator(lang)

  // ── Hooks dérivés ─────────────────────────────────────────
  const { errors, handleBlur, hasErrors } = useCvValidation(cvData, t)
  const { score, checks }                 = useCompletion(cvData, t)
  useCssVars(cvData.settings)

  // ── Notification de mise à jour de l'application ─────────
  useEffect(() => {
    try {
      const prev = localStorage.getItem("appVersion")
      if (prev !== APP_VERSION) {
        setShowUpdateNotice(true)
        localStorage.setItem("appVersion", APP_VERSION)
      }
    } catch {
      /* ignore */
    }
  }, [])

  // ── Chargement depuis localStorage au démarrage ───────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return
      const parsed = JSON.parse(stored)
      if (typeof parsed !== "object" || parsed === null) return
      dispatch({ type: "LOAD", data: { ...INITIAL_CV, ...parsed } })
    } catch {
      console.warn("localStorage: données CV invalides, ignorées.")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sauvegarde automatique dans localStorage ──────────────
  useEffect(() => {
    // On exclut la photo (trop volumineuse pour localStorage)
    const { photo, ...toSave } = cvData
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch {
      console.warn("localStorage: impossible de sauvegarder.")
    }
  }, [cvData])

  // ── Raccourci clavier Ctrl+Z / Cmd+Z ─────────────────────
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [undo])

  // ─────────────────────────────────────────────────────────
  // Handlers — actions utilisateur
  // ─────────────────────────────────────────────────────────

  const handleChange = (e) =>
    dispatch({ type: "SET_FIELD", name: e.target.name, value: e.target.value })

  const handleFieldBlur = (e) => {
    handleBlur(e)
    commitToHistory()
  }

  // Photo : ouvre le modal de recadrage
  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCropSrc(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleCropConfirm = (croppedDataUrl) => {
    dispatch({ type: "SET_FIELD", name: "photo", value: croppedDataUrl })
    setCropSrc(null)
  }

  // Sections dynamiques
  const addItem     = (section, template) => dispatch({ type: "ADD_ITEM", section, item: template })
  const updateItem  = (section, id, name, value) => dispatch({ type: "UPDATE_ITEM", section, id, name, value })
  const removeItem  = (section, id) => dispatch({ type: "REMOVE_ITEM", section, id })
  const reorderItem = (section, from, to) => dispatch({ type: "REORDER_ITEM", section, from, to })
  const setTemplate = (tpl) => dispatch({ type: "SET_FIELD", name: "template", value: tpl })

  // Sections personnalisées
  const addCustomSection    = ()                    => dispatch({ type: "ADD_CUSTOM_SECTION" })
  const updateCustomSection = (id, name, value)     => dispatch({ type: "UPDATE_CUSTOM_SECTION", id, name, value })
  const removeCustomSection = (id)                  => dispatch({ type: "REMOVE_CUSTOM_SECTION", id })
  const addCustomItem       = (sectionId)           => dispatch({ type: "ADD_CUSTOM_ITEM", sectionId })
  const updateCustomItem    = (sid, iid, name, val) => dispatch({ type: "UPDATE_CUSTOM_ITEM", sectionId: sid, itemId: iid, name, value: val })
  const removeCustomItem    = (sectionId, itemId)   => dispatch({ type: "REMOVE_CUSTOM_ITEM", sectionId, itemId })

  // Export JSON
  const downloadJSON = () => {
    const { photo, ...toSave } = cvData
    const blob = new Blob([JSON.stringify(toSave, null, 2)], { type: "application/json" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `${cvData.name.trim() || "cv"}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import JSON avec validation de structure
  const importJSON = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        if (typeof parsed !== "object" || parsed === null) throw new Error()
        dispatch({ type: "LOAD", data: { ...INITIAL_CV, ...parsed } })
        setImportMsg(t("importPhotoWarning"))
        setTimeout(() => setImportMsg(""), 6000)
      } catch {
        alert(t("importError"))
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const printPDF  = () => window.print()
  const zoomIn    = () => setZoom((z) => Math.min(150, z + 10))
  const zoomOut   = () => setZoom((z) => Math.max(50, z - 10))
  const zoomReset = () => setZoom(100)

  // ─────────────────────────────────────────────────────────
  // Rendu
  // ─────────────────────────────────────────────────────────
  return (
    <div className="app-layout">

      {/* Modal de recadrage photo */}
      {cropSrc && (
        <PhotoCropModal
          src={cropSrc}
          lang={lang}
          onConfirm={handleCropConfirm}
          onClose={() => setCropSrc(null)}
        />
      )}

      {/* ── Barre supérieure ── */}
      <header className="top-bar">
        <div className="top-bar-brand">
          <span className="brand-name"><em>&lt;</em> W <em>/&gt;</em></span>
        </div>

        <div className="template-switcher">
          <span className="switcher-label">{t("template")}</span>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              className={`tpl-btn ${cvData.template === tpl.id ? "active" : ""}`}
              onClick={() => setTemplate(tpl.id)}
            >
              <span className={`tpl-thumb tpl-thumb-${tpl.id}`} />
              {tpl.label}
            </button>
          ))}
        </div>

        {/* save indicator removed, updates are silent */}
        {showUpdateNotice && (
          <div className="update-notice">
            {t("updateDone")} – {t("newFeature")}
            <button className="update-dismiss" onClick={() => setShowUpdateNotice(false)}>×</button>
          </div>
        )}
      </header>

      {/* ── Contenu principal ── */}
      <div className="main-content">

        {/* Formulaire (gauche) */}
        <aside className={`form-sidebar ${mobileTab !== "edit" ? "mobile-hidden" : ""}`}>
          <CVForm
            cvData={cvData}             errors={errors}
            completionScore={score}     completionChecks={checks}
            canUndo={canUndo}           onUndo={undo}
            onChange={handleChange}     onBlur={handleFieldBlur}
            onPhoto={handlePhoto}       onAdd={addItem}
            onUpdate={updateItem}       onRemove={removeItem}
            onReorder={reorderItem}     onTemplateChange={setTemplate}
            onAddCustomSection={addCustomSection}
            onUpdateCustomSection={updateCustomSection}
            onRemoveCustomSection={removeCustomSection}
            onAddCustomItem={addCustomItem}
            onRemoveCustomItem={removeCustomItem}
            onUpdateCustomItem={updateCustomItem}
            commitToHistory={commitToHistory}
            lang={lang} t={t}
          />
        </aside>

        {/* Aperçu (droite) */}
        <main className={`preview-area ${mobileTab !== "preview" ? "mobile-hidden" : ""}`}>
          <div className="preview-controls">
            <span className="preview-label">{t("livePreview")}</span>

            {/* Zoom */}
            <div className="zoom-controls">
              <button className="zoom-btn" onClick={zoomOut}  title={t("zoomOut")}>−</button>
              <span   className="zoom-pct">{zoom}%</span>
              <button className="zoom-btn" onClick={zoomIn}   title={t("zoomIn")}>+</button>
              <button className="zoom-btn zoom-reset" onClick={zoomReset} title={t("zoomReset")}>↺</button>
            </div>

            {/* Actions */}
            <div className="preview-actions">
              <button className="print-btn btn-secondary btn-undo" onClick={undo} disabled={!canUndo} title={`${t("undo")} (Ctrl+Z)`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7v6h6"/><path d="M3 13C5 7 11 3 18 5a9 9 0 010 14c-4 1.5-8 1-11-1"/>
                </svg>
                {t("undo")}
              </button>

              <button className="print-btn" onClick={printPDF} disabled={hasErrors} title={t("downloadPdf")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                {t("downloadPdf")}
              </button>

              <button className="print-btn btn-secondary" onClick={downloadJSON} title={t("export")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                {t("export")}
              </button>

              <button className="print-btn btn-secondary" onClick={() => importRef.current.click()} title={t("import")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                {t("import")}
              </button>
              <input ref={importRef} type="file" accept=".json" onChange={importJSON} hidden />
            </div>
          </div>

          {importMsg && <div className="import-warning">{importMsg}</div>}

          {/* CV avec zoom */}
          <div className="preview-scroll">
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
              <CVPreview cvData={cvData} t={t} />
            </div>
          </div>
        </main>
      </div>

      {/* ── Navigation mobile ── */}
      <nav className="mobile-bottom-nav">
        <button className={`mob-nav-btn ${mobileTab === "edit" ? "active" : ""}`} onClick={() => setMobileTab("edit")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span>{t("edit")}</span>
        </button>

        <button className="mob-nav-btn" onClick={undo} disabled={!canUndo}>
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

        <button className="mob-nav-btn mob-nav-pdf" onClick={printPDF}>
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