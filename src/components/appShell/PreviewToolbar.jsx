/**
 * PreviewToolbar
 * Rôle : rend la barre d'actions de l'apercu (zoom/actions).
 * Entrées : etat du zoom, flags de validation, callbacks, traducteur.
 * Sorties : UI de barre d'outils et actions utilisateur propagees au parent.
 * Responsabilités :
 * - controler zoom plus/moins/reset
 * - declencher les actions undo/pdf/export/import
 * - heberger la liaison ref de l'input import fichier
 */
import React from "react"

export default function PreviewToolbar({
  t,
  zoom,
  onZoomOut,
  onZoomIn,
  onZoomReset,
  onUndo,
  canUndo,
  onPrintPdf,
  hasErrors,
  onExportJson,
  onImportClick,
  onImportJson,
  importRef,
}) {
  return (
    <div id="app-preview-controls" className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 bg-white">
      <span className="text-[13px] text-zinc-400 font-medium">{t("livePreview")}</span>

      <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-lg px-1.5 py-[3px]">
        <button
          className="w-[26px] h-[26px] border-none bg-transparent text-zinc-900 text-base font-semibold cursor-pointer rounded-md flex items-center justify-center hover:bg-zinc-200 transition-colors leading-none"
          onClick={onZoomOut}
          title={t("zoomOut")}
        >
          -
        </button>
        <span className="text-[13px] font-semibold text-zinc-900 min-w-[38px] text-center select-none">{zoom}%</span>
        <button
          className="w-[26px] h-[26px] border-none bg-transparent text-zinc-900 text-base font-semibold cursor-pointer rounded-md flex items-center justify-center hover:bg-zinc-200 transition-colors leading-none"
          onClick={onZoomIn}
          title={t("zoomIn")}
        >
          +
        </button>
        <button
          className="w-[26px] h-[26px] border-none bg-transparent text-zinc-900 text-sm font-semibold cursor-pointer rounded-md flex items-center justify-center hover:bg-zinc-200 transition-colors leading-none"
          onClick={onZoomReset}
          title={t("zoomReset")}
        >
          R
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 px-[18px] py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={onUndo}
          disabled={!canUndo}
          title={`${t("undo")} (Ctrl+Z)`}
        >
          {t("undo")}
        </button>
        <button
          className="flex items-center gap-2 px-[18px] py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white border-none rounded-lg cursor-pointer text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onPrintPdf}
          disabled={hasErrors}
          title={t("downloadPdf")}
        >
          {t("downloadPdf")}
        </button>
        <button
          className="flex items-center gap-2 px-[18px] py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-zinc-200"
          onClick={onExportJson}
          title={t("export")}
        >
          {t("export")}
        </button>
        <button
          className="flex items-center gap-2 px-[18px] py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-zinc-200"
          onClick={onImportClick}
          title={t("import")}
        >
          {t("import")}
        </button>
        <input ref={importRef} type="file" accept=".json" onChange={onImportJson} hidden />
      </div>
    </div>
  )
}
