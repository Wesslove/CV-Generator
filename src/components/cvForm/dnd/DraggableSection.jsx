/**
 * DraggableSection
 * Rôle : encapsule une section avec le comportement sortable dnd-kit.
 * Entrées : cle de section, liste items, callback reorder, renderer item.
 * Sorties : evenements de drag traduits vers onReorder(from,to).
 * Responsabilités :
 * - configurer les capteurs et la strategie de collision
 * - mapper les ids draggables vers les indices
 * - appeler le handler de reorder parent en securite
 */
import React from "react"
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

export default function DraggableSection({ section, items, onReorder, renderItem }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return

    const oldIdx = items.findIndex((i) => i.id === active.id)
    const newIdx = items.findIndex((i) => i.id === over.id)
    if (oldIdx !== -1 && newIdx !== -1) onReorder(section, oldIdx, newIdx)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item, idx) => renderItem(item, idx))}
      </SortableContext>
    </DndContext>
  )
}
