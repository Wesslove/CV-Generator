// PhotoCropModal.jsx – Recadrage photo par canvas (zoom, pan, rond/carré)
import React, { useRef, useState, useEffect, useCallback } from "react"

const OUTPUT_SIZE = 400 // px carré de sortie

export default function PhotoCropModal({ src, onConfirm, onClose, lang = "fr" }) {
  const canvasRef   = useRef(null)
  const imgRef      = useRef(new Image())
  const dragging    = useRef(false)
  const lastPos     = useRef({ x: 0, y: 0 })

  const [zoom,   setZoom]   = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [shape,  setShape]  = useState("round") // "round" | "square"
  const [ready,  setReady]  = useState(false)

  const L = {
    fr: { title: "Recadrer la photo", round: "⬤ Rond", square: "■ Carré", zoom: "Zoom", confirm: "Confirmer", cancel: "Annuler", hint: "Glissez pour repositionner" },
    en: { title: "Crop photo", round: "⬤ Round", square: "■ Square", zoom: "Zoom", confirm: "Confirm", cancel: "Cancel", hint: "Drag to reposition" },
  }
  const t = L[lang] || L.fr

  // ── Load image ───────────────────────────────────────────────
  useEffect(() => {
    const img = imgRef.current
    img.onload = () => {
      // Centre l'image et calcule le zoom min pour couvrir le canvas
      const minZoom = Math.max(OUTPUT_SIZE / img.width, OUTPUT_SIZE / img.height)
      setZoom(minZoom)
      setOffset({ x: 0, y: 0 })
      setReady(true)
    }
    img.src = src
  }, [src])

  // ── Draw ─────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !ready) return
    const ctx = canvas.getContext("2d")
    const img = imgRef.current
    const S = OUTPUT_SIZE

    ctx.clearRect(0, 0, S, S)

    // Clip round/square
    ctx.save()
    if (shape === "round") {
      ctx.beginPath()
      ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    const w = img.width  * zoom
    const h = img.height * zoom
    const x = (S - w) / 2 + offset.x
    const y = (S - h) / 2 + offset.y
    ctx.drawImage(img, x, y, w, h)
    ctx.restore()

    // Border circle/square guide
    ctx.strokeStyle = "rgba(255,255,255,0.8)"
    ctx.lineWidth = 2
    if (shape === "round") {
      ctx.beginPath()
      ctx.arc(S / 2, S / 2, S / 2 - 1, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      ctx.strokeRect(1, 1, S - 2, S - 2)
    }
  }, [ready, zoom, offset, shape])

  useEffect(() => { draw() }, [draw])

  // ── Mouse / Touch events ─────────────────────────────────────
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches?.[0]
    return {
      x: (touch ? touch.clientX : e.clientX) - rect.left,
      y: (touch ? touch.clientY : e.clientY) - rect.top,
    }
  }

  const onDown = (e) => {
    dragging.current = true
    lastPos.current = getPos(e)
  }

  const onMove = (e) => {
    if (!dragging.current) return
    e.preventDefault()
    const pos = getPos(e)
    const dx = pos.x - lastPos.current.x
    const dy = pos.y - lastPos.current.y
    lastPos.current = pos

    const img = imgRef.current
    const w = img.width  * zoom
    const h = img.height * zoom
    const S = OUTPUT_SIZE

    setOffset(prev => {
      // Empêcher de voir du vide en dehors de l'image
      const nx = Math.min(0, Math.max(S - w, prev.x + dx))
      const ny = Math.min(0, Math.max(S - h, prev.y + dy))
      return { x: nx, y: ny }
    })
  }

  const onUp = () => { dragging.current = false }

  // ── Zoom via wheel ───────────────────────────────────────────
  const onWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    handleZoom(zoom + delta)
  }

  const handleZoom = (newZoom) => {
    const img = imgRef.current
    const minZoom = Math.max(OUTPUT_SIZE / img.width, OUTPUT_SIZE / img.height)
    const clamped = Math.min(4, Math.max(minZoom, newZoom))

    // Recalcule offset pour que l'image couvre toujours le canvas
    const w = img.width  * clamped
    const h = img.height * clamped
    const S = OUTPUT_SIZE
    setZoom(clamped)
    setOffset(prev => ({
      x: Math.min(0, Math.max(S - w, prev.x)),
      y: Math.min(0, Math.max(S - h, prev.y)),
    }))
  }

  // ── Export ───────────────────────────────────────────────────
  const handleConfirm = () => {
    const canvas = canvasRef.current
    // Exporte en JPEG 90% pour un bon ratio qualité/taille
    onConfirm(canvas.toDataURL("image/jpeg", 0.9))
  }

  return (
    <div className="crop-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="crop-modal">
        <div className="crop-modal-header">
          <span className="crop-title">{t.title}</span>
          <button className="crop-close" onClick={onClose}>✕</button>
        </div>

        <div className="crop-canvas-wrap">
          <canvas
            ref={canvasRef}
            width={OUTPUT_SIZE}
            height={OUTPUT_SIZE}
            className="crop-canvas"
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
            onWheel={onWheel}
            style={{ cursor: "grab" }}
          />
          <p className="crop-hint">{t.hint}</p>
        </div>

        <div className="crop-controls">
          <div className="crop-shape-btns">
            <button
              className={`crop-shape-btn ${shape === "round" ? "active" : ""}`}
              onClick={() => setShape("round")}
            >{t.round}</button>
            <button
              className={`crop-shape-btn ${shape === "square" ? "active" : ""}`}
              onClick={() => setShape("square")}
            >{t.square}</button>
          </div>

          <div className="crop-zoom-row">
            <span className="crop-zoom-label">{t.zoom}</span>
            <input
              type="range"
              className="crop-zoom-slider"
              min={50} max={400} step={1}
              value={Math.round(zoom * 100)}
              onChange={e => handleZoom(Number(e.target.value) / 100)}
            />
            <span className="crop-zoom-pct">{Math.round(zoom * 100)}%</span>
          </div>
        </div>

        <div className="crop-actions">
          <button className="crop-btn-cancel" onClick={onClose}>{t.cancel}</button>
          <button className="crop-btn-confirm" onClick={handleConfirm}>{t.confirm}</button>
        </div>
      </div>
    </div>
  )
}