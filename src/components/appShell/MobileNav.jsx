/**
 * MobileNav
 * Rôle : rend la navigation basse sur mobile.
 * Entrées : onglet courant, traducteur et callbacks d'action.
 * Sorties : changement d'onglet et declenchement d'actions vers le parent.
 * Responsabilités :
 * - basculer les modes edition/apercu
 * - exposer l'action undo
 * - exposer l'action PDF
 */
import React from "react"

export default function MobileNav({ t, mobileTab, onTabChange, onUndo, canUndo, onPrintPdf }) {
  return (
    <nav
      id="app-mobile-nav"
      className="fixed bottom-0 left-0 right-0 h-16 bg-[#1e1e2e] border-t border-white/[0.08] z-[1000] flex md:hidden"
    >
      <button
        className={[
          "flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none font-medium text-[11px] cursor-pointer transition-all py-2 relative",
          mobileTab === "edit" ? "text-[#89b4fa]" : "text-white/45 hover:text-[#89b4fa]",
        ].join(" ")}
        onClick={() => onTabChange("edit")}
      >
        <span>{t("edit")}</span>
        {mobileTab === "edit" && <span className="absolute bottom-0 w-8 h-0.5 bg-[#89b4fa] rounded-t-sm" />}
      </button>

      <button
        className="flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none text-white/45 hover:text-[#89b4fa] font-medium text-[11px] cursor-pointer transition-all py-2 disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <span>{t("undo")}</span>
      </button>

      <button
        className={[
          "flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none font-medium text-[11px] cursor-pointer transition-all py-2 relative",
          mobileTab === "preview" ? "text-[#89b4fa]" : "text-white/45 hover:text-[#89b4fa]",
        ].join(" ")}
        onClick={() => onTabChange("preview")}
      >
        <span>{t("preview")}</span>
        {mobileTab === "preview" && <span className="absolute bottom-0 w-8 h-0.5 bg-[#89b4fa] rounded-t-sm" />}
      </button>

      <button
        className="flex-1 flex flex-col items-center justify-center gap-1 border-none text-white/45 hover:text-blue-300 font-medium text-[11px] cursor-pointer transition-all py-2 bg-blue-600/15 hover:bg-blue-600/30"
        onClick={onPrintPdf}
      >
        <span>PDF</span>
      </button>
    </nav>
  )
}
