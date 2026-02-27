// App.jsx – gestion d'état globale avec useReducer
import React, { useReducer, useEffect, useState } from "react"
import CVForm from "./components/CVForm"
import CVPreview from "./components/CVPreview"
import "./index.css"

const initialCv = {
  name: "",
  title: "",
  phone: "",
  email: "",
  location: "",
  linkedin: "",
  summary: "",
  photo: null,
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  template: "classic"
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.name]: action.value }
    case "ADD_ITEM":
      return { ...state, [action.section]: [...state[action.section], action.item] }
    case "UPDATE_ITEM":
      return {
        ...state,
        [action.section]: state[action.section].map((item) =>
          item.id === action.id ? { ...item, [action.name]: action.value } : item
        )
      }
    case "REMOVE_ITEM":
      return {
        ...state,
        [action.section]: state[action.section].filter((item) => item.id !== action.id)
      }
    case "REORDER_ITEM": {
      const list = [...state[action.section]]
      const [moved] = list.splice(action.from, 1)
      list.splice(action.to, 0, moved)
      return { ...state, [action.section]: list }
    }
    case "LOAD":
      return action.data
    default:
      return state
  }
}

export default function App() {
  const [cvData, dispatch] = useReducer(reducer, initialCv)
  const [saved, setSaved] = useState(false)
  const [mobileTab, setMobileTab] = useState("edit")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cvData")
      if (stored) {
        const parsed = JSON.parse(stored)
        dispatch({ type: "LOAD", data: { ...initialCv, ...parsed } })
      }
    } catch (_) {}
  }, [])

  useEffect(() => {
    const { photo, ...toSave } = cvData
    localStorage.setItem("cvData", JSON.stringify(toSave))
    setSaved(true)
    const t = setTimeout(() => setSaved(false), 1500)
    return () => clearTimeout(t)
  }, [cvData])

  const handleChange = (e) => {
    dispatch({ type: "SET_FIELD", name: e.target.name, value: e.target.value })
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => dispatch({ type: "SET_FIELD", name: "photo", value: ev.target.result })
    reader.readAsDataURL(file)
  }

  const addItem = (section, template) => {
    dispatch({ type: "ADD_ITEM", section, item: { id: Date.now(), ...template } })
  }

  const updateItem = (section, id, name, value) => {
    dispatch({ type: "UPDATE_ITEM", section, id, name, value })
  }

  const removeItem = (section, id) => {
    dispatch({ type: "REMOVE_ITEM", section, id })
  }

  const setTemplate = (t) => dispatch({ type: "SET_FIELD", name: "template", value: t })

  return (
    <div className="app-layout">
      <header className="top-bar">
        <div className="top-bar-brand">
          <span className="brand-name"><em>&lt;</em> W <em>/&gt;</em></span>
        </div>
        <div className="template-switcher">
          <span className="switcher-label">Template</span>
          {["classic", "modern", "minimal", "executive"].map((t) => (
            <button
              key={t}
              className={`tpl-btn ${cvData.template === t ? "active" : ""}`}
              onClick={() => setTemplate(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className={`save-indicator ${saved ? "visible" : ""}`}>
          ✓ Sauvegardé
        </div>
      </header>

      <div className="main-content">
        <aside className={`form-sidebar ${mobileTab !== "edit" ? "mobile-hidden" : ""}`}>
          <CVForm
            cvData={cvData}
            onChange={handleChange}
            onPhoto={handlePhoto}
            onAdd={addItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            onTemplateChange={setTemplate}
          />
        </aside>

        <main className={`preview-area ${mobileTab !== "preview" ? "mobile-hidden" : ""}`}
          style={mobileTab === "preview" ? {} : {}}>
          <div className="preview-controls">
            <span className="preview-label">Aperçu en direct</span>
            <button className="print-btn" onClick={() => window.print()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Télécharger PDF
            </button>
          </div>
          <div className="preview-scroll">
            <CVPreview cvData={cvData} />
          </div>
        </main>
      </div>

      {/* Barre de navigation mobile fixe en bas */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mob-nav-btn ${mobileTab === "edit" ? "active" : ""}`}
          onClick={() => setMobileTab("edit")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span>Éditer</span>
        </button>
        <button
          className={`mob-nav-btn ${mobileTab === "preview" ? "active" : ""}`}
          onClick={() => setMobileTab("preview")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>Aperçu</span>
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