/**
 * TopBar
 * Rôle : rend les controles d'en-tete desktop/tablette.
 * Entrées : liste de templates, template courant, traduction et callbacks.
 * Sorties : barre de navigation haute avec selecteur de template.
 * Responsabilités :
 * - afficher la marque et les boutons template
 * - emettre les evenements de changement de template
 * - afficher/fermer la notification de mise a jour
 */
import React from "react"

export default function TopBar({
  t,
  templates,
  currentTemplate,
  onTemplateChange,
  showUpdateNotice,
  onDismissUpdate,
}) {
  return (
    <header
      id="app-topbar"
      className="h-[52px] bg-[#1e1e2e] flex items-center px-5 gap-6 shrink-0 border-b border-white/[0.06] relative overflow-hidden"
    >
      <div className="flex items-center shrink-0">
        <span className="text-white text-[17px] font-bold tracking-tight">
          <em className="text-[#89b4fa] not-italic">&lt;</em> W <em className="text-[#89b4fa] not-italic">/&gt;</em>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-1.5 ml-auto">
        <span className="hidden lg:block text-[#cdd6f4] text-[13px] opacity-60 mr-1">{t("template")}</span>
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
          <button className="update-dismiss" onClick={onDismissUpdate}>
            x
          </button>
        </div>
      )}
    </header>
  )
}
