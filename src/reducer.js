// ─────────────────────────────────────────────────────────────
// reducer.js
// Toute la logique de modification de l'état du CV.
// Un reducer est une fonction PURE : mêmes entrées → même sortie.
// Aucun appel API, aucun side-effect ici.
// ─────────────────────────────────────────────────────────────

/**
 * Génère un ID unique basé sur l'heure + un nombre aléatoire.
 * Plus fiable que Date.now() seul (évite les collisions).
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Le reducer principal. Reçoit l'état actuel et une action,
 * retourne un NOUVEL état (ne modifie jamais l'ancien).
 *
 * @param {object} state  - État actuel du CV
 * @param {object} action - { type, ...payload }
 * @returns {object}      - Nouvel état
 */
export function cvReducer(state, action) {
  switch (action.type) {

    // ── Champs simples (name, title, email, photo, template…) ─
    case "SET_FIELD":
      return { ...state, [action.name]: action.value }

    // ── Sections dynamiques (experiences, skills, etc.) ───────
    case "ADD_ITEM":
      return {
        ...state,
        [action.section]: [
          ...state[action.section],
          { id: generateId(), ...action.item },
        ],
      }

    case "UPDATE_ITEM":
      return {
        ...state,
        [action.section]: state[action.section].map((item) =>
          item.id === action.id
            ? { ...item, [action.name]: action.value }
            : item
        ),
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        [action.section]: state[action.section].filter(
          (item) => item.id !== action.id
        ),
      }

    case "REORDER_ITEM": {
      // Réorganise un item d'un index vers un autre
      const list = [...state[action.section]]
      const [moved] = list.splice(action.from, 1)
      list.splice(action.to, 0, moved)
      return { ...state, [action.section]: list }
    }

    // ── Sections personnalisées ────────────────────────────────
    case "ADD_CUSTOM_SECTION":
      return {
        ...state,
        customSections: [
          ...state.customSections,
          { id: generateId(), title: "", items: [] },
        ],
      }

    case "UPDATE_CUSTOM_SECTION":
      return {
        ...state,
        customSections: state.customSections.map((sec) =>
          sec.id === action.id
            ? { ...sec, [action.name]: action.value }
            : sec
        ),
      }

    case "REMOVE_CUSTOM_SECTION":
      return {
        ...state,
        customSections: state.customSections.filter(
          (sec) => sec.id !== action.id
        ),
      }

    case "ADD_CUSTOM_ITEM":
      return {
        ...state,
        customSections: state.customSections.map((sec) =>
          sec.id === action.sectionId
            ? { ...sec, items: [...sec.items, { id: generateId(), bullets: [""] }] }
            : sec
        ),
      }

    case "UPDATE_CUSTOM_ITEM":
      return {
        ...state,
        customSections: state.customSections.map((sec) =>
          sec.id === action.sectionId
            ? {
                ...sec,
                items: sec.items.map((item) =>
                  item.id === action.itemId
                    ? { ...item, [action.name]: action.value }
                    : item
                ),
              }
            : sec
        ),
      }

    case "REMOVE_CUSTOM_ITEM":
      return {
        ...state,
        customSections: state.customSections.map((sec) =>
          sec.id === action.sectionId
            ? { ...sec, items: sec.items.filter((it) => it.id !== action.itemId) }
            : sec
        ),
      }

    // ── Chargement complet (import JSON / localStorage) ───────
    case "LOAD":
      return action.data

    // ── Action inconnue : retourne l'état sans modification ───
    default:
      return state
  }
}