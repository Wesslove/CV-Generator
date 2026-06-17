/**
 * TopBar
 */
import React from "react"

export default function TopBar({
  t,
  templates,
  currentTemplate,
  onTemplateChange,
  showUpdateNotice,
  onDismissUpdate,
  saveStatus = "idle",
  printDenseEnabled = false,
}) {
  const statusLabel =
    saveStatus === "saving"
      ? t("saveSaving")
      : saveStatus === "saved"
        ? t("saveSaved")
        : saveStatus === "error"
          ? t("saveError")
          : null

  return (
    <header id="app-topbar">
      <div className="topbar-brand">
        <em>&lt;</em> W <em>/&gt;</em>
      </div>

      <div className="topbar-templates">
        {statusLabel && <span className="topbar-status">{statusLabel}</span>}
        {printDenseEnabled && (
          <span className="topbar-dense-badge">{t("printDenseOn")}</span>
        )}
        <span className="topbar-template-label">{t("template")}</span>
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            className={`tpl-btn ${currentTemplate === tpl.id ? "active" : ""}`}
            onClick={() => onTemplateChange(tpl.id)}
          >
            <span className={`tpl-thumb tpl-thumb-${tpl.id}`} />
            {tpl.label}
          </button>
        ))}
      </div>

      {showUpdateNotice && (
        <div className="update-notice">
          {t("updateDone")} - {t("newFeature")}
          <button className="update-dismiss" onClick={onDismissUpdate} aria-label="Fermer">
            x
          </button>
        </div>
      )}
    </header>
  )
}
