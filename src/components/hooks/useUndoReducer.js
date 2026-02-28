// ─────────────────────────────────────────────────────────────
// hooks/useUndoReducer.js
// Hook personnalisé qui ajoute un système Annuler (Ctrl+Z)
// à n'importe quel reducer React.
//
// Utilisation :
//   const [state, dispatch, undo, canUndo, commitToHistory] =
//     useUndoReducer(monReducer, valeurInitiale)
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from "react"

// Nombre maximum d'états sauvegardés dans l'historique.
// Augmenter = plus de mémoire utilisée.
const MAX_HISTORY = 30

// Ces actions sont trop granulaires pour l'historique
// (une frappe par lettre = trop de snapshots).
// Elles mettent à jour l'état mais sans créer de checkpoint.
// Le checkpoint est créé sur "blur" (onBlur) via commitToHistory.
const SKIP_UNDO = new Set([
  "SET_FIELD",
  "UPDATE_ITEM",
  "UPDATE_CUSTOM_SECTION",
  "UPDATE_CUSTOM_ITEM",
])

/**
 * @param {function} reducerFn  - Le reducer à utiliser
 * @param {object}   initial    - L'état initial
 * @returns {[state, dispatch, undo, canUndo, commitToHistory]}
 */
export function useUndoReducer(reducerFn, initial) {
  const [history, setHistory] = useState({
    past:    [],      // Liste des états précédents
    present: initial, // État actuel
  })

  // dispatch : envoie une action au reducer
  const dispatch = useCallback(
    (action) => {
      setHistory((h) => {
        const next = reducerFn(h.present, action)

        if (SKIP_UNDO.has(action.type)) {
          // Mise à jour silencieuse : pas de checkpoint
          return { ...h, present: next }
        }

        // Checkpoint : sauvegarde l'état avant la modification
        const past = [...h.past, h.present].slice(-MAX_HISTORY)
        return { past, present: next }
      })
    },
    [reducerFn]
  )

  // undo : revient à l'état précédent
  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h // Rien à annuler
      const past = [...h.past]
      const previous = past.pop()
      return { past, present: previous }
    })
  }, [])

  // commitToHistory : crée manuellement un checkpoint
  // Appelé sur onBlur pour sauvegarder après la saisie
  const commitToHistory = useCallback(() => {
    setHistory((h) => {
      const past = [...h.past, h.present].slice(-MAX_HISTORY)
      return { ...h, past }
    })
  }, [])

  const canUndo = history.past.length > 0

  return [history.present, dispatch, undo, canUndo, commitToHistory]
}