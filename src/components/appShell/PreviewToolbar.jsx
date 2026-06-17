/**
 * PreviewToolbar
 */
import React from "react"

export default function PreviewToolbar({
  t,
  zoom,
  onZoomOut,
  onZoomIn,
  onZoomReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onPrintPdf,
  onExportNativePdf,
  pdfExporting,
  hasErrors,
  onExportJson,
  onImportClick,
  onImportJson,
  importRef,
}) {
  return (
    <div id="app-preview-controls">
      <span className="preview-toolbar-label">{t("livePreview")}</span>

      <div className="zoom-controls">
        <button className="zoom-btn" onClick={onZoomOut} title={t("zoomOut")} aria-label={t("zoomOut")}>-</button>
        <span className="zoom-pct">{zoom}%</span>
        <button className="zoom-btn" onClick={onZoomIn} title={t("zoomIn")} aria-label={t("zoomIn")}>+</button>
        <button className="zoom-btn" onClick={onZoomReset} title={t("zoomReset")} aria-label={t("zoomReset")}>R</button>
      </div>

      <div className="preview-actions">
        <button
          className="toolbar-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title={`${t("undo")} (Ctrl+Z)`}
        >
          {t("undo")}
        </button>
        <button
          className="toolbar-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title={`${t("redo")} (Ctrl+Shift+Z)`}
        >
          {t("redo")}
        </button>
        <button
          className="toolbar-btn toolbar-btn-primary"
          onClick={onPrintPdf}
          disabled={hasErrors}
          title={t("downloadPdf")}
        >
          {t("downloadPdf")}
        </button>
        <button
          className="toolbar-btn"
          onClick={onExportNativePdf}
          disabled={hasErrors || pdfExporting}
          title={t("downloadPdfNative")}
        >
          {pdfExporting ? t("pdfExporting") : t("downloadPdfNative")}
        </button>
        <button className="toolbar-btn" onClick={onExportJson} title={t("export")}>
          {t("export")}
        </button>
        <button className="toolbar-btn" onClick={onImportClick} title={t("import")}>
          {t("import")}
        </button>
        <input ref={importRef} type="file" accept=".json" onChange={onImportJson} hidden />
      </div>
    </div>
  )
}
