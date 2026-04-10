/**
 * SortableCard
 *
 * Carte draggable individuelle avec "drag handle".
 * Utilisee dans les sections dynamiques (experiences, skills, etc.).
 */
import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function DragHandle({ listeners, attributes }) {
  return (
    <button
      className="drag-handle"
      {...listeners}
      {...attributes}
      title="Glisser pour réorganiser"
      tabIndex={-1}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="5" r="1" fill="currentColor" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="9" cy="19" r="1" fill="currentColor" />
        <circle cx="15" cy="5" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
        <circle cx="15" cy="19" r="1" fill="currentColor" />
      </svg>
    </button>
  )
}

export default function SortableCard({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
  }

  return (
    <div ref={setNodeRef} style={style} className="dynamic-card">
      <div className="drag-handle-wrap">
        <DragHandle listeners={listeners} attributes={attributes} />
      </div>
      {children}
    </div>
  )
}
