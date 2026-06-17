/**
 * App
 * Rôle : compose l'ecran principal du generateur de CV et orchestre les etats/actions.
 * Entrées : aucune (composant conteneur racine).
 * Sorties : rend le formulaire, l'apercu, la barre haute et la navigation mobile.
 * Responsabilités :
 * - gerer l'etat global UI (zoom, onglets, notification, modal de recadrage)
 * - connecter le reducer et les hooks (validation, completion, variables CSS, undo)
 * - propager les callbacks vers les composants enfants
 */

import React, { useEffect, useState, useRef, useDeferredValue } from "react"
import CVForm         from "./components/CVForm"
import CVPreview      from "./components/CVPreview"
import PhotoCropModal from "./components/PhotoCropModal"
import TopBar from "./components/appShell/TopBar"
import PreviewToolbar from "./components/appShell/PreviewToolbar"
import MobileNav from "./components/appShell/MobileNav"

import { cvReducer }       from "./reducer"
import { useUndoReducer }  from "./components/hooks/useUndoReducer"
import { useCvValidation } from "./components/hooks/useCvValidation"
import { useCssVars }      from "./components/hooks/useCssVars"
import { useCompletion }   from "./components/hooks/useCompletion"
import { INITIAL_CV, getTemplates, I18N, APP_VERSION, CV_SCHEMA_VERSION, migrateCvData } from "./constants"
import { exportPdf } from "./utils/exportPdf"

import "./index.css"

const STORAGE_KEY = "cvData"
const MAX_PHOTO_SIZE = 2 * 1024 * 1024

function makeTranslator(lang) {
  return (key) => I18N[lang]?.[key] ?? I18N.fr[key] ?? key
}

