// ─────────────────────────────────────────────────────────────
// App.jsx — migré Tailwind CDN
// Classes CSS custom supprimées : app-layout, top-bar, top-bar-brand,
// brand-name, template-switcher, switcher-label, tpl-btn, main-content,
// form-sidebar, mobile-hidden, preview-area, preview-controls,
// preview-label, zoom-controls, zoom-btn, zoom-pct, print-btn,
// btn-secondary, btn-undo, preview-actions, preview-scroll,
// import-warning, mobile-bottom-nav, mob-nav-btn, mob-nav-pdf
//
// Conservées dans index.css (dynamiques ou print) :
//   .tpl-btn.active         → dépend de --accent via useCssVars
//   .mobile-hidden          → peut rester ou être géré inline (voir ci-dessous)
//   @media print            → intouché
//   update-notice           → petit composant isolé, gardé tel quel
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
import { INITIAL_CV, TEMPLATES, I18N, APP_VERSION } from "./constants"

import "./index.css"

const STORAGE_KEY = "cvData"

function makeTranslator(lang) {
  return (key) => I18N[lang]?.[key] ?? I18N.fr[key] ?? key
}

export default function App() {

  const [cvData, dispatch, undo, canUndo, commitToHistory] =
    useUndoReducer(cvReducer, INITIAL_CV)

  const [showUpdateNotice, setShowUpdateNotice] = useState(false)
  const [mobileTab, setMobileTab] = useState("edit")
  const [importMsg, setImportMsg] = useState("")
  const [cropSrc,   setCropSrc]   = useState(null)
  const [zoom,      setZoom]      = useState(100)
  const importRef = useRef(null)

  const lang = cvData.settings.language || "fr"
  const t = React.useMemo(() => makeTranslator(lang), [lang])

  const { errors, handleBlur, hasErrors } = useCvValidation(cvData, t)
  const { score, checks }                 = useCompletion(cvData, t)
  useCssVars(cvData.settings)

  useEffect(() => {
    try {
      const prev = localStorage.getItem("appVersion")
      if (prev !== APP_VERSION) {
        setShowUpdateNotice(true)
        localStorage.setItem("appVersion", APP_VERSION)
      }
    } catch (err) {
      console.error("update check error", err)
    }
  }, [])

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

  useEffect(() => {
    const { photo: _photo, ...toSave } = cvData
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch {
      console.warn("localStorage: impossible de sauvegarder.")
    }
  }, [cvData])

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

  // ── Handlers ─────────────────────────────────────────────
  const handleChange    = (e) => dispatch({ type: "SET_FIELD", name: e.target.name, value: e.target.value })
  const handleFieldBlur = (e) => { handleBlur(e); commitToHistory() }

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

  const addItem     = (section, template) => dispatch({ type: "ADD_ITEM",     section, item: template })
  const updateItem  = (section, id, name, value) => dispatch({ type: "UPDATE_ITEM",  section, id, name, value })
  const removeItem  = (section, id)              => dispatch({ type: "REMOVE_ITEM",  section, id })
  const reorderItem = (section, from, to)        => dispatch({ type: "REORDER_ITEM", section, from, to })
  const setTemplate = (tpl) => dispatch({ type: "SET_FIELD", name: "template", value: tpl })

  const addCustomSection    = ()                    => dispatch({ type: "ADD_CUSTOM_SECTION" })
  const updateCustomSection = (id, name, value)     => dispatch({ type: "UPDATE_CUSTOM_SECTION", id, name, value })
  const removeCustomSection = (id)                  => dispatch({ type: "REMOVE_CUSTOM_SECTION", id })
  const addCustomItem       = (sectionId)           => dispatch({ type: "ADD_CUSTOM_ITEM", sectionId })
  const updateCustomItem    = (sid, iid, name, val) => dispatch({ type: "UPDATE_CUSTOM_ITEM", sectionId: sid, itemId: iid, name, value: val })
  const removeCustomItem    = (sectionId, itemId)   => dispatch({ type: "REMOVE_CUSTOM_ITEM", sectionId, itemId })

  const downloadJSON = () => {
    const { photo: _photo, ...toSave } = cvData
    const blob = new Blob([JSON.stringify(toSave, null, 2)], { type: "application/json" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `${cvData.name.trim() || "cv"}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

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

  const printPDF = () => {
    const savedZoom = zoom
    setZoom(100)
    setTimeout(() => {
      window.print()
      setTimeout(() => setZoom(savedZoom), 500)
    }, 200)
  }

  const zoomIn    = () => setZoom((z) => Math.min(150, z + 10))
  const zoomOut   = () => setZoom((z) => Math.max(50,  z - 10))
  const zoomReset = () => setZoom(100)

  // ─────────────────────────────────────────────────────────
  // Rendu
  // ─────────────────────────────────────────────────────────
  return (
    // ── Conteneur racine ──────────────────────────────────
    // id="app-root" → ciblé par @media print dans index.css
    <div id="app-root" className="app-root">

      {/* Modal recadrage photo */}
      {cropSrc && (
        <PhotoCropModal
          src={cropSrc}
          lang={lang}
          onConfirm={handleCropConfirm}
          onClose={() => setCropSrc(null)}
        />
      )}

      {/* ── Barre supérieure ─────────────────────────────── */}
      {/* id="app-topbar" → masqué à l'impression via @media print */}
      <header id="app-topbar" className="h-[52px] bg-[#1e1e2e] flex items-center px-5 gap-6 shrink-0 border-b border-white/[0.06] relative overflow-hidden">

      {/* Marque */}
      <div className="flex items-center shrink-0">
        <span className="text-white text-[17px] font-bold tracking-tight">
          <em className="text-[#89b4fa] not-italic">&lt;</em>
          {" "}W{" "}
          <em className="text-[#89b4fa] not-italic">/&gt;</em>
        </span>
      </div>

        {/* Sélecteur de templates */}
        {/* template-switcher → flex items-center gap-1.5 ml-auto */}
        <div className="hidden md:flex items-center gap-1.5 ml-auto">
  <span className="hidden lg:block text-[#cdd6f4] text-[13px] opacity-60 mr-1">
    {t("template")}
  </span>
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

        {/* Bandeau mise à jour */}
        {showUpdateNotice && (
          // update-notice → conservé dans index.css (position absolute sur mobile)
          <div className="update-notice">
            {t("updateDone")} – {t("newFeature")}
            <button className="update-dismiss" onClick={() => setShowUpdateNotice(false)}>×</button>
          </div>
        )}
      </header>

      {/* ── Contenu principal ────────────────────────────── */}
      {/* id="app-content" → ciblé par @media print */}
      <div id="app-content" className="app-content">

        {/* Sidebar — classe CSS statique .app-sidebar dans index.css
            Tailwind CDN ne détecte pas les classes construites dynamiquement au runtime.
            La visibilité + largeur responsive sont gérées en CSS pur via data-hidden */}
        <aside
          id="app-sidebar"
          className="app-sidebar"
          data-hidden={mobileTab !== "edit" ? "true" : "false"}
        >
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
            onUpdateCustomItem={updateCustomItem}
            onRemoveCustomItem={removeCustomItem}
            commitToHistory={commitToHistory}
            t={t}
            lang={lang}
          />
        </aside>

        {/* Aperçu — zone droite */}
        {/*
          preview-area → flex flex-1 flex-col overflow-hidden bg-[#f4f3f0]
          mobile-hidden → hidden quand onglet "edit"
        */}
        {/* Preview — même raison : classe CSS statique .app-preview */}
        <main
          id="app-preview"
          className="app-preview"
          data-hidden={mobileTab !== "preview" ? "true" : "false"}
        >

          {/* Barre de contrôles aperçu */}
          <div id="app-preview-controls" className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 bg-white">

            {/* preview-label → text-[13px] text-zinc-400 font-medium */}
            <span className="text-[13px] text-zinc-400 font-medium">
              {t("livePreview")}
            </span>

            {/* Contrôles zoom */}
            {/* zoom-controls → flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-lg px-1.5 py-[3px] */}
            <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-lg px-1.5 py-[3px]">
              {/* zoom-btn → w-[26px] h-[26px] border-none bg-transparent text-zinc-900 text-base font-semibold cursor-pointer rounded-md flex items-center justify-center hover:bg-zinc-200 transition-colors leading-none */}
              <button
                className="w-[26px] h-[26px] border-none bg-transparent text-zinc-900 text-base font-semibold cursor-pointer rounded-md flex items-center justify-center hover:bg-zinc-200 transition-colors leading-none"
                onClick={zoomOut}
                title={t("zoomOut")}
              >−</button>

              {/* zoom-pct → text-[13px] font-semibold text-zinc-900 min-w-[38px] text-center select-none */}
              <span className="text-[13px] font-semibold text-zinc-900 min-w-[38px] text-center select-none">
                {zoom}%
              </span>

              <button
                className="w-[26px] h-[26px] border-none bg-transparent text-zinc-900 text-base font-semibold cursor-pointer rounded-md flex items-center justify-center hover:bg-zinc-200 transition-colors leading-none"
                onClick={zoomIn}
                title={t("zoomIn")}
              >+</button>

              {/* zoom-reset → même base + text-sm */}
              <button
                className="w-[26px] h-[26px] border-none bg-transparent text-zinc-900 text-sm font-semibold cursor-pointer rounded-md flex items-center justify-center hover:bg-zinc-200 transition-colors leading-none"
                onClick={zoomReset}
                title={t("zoomReset")}
              >↺</button>
            </div>

            {/* Actions (undo, PDF, export, import) */}
            {/* preview-actions → flex items-center gap-2 */}
            <div className="flex items-center gap-2">

              {/* Bouton Annuler */}
              {/* print-btn btn-secondary btn-undo → base commune + variante secondaire */}
              <button
                className="flex items-center gap-2 px-[18px] py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={undo}
                disabled={!canUndo}
                title={`${t("undo")} (Ctrl+Z)`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7v6h6"/><path d="M3 13C5 7 11 3 18 5a9 9 0 010 14c-4 1.5-8 1-11-1"/>
                </svg>
                {t("undo")}
              </button>

              {/* Bouton PDF — primaire */}
              {/* print-btn → flex items-center gap-2 px-[18px] py-2 bg-[--accent] text-white rounded-lg text-sm font-semibold */}
              <button
                className="flex items-center gap-2 px-[18px] py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white border-none rounded-lg cursor-pointer text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={printPDF}
                disabled={hasErrors}
                title={t("downloadPdf")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                {t("downloadPdf")}
              </button>

              {/* Bouton Export JSON — secondaire */}
              <button
                className="flex items-center gap-2 px-[18px] py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-zinc-200"
                onClick={downloadJSON}
                title={t("export")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                {t("export")}
              </button>

              {/* Bouton Import JSON — secondaire */}
              <button
                className="flex items-center gap-2 px-[18px] py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-zinc-200"
                onClick={() => importRef.current.click()}
                title={t("import")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                {t("import")}
              </button>
              <input ref={importRef} type="file" accept=".json" onChange={importJSON} hidden />
            </div>
          </div>

          {/* Bandeau avertissement import */}
          {/* import-warning → bg-amber-50 border-b border-amber-200 text-amber-800 text-[13px] px-6 py-2.5 flex items-center gap-2 */}
          {importMsg && (
            <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-[13px] px-6 py-2.5 flex items-center gap-2">
              {importMsg}
            </div>
          )}

          {/* Zone de défilement du CV avec zoom */}
          {/* id="app-preview-scroll" → ciblé par @media print pour annuler le zoom */}
          <div id="app-preview-scroll" className="flex-1 overflow-y-auto flex justify-center pt-8 px-6 pb-[60px] items-start">
            <div id="zoom-wrapper" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
              <CVPreview cvData={cvData} t={t} />
            </div>
          </div>
        </main>
      </div>

      {/* ── Navigation mobile (barre en bas) ────────────── */}
      {/* id="app-mobile-nav" → masqué à l'impression */}
      <nav id="app-mobile-nav" className="fixed bottom-0 left-0 right-0 h-16 bg-[#1e1e2e] border-t border-white/[0.08] z-[1000] flex md:hidden">

        {/* Onglet Édition */}
        {/*
          mob-nav-btn → flex-1 flex flex-col items-center justify-center gap-1
                        bg-transparent border-none text-white/45 font-medium
                        text-[11px] cursor-pointer transition-all py-2
          mob-nav-btn.active → text-[#89b4fa]
          ::after (indicateur) → géré inline avec un div conditionnel
        */}
        <button
          className={[
            "flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none font-medium text-[11px] cursor-pointer transition-all py-2 relative",
            mobileTab === "edit" ? "text-[#89b4fa]" : "text-white/45 hover:text-[#89b4fa]",
          ].join(" ")}
          onClick={() => setMobileTab("edit")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            className={mobileTab === "edit" ? "stroke-[#89b4fa]" : ""}
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span>{t("edit")}</span>
          {mobileTab === "edit" && (
            <span className="absolute bottom-0 w-8 h-0.5 bg-[#89b4fa] rounded-t-sm" />
          )}
        </button>

        {/* Onglet Annuler */}
        <button
          className="flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none text-white/45 hover:text-[#89b4fa] font-medium text-[11px] cursor-pointer transition-all py-2 disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={undo}
          disabled={!canUndo}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6"/><path d="M3 13C5 7 11 3 18 5a9 9 0 010 14c-4 1.5-8 1-11-1"/>
          </svg>
          <span>{t("undo")}</span>
        </button>

        {/* Onglet Aperçu */}
        <button
          className={[
            "flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none font-medium text-[11px] cursor-pointer transition-all py-2 relative",
            mobileTab === "preview" ? "text-[#89b4fa]" : "text-white/45 hover:text-[#89b4fa]",
          ].join(" ")}
          onClick={() => setMobileTab("preview")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            className={mobileTab === "preview" ? "stroke-[#89b4fa]" : ""}
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{t("preview")}</span>
          {mobileTab === "preview" && (
            <span className="absolute bottom-0 w-8 h-0.5 bg-[#89b4fa] rounded-t-sm" />
          )}
        </button>

        {/* Bouton PDF */}
        {/* mob-nav-pdf → bg-blue-600/15 hover:bg-blue-600/30 hover:text-blue-300 */}
        <button
          className="flex-1 flex flex-col items-center justify-center gap-1 border-none text-white/45 hover:text-blue-300 font-medium text-[11px] cursor-pointer transition-all py-2 bg-blue-600/15 hover:bg-blue-600/30"
          onClick={printPDF}
        >
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