/**
 * MobileNav
 */
import React from "react"

export default function MobileNav({ t, mobileTab, onTabChange, onUndo, canUndo, onPrintPdf }) {
  return (
    <nav id="app-mobile-nav">
      <button
        className={`mob-nav-btn ${mobileTab === "edit" ? "active" : ""}`}
        onClick={() => onTabChange("edit")}
      >
        <span>{t("edit")}</span>
        {mobileTab === "edit" && <span className="mob-nav-indicator" />}
      </button>

      <button
        className="mob-nav-btn"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <span>{t("undo")}</span>
      </button>

      <button
        className={`mob-nav-btn ${mobileTab === "preview" ? "active" : ""}`}
        onClick={() => onTabChange("preview")}
      >
        <span>{t("preview")}</span>
        {mobileTab === "preview" && <span className="mob-nav-indicator" />}
      </button>

      <button
        className="mob-nav-btn mob-nav-pdf"
        onClick={onPrintPdf}
      >
        <span>PDF</span>
      </button>
    </nav>
  )
}
