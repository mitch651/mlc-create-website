"use client"

import createGlobe from "cobe"
import type { Globe } from "cobe"
import { useCallback, useEffect, useRef } from "react"

export interface PulseMarker {
  id: string
  location: [number, number]
  delay: number
}

export interface GlobePulseProps {
  markers?: PulseMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: PulseMarker[] = [
  { id: "pulse-1", location: [51.51, -0.13], delay: 0 },
  { id: "pulse-2", location: [40.71, -74.01], delay: 0.5 },
  { id: "pulse-3", location: [35.68, 139.65], delay: 1 },
  { id: "pulse-4", location: [-33.87, 151.21], delay: 1.5 },
]

/** Cyan used for COBE markers (0–1 RGB) — matches site accent */
const MARKER_RGB: [number, number, number] = [0.2, 0.8, 0.85]
const ARC_RGB: [number, number, number] = [0.25, 0.82, 0.92]

export function GlobePulse({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: Globe | null = null
    let animationId: number | undefined
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [0.12, 0.14, 0.16],
        markerColor: MARKER_RGB,
        glowColor: [0.02, 0.04, 0.06],
        markerElevation: 0,
        markers: markers.map((m) => ({
          location: m.location,
          size: 0.025,
          id: m.id,
        })),
        arcs: [],
        arcColor: ARC_RGB,
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.72,
      })

      function animate() {
        if (!isPausedRef.current) phi += speed
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        })
        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => {
        if (canvas) canvas.style.opacity = "1"
      }, 80)
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width && entries[0].contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId !== undefined) cancelAnimationFrame(animationId)
      globe?.destroy()
    }
  }, [markers, speed])

  return (
    <div className={`relative aspect-square max-w-full select-none ${className}`}>
      <style>{`
        @keyframes globe-pulse-ring {
          0% { transform: scale(0.45); opacity: 0.55; }
          100% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        {markers.map((m) => (
          <span
            key={m.id}
            className="absolute rounded-full border-2 border-[var(--accent-cyan)]"
            style={{
              width: "42%",
              height: "42%",
              animation: `globe-pulse-ring 2.4s ease-out infinite`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerUp}
        className="relative z-[1] h-full w-full rounded-full touch-none"
        style={{
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  )
}