export default function App() {

  const [cvData, dispatch, undo, redo, canUndo, canRedo, commitToHistory, resetHistory] =
    useUndoReducer(cvReducer, INITIAL_CV)

  const [showUpdateNotice, setShowUpdateNotice] = useState(false)
  const [mobileTab, setMobileTab] = useState("edit")
  const [importMsg, setImportMsg] = useState("")
  const [saveStatus, setSaveStatus] = useState("idle")
  const [pdfExporting, setPdfExporting] = useState(false)
  const [cropSrc,   setCropSrc]   = useState(null)
  const [zoom,      setZoom]      = useState(100)
  const importRef = useRef(null)
  const previewRef = useRef(null)
  const saveTimerRef = useRef(null)
  const saveStatusTimerRef = useRef(null)

  const lang = cvData.settings.language || "fr"
  const t = React.useMemo(() => makeTranslator(lang), [lang])
  const templates = React.useMemo(() => getTemplates(t), [t])
  const deferredCvData = useDeferredValue(cvData)

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
      dispatch({ type: "LOAD", data: migrateCvData(parsed) })
    } catch {
      console.warn("localStorage: données CV invalides, ignorées.")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current)
    setSaveStatus("saving")
    saveTimerRef.current = setTimeout(() => {
      const { photo: _photo, ...toSave } = cvData
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            schemaVersion: CV_SCHEMA_VERSION,
            updatedAt: Date.now(),
            data: toSave,
          })
        )
        setSaveStatus("saved")
        if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current)
        saveStatusTimerRef.current = setTimeout(() => setSaveStatus("idle"), 1400)
      } catch {
        console.warn("localStorage: impossible de sauvegarder.")
        setSaveStatus("error")
      }
    }, 450)

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current)
    }
  }, [cvData])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (e.key === "z" && e.shiftKey) {
        e.preventDefault()
        redo()
      } else if (e.key === "y") {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [undo, redo])

  // ── Handlers ─────────────────────────────────────────────
  const handleChange    = (e) => dispatch({ type: "SET_FIELD", name: e.target.name, value: e.target.value })
  const handleFieldBlur = (e) => { handleBlur(e); commitToHistory() }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > MAX_PHOTO_SIZE) {
      alert(t("photoTooLarge"))
      e.target.value = ""
      return
    }
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
  const duplicateItem = (section, id)            => dispatch({ type: "DUPLICATE_ITEM", section, id })
  const setTemplate = (tpl) => dispatch({ type: "SET_FIELD", name: "template", value: tpl })

  const addCustomSection    = ()                    => dispatch({ type: "ADD_CUSTOM_SECTION" })
  const updateCustomSection = (id, name, value)     => dispatch({ type: "UPDATE_CUSTOM_SECTION", id, name, value })
  const removeCustomSection = (id)                  => dispatch({ type: "REMOVE_CUSTOM_SECTION", id })
  const addCustomItem       = (sectionId)           => dispatch({ type: "ADD_CUSTOM_ITEM", sectionId })
  const updateCustomItem    = (sid, iid, name, val) => dispatch({ type: "UPDATE_CUSTOM_ITEM", sectionId: sid, itemId: iid, name, value: val })
  const removeCustomItem    = (sectionId, itemId)   => dispatch({ type: "REMOVE_CUSTOM_ITEM", sectionId, itemId })

  const downloadJSON = () => {
    const { photo: _photo, ...toSave } = cvData
    const blob = new Blob([JSON.stringify({
      schemaVersion: CV_SCHEMA_VERSION,
      updatedAt: Date.now(),
      data: toSave,
    }, null, 2)], { type: "application/json" })
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
        dispatch({ type: "LOAD", data: migrateCvData(parsed) })
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

  const exportNativePdf = async () => {
    const element = document.getElementById("cv-preview")
    if (!element) return
    const savedZoom = zoom
    setPdfExporting(true)
    setZoom(100)
    try {
      await new Promise((r) => setTimeout(r, 200))
      const slug = (cvData.name.trim() || "cv").toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")
      await exportPdf(element, `${slug || "cv"}.pdf`)
    } catch (err) {
      console.error("PDF export failed", err)
      alert(t("importError"))
    } finally {
      setZoom(savedZoom)
      setPdfExporting(false)
    }
  }

  const resetCv = () => {
    if (!window.confirm(t("resetConfirm"))) return
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    resetHistory(INITIAL_CV)
    setImportMsg("")
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

      <TopBar
        t={t}
        templates={templates}
        currentTemplate={cvData.template}
        onTemplateChange={setTemplate}
        showUpdateNotice={showUpdateNotice}
        onDismissUpdate={() => setShowUpdateNotice(false)}
        saveStatus={saveStatus}
        printDenseEnabled={Boolean(cvData.settings.printDense)}
      />

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
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onReset={resetCv}
            onChange={handleChange}     onBlur={handleFieldBlur}
            onPhoto={handlePhoto}       onAdd={addItem}
            onUpdate={updateItem}       onRemove={removeItem}
            onDuplicate={duplicateItem}
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

          <PreviewToolbar
            t={t}
            zoom={zoom}
            onZoomOut={zoomOut}
            onZoomIn={zoomIn}
            onZoomReset={zoomReset}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onPrintPdf={printPDF}
            onExportNativePdf={exportNativePdf}
            pdfExporting={pdfExporting}
            hasErrors={hasErrors}
            onExportJson={downloadJSON}
            onImportClick={() => importRef.current.click()}
            onImportJson={importJSON}
            importRef={importRef}
          />

          {importMsg && (
            <div className="import-warning">
              {importMsg}
            </div>
          )}

          <div id="app-preview-scroll">
            <div id="zoom-wrapper" ref={previewRef} style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
              <CVPreview cvData={deferredCvData} t={t} />
            </div>
          </div>
        </main>
      </div>

      <MobileNav
        t={t}
        mobileTab={mobileTab}
        onTabChange={setMobileTab}
        onUndo={undo}
        canUndo={canUndo}
        onPrintPdf={printPDF}
      />
    </div>
  )
}