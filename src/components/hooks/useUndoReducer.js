/**
 * useUndoReducer
 * Rôle : ajoute undo/redo par-dessus un reducer.
 */

import { useState, useCallback } from "react"

const MAX_HISTORY = 30

const SKIP_UNDO = new Set([
  "SET_FIELD",
  "UPDATE_ITEM",
  "UPDATE_CUSTOM_SECTION",
  "UPDATE_CUSTOM_ITEM",
])

export function useUndoReducer(reducerFn, initial) {
  const [history, setHistory] = useState({
    past: [],
    present: initial,
    future: [],
  })

  const dispatch = useCallback(
    (action) => {
      setHistory((h) => {
        const next = reducerFn(h.present, action)

        if (SKIP_UNDO.has(action.type)) {
          return { ...h, present: next, future: [] }
        }

        const past = [...h.past, h.present].slice(-MAX_HISTORY)
        return { past, present: next, future: [] }
      })
    },
    [reducerFn]
  )

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h
      const past = [...h.past]
      const previous = past.pop()
      const future = [h.present, ...h.future].slice(0, MAX_HISTORY)
      return { past, present: previous, future }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h
      const future = [...h.future]
      const next = future.shift()
      const past = [...h.past, h.present].slice(-MAX_HISTORY)
      return { past, present: next, future }
    })
  }, [])

  const commitToHistory = useCallback(() => {
    setHistory((h) => {
      const past = [...h.past, h.present].slice(-MAX_HISTORY)
      return { ...h, past, future: [] }
    })
  }, [])

  const resetHistory = useCallback((nextState) => {
    setHistory({ past: [], present: nextState, future: [] })
  }, [])

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  return [history.present, dispatch, undo, redo, canUndo, canRedo, commitToHistory, resetHistory]
}
